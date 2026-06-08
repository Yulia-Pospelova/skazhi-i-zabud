const modelInput = document.querySelector("#model-url");
const loadButton = document.querySelector(".vosk-load-button");
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

loadButton.addEventListener("click", loadModel);
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
  startButton.disabled = true;
  setStatus("загружаю модель");

  try {
    model = await Vosk.createModel(modelUrl);
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
  } catch (error) {
    console.error(error);
    setStatus("модель не загрузилась");
    loadButton.disabled = false;
  }
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
