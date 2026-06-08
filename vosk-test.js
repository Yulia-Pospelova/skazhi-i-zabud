const modelInput = document.querySelector("#model-url");
const loadButton = document.querySelector(".vosk-load-button");
const cancelButton = document.querySelector(".vosk-cancel-button");
const startButton = document.querySelector(".vosk-start-button");
const statusText = document.querySelector(".vosk-status");
const partialText = document.querySelector(".vosk-partial");
const resultList = document.querySelector(".vosk-list");

let model = null;
let recognizer = null;
let mediaStream = null;
let audioContext = null;
let processor = null;
let isListening = false;
let loadStartedAt = 0;
let loadTimer = null;

loadButton.addEventListener("click", loadModel);
cancelButton.addEventListener("click", cancelModelLoading);
startButton.addEventListener("click", toggleListening);

async function loadModel() {
  if (!window.Vosk) {
    setStatus("vosk не загрузился");
    return;
  }

  const modelUrl = modelInput.value.trim();

  if (!modelUrl) {
    setStatus("укажи адрес модели");
    return;
  }

  loadButton.disabled = true;
  cancelButton.hidden = false;
  startButton.disabled = true;
  startLoadTimer();

  try {
    model = await Vosk.createModel(modelUrl);
    stopLoadTimer();
    recognizer = new model.KaldiRecognizer(16000);
    recognizer.setWords(true);

    recognizer.on("result", (message) => {
      const text = message.result?.text?.trim();

      if (text) {
        addResult(text);
      }
    });

    recognizer.on("partialresult", (message) => {
      partialText.textContent = message.result?.partial || "...";
    });

    setStatus("модель загружена");
    startButton.disabled = false;
    loadButton.disabled = false;
    cancelButton.hidden = true;
  } catch (error) {
    stopLoadTimer();
    console.error(error);
    setStatus("модель не загрузилась");
    loadButton.disabled = false;
    cancelButton.hidden = true;
  }
}

function startLoadTimer() {
  loadStartedAt = Date.now();
  updateLoadStatus();
  clearInterval(loadTimer);
  loadTimer = setInterval(updateLoadStatus, 5000);
}

function stopLoadTimer() {
  clearInterval(loadTimer);
  loadTimer = null;
}

function updateLoadStatus() {
  const seconds = Math.round((Date.now() - loadStartedAt) / 1000);

  if (seconds >= 120) {
    setStatus(`загружаю ${seconds} секунд. если дальше не меняется, телефон или браузер может не тянуть модель`);
    return;
  }

  setStatus(`загружаю модель, ${seconds} секунд`);
}

function cancelModelLoading() {
  stopListening();
  window.location.reload();
}

async function toggleListening() {
  if (isListening) {
    stopListening();
    return;
  }

  await startListening();
}

async function startListening() {
  if (!recognizer) {
    setStatus("сначала загрузи модель");
    return;
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        channelCount: 1,
        sampleRate: 16000,
      },
    });

    audioContext = new AudioContext();
    processor = audioContext.createScriptProcessor(4096, 1, 1);
    processor.onaudioprocess = (event) => {
      if (!isListening) {
        return;
      }

      try {
        recognizer.acceptWaveform(event.inputBuffer);
      } catch (error) {
        console.error("acceptWaveform failed", error);
      }
    };

    const source = audioContext.createMediaStreamSource(mediaStream);
    source.connect(processor);
    processor.connect(audioContext.destination);

    isListening = true;
    startButton.textContent = "стоп";
    setStatus("слушаю");
  } catch (error) {
    console.error(error);
    setStatus("микрофон не запустился");
  }
}

function stopListening() {
  isListening = false;
  startButton.textContent = "старт";
  partialText.textContent = "...";
  setStatus("остановлено");

  if (processor) {
    processor.disconnect();
    processor = null;
  }

  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
}

function addResult(text) {
  const item = document.createElement("li");
  item.textContent = text;
  resultList.prepend(item);
}

function setStatus(text) {
  statusText.textContent = text;
}
