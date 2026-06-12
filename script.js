let startButton = null;
let phraseInput = null;
let manualForm = null;
let manualInput = null;
let statusText = null;
let srStatus = null;
let seriesOkButton = null;
let notifyButton = null;
let notifyStatus = null;
let soundToggle = null;
let popupToggle = null;
let notifyToggle = null;
let settingsPanel = null;
let startHint = null;
let editConfirmButton = null;
let editVoiceActive = false;
let editVoiceSilenceTimer = null;
let editHasChanges = false;
let pendingEditItem = null;
let editPreviewCard = null;
let editVoiceResult = null;
let editManualCard = null;
let editManualPreview = null;
let manualDateDisplay = null;
let calendarToggleButton = null;
let calendarWrap = null;
let calendarModal = null;
let calendarCloseButton = null;
let editManualConfirmButton = null;
let manualSearchMode = false;
let manualPlaceholder = null;
let searchSilenceTimer = null;
let manualSearchTimer = null;
let manualIdleTimer = null;
let examplesButton = null;
let themeToggleButton = null;
let examplesPanel = null;
let examplesModal = null;
let examplesCloseButton = null;
let clearButton = null;
let searchButton = null;
let searchModal = null;
let searchResults = null;
let searchTitle = null;
let searchCloseButton = null;
let searchOkButton = null;
let editModal = null;
let editCard = null;
let editOkButton = null;
let editVoiceButton = null;
let editManualButton = null;
let editVoiceStartButton = null;
let editVoicePanel = null;
let editManualPanel = null;
let calendarTitle = null;
let calendarGrid = null;
let calendarPrevButton = null;
let calendarNextButton = null;
let calendarMonthTitleButton = null;
let calendarTimeForm = null;
let calendarTimeInput = null;
let editNameInput = null;
let hourSelect = null;
let minuteSelect = null;
let calendarClearTimeButton = null;
let list = null;
let topButton = null;
let debugPanel = null;
let debugList = null;

const STORAGE_KEY = "expiry-reminders";
const AI_DEBUG_STORAGE_KEY = "expiry-reminders-ai-debug";
// После публикации Cloudflare Worker вставить сюда его адрес.
const AI_PROXY_URL = ""; // ИИ/облако отключены: приложение использует только встроенное распознавание браузера.
const AI_REQUEST_TIMEOUT_MS = 3500;
const AI_MIN_NAME_LENGTH = 2;
const DEBUG_MODE = new URLSearchParams(window.location.search).has("debug");
const PREVIEW_THEMES = new Set(["calm", "warm", "dark", "pink", "aqua"]);
const MESSAGE_VISIBLE_MS = 4000;
const SHORT_MESSAGE_VISIBLE_MS = 2200;
const SINGLE_CLICK_DELAY_MS = 420;
const LONG_PRESS_DELAY_MS = 800;
const ERROR_SPEAK_COOLDOWN_MS = 2500;
const ERROR_REPEAT_MESSAGE_COOLDOWN_MS = 4500;
const SPECIFIC_ERROR_COOLDOWN_MS = 5000;
const SERIES_SILENCE_TIMEOUT_MS = 7000;
const MODAL_IDLE_TIMEOUT_MS = 10000;
const MAX_LOCAL_TIMER_MS = 2147483647;
const reminderRules = [
  { days: 30, label: "за месяц" },
  { days: 7, label: "за неделю" },
  { days: 1, label: "за день" },
];
const suspiciousAINames = new Set([
  "предмет",
  "напоминание",
  "событие",
  "дело",
  "задача",
  "что-то",
  "что то",
  "хабиб",
]);
const monthNames = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];
const monthDisplayNames = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];
const monthPrepositionNames = [
  "январе",
  "феврале",
  "марте",
  "апреле",
  "мае",
  "июне",
  "июле",
  "августе",
  "сентябре",
  "октябре",
  "ноябре",
  "декабре",
];
const monthMap = {
  январь: 0,
  январе: 0,
  января: 0,
  феврале: 1,
  февраль: 1,
  февраля: 1,
  март: 2,
  марте: 2,
  марта: 2,
  апрель: 3,
  апреле: 3,
  апреля: 3,
  май: 4,
  мае: 4,
  мая: 4,
  июнь: 5,
  июне: 5,
  июня: 5,
  июль: 6,
  июле: 6,
  июля: 6,
  август: 7,
  августе: 7,
  августа: 7,
  сентябрь: 8,
  сентябре: 8,
  сентября: 8,
  октябрь: 9,
  октябре: 9,
  октября: 9,
  ноябрь: 10,
  ноябре: 10,
  ноября: 10,
  декабрь: 11,
  декабре: 11,
  декабря: 11,
};
const monthWordPattern = Object.keys(monthMap).sort((a, b) => b.length - a.length).join("|");
const hourWordMap = {
  один: 1,
  одна: 1,
  два: 2,
  две: 2,
  три: 3,
  четыре: 4,
  пять: 5,
  шесть: 6,
  семь: 7,
  восемь: 8,
  девять: 9,
  десять: 10,
  одиннадцать: 11,
  двенадцать: 12,
  тринадцать: 13,
  четырнадцать: 14,
  пятнадцать: 15,
  шестнадцать: 16,
  семнадцать: 17,
  восемнадцать: 18,
  девятнадцать: 19,
  двадцать: 20,
  "двадцать один": 21,
  "двадцать два": 22,
  "двадцать три": 23,
};
const amountWordMap = {
  один: 1,
  одна: 1,
  одну: 1,
  одно: 1,
  два: 2,
  две: 2,
  три: 3,
  четыре: 4,
  пять: 5,
  шесть: 6,
  семь: 7,
  восемь: 8,
  девять: 9,
  десять: 10,
};
const dayWordMap = {
  первого: 1,
  второе: 2,
  второго: 2,
  третье: 3,
  третьего: 3,
  четвертое: 4,
  четвертого: 4,
  пятое: 5,
  пятого: 5,
  шестое: 6,
  шестого: 6,
  седьмое: 7,
  седьмого: 7,
  восьмое: 8,
  восьмого: 8,
  девятое: 9,
  девятого: 9,
  десятое: 10,
  десятого: 10,
  одиннадцатое: 11,
  одиннадцатого: 11,
  двенадцатое: 12,
  двенадцатого: 12,
  тринадцатое: 13,
  тринадцатого: 13,
  четырнадцатое: 14,
  четырнадцатого: 14,
  пятнадцатое: 15,
  пятнадцатого: 15,
  шестнадцатое: 16,
  шестнадцатого: 16,
  семнадцатое: 17,
  семнадцатого: 17,
  восемнадцатое: 18,
  восемнадцатого: 18,
  девятнадцатое: 19,
  девятнадцатого: 19,
  двадцатое: 20,
  двадцатого: 20,
  "двадцать первое": 21,
  "двадцать первого": 21,
  "двадцать второе": 22,
  "двадцать второго": 22,
  "двадцать третье": 23,
  "двадцать третьего": 23,
  "двадцать четвертое": 24,
  "двадцать четвертого": 24,
  "двадцать пятое": 25,
  "двадцать пятого": 25,
  "двадцать шестое": 26,
  "двадцать шестого": 26,
  "двадцать седьмое": 27,
  "двадцать седьмого": 27,
  "двадцать восьмое": 28,
  "двадцать восьмого": 28,
  "двадцать девятое": 29,
  "двадцать девятого": 29,
  тридцатое: 30,
  тридцатого: 30,
  "тридцать первое": 31,
  "тридцать первого": 31,
};
const weekdayMap = {
  понедельник: 1,
  понедельника: 1,
  вторник: 2,
  вторника: 2,
  среду: 3,
  среда: 3,
  среды: 3,
  четверг: 4,
  четверга: 4,
  пятницу: 5,
  пятница: 5,
  пятницы: 5,
  субботу: 6,
  суббота: 6,
  субботы: 6,
  воскресенье: 0,
  воскресенья: 0,
};
const weekdayWordPattern = Object.keys(weekdayMap).sort((a, b) => b.length - a.length).join("|");

let items = [];
let recognition = null;
let statusTimer = null;
let srStatusTimer = null;
let notifyStatusTimer = null;
let phraseTimer = null;
let restartTimer = null;
let seriesSilenceTimer = null;
let editModalTimer = null;
let startClickTimer = null;
let longPressTimer = null;
let isLongPress = false;
let shouldSkipNextRestart = false;
let isRecognitionRunning = false;
let editingItemId = null;
let isSearchActive = false;
let searchReturnFocus = null;
let currentSearchItemIds = [];
let currentSearchQuery = "";
let calendarItemId = null;
let calendarYear = null;
let calendarMonth = null;
let previousPageOverflow = "";
let examplesReturnFocus = null;
let notificationTimers = [];
let isSeriesActive = false;
let lastErrorSpokenAt = 0;
let lastErrorPhrase = "";
let lastErrorMessage = "";
let lastSpecificErrorAt = 0;
let audioContext = null;
let lastParseError = "";
let expiryTickerId = null;
let reminderSettings = { sound: false, popup: false };
const SETTINGS_KEY = "skazhi-settings";
const THEME_KEY = "skazhi-theme";

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if (saved && typeof saved === "object") {
      reminderSettings = {
        sound: saved.sound === true,
        popup: saved.popup === true,
      };
    }
  } catch (error) {
    // нет сохранённых настроек — оставляем по умолчанию (всё включено)
  }
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(reminderSettings));
  } catch (error) {}
}

function setupSettings() {
  loadSettings();
  setupThemeToggle();

  if (soundToggle) {
    soundToggle.checked = reminderSettings.sound;
    soundToggle.addEventListener("change", () => {
      reminderSettings.sound = soundToggle.checked;
      saveSettings();
    });
  }

  if (popupToggle) {
    popupToggle.checked = reminderSettings.popup;
    popupToggle.addEventListener("change", () => {
      reminderSettings.popup = popupToggle.checked;
      saveSettings();
    });
  }

  if (notifyToggle) {
    updateNotifyToggle();
    notifyToggle.addEventListener("change", async () => {
      if (notifyToggle.checked) {
        await requestNotificationPermission();
      } else {
        showNotifyStatus("уведомления выключаются в настройках телефона");
      }
      updateNotifyToggle();
    });
  }
}

function updateNotifyToggle() {
  if (!notifyToggle) {
    return;
  }
  const granted = ("Notification" in window) && Notification.permission === "granted";
  notifyToggle.checked = granted;
}

function toggleSettingsPanel() {
  if (!settingsPanel) {
    return;
  }
  const isOpen = settingsPanel.style.display !== "none";
  settingsPanel.style.display = isOpen ? "none" : "flex";
  if (notifyButton) {
    notifyButton.setAttribute("aria-expanded", String(!isOpen));
  }
}

function setupThemeToggle() {
  applyStoredTheme();

  if (!themeToggleButton) {
    return;
  }

  updateThemeToggleButton();
  themeToggleButton.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("theme-dark");
    try {
      localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    } catch (error) {}
    updateThemeToggleButton();
  });
}

function applyStoredTheme() {
  const themeFromUrl = new URLSearchParams(window.location.search).get("theme");
  let theme = "";

  if (themeFromUrl && PREVIEW_THEMES.has(themeFromUrl)) {
    theme = themeFromUrl;
  } else {
    try {
      theme = localStorage.getItem(THEME_KEY) || "";
    } catch (error) {}
  }

  if (theme === "dark") {
    document.body.classList.add("theme-dark");
  }
}

function updateThemeToggleButton() {
  if (!themeToggleButton) {
    return;
  }

  const isDark = document.body.classList.contains("theme-dark");
  themeToggleButton.setAttribute("aria-pressed", String(isDark));
  themeToggleButton.setAttribute("aria-label", isDark ? "включить светлую тему" : "включить тёмную тему");
  themeToggleButton.innerHTML = `<span aria-hidden="true">${isDark ? "☀" : "☾"}</span>`;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

function initApp() {
  try {
    applyPreviewTheme();
    assignElements();
    items = sortByDate(loadItems());
    removeExpiredItems();
    if (list) {
      renderList();
    }
    // Каждый блок настройки защищён, чтобы сбой в одном (например, голос)
    // не мешал подключить кнопки и ручной ввод ниже.
    try { setupSpeech(); } catch (error) { console.warn("setupSpeech failed", error); }
    try { scheduleAllNotifications(); } catch (error) { console.warn("notif failed", error); }
    try {
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission()
          .then(() => { try { scheduleAllNotifications(); } catch (error) {} })
          .catch(() => {});
      }
    } catch (error) {}
    try { startExpiryTicker(); } catch (error) { console.warn("ticker failed", error); }
    try { registerServiceWorker(); } catch (error) { console.warn("sw failed", error); }
    try { setupDebugPanel(); } catch (error) { console.warn("debug failed", error); }
    try { setupSettings(); } catch (error) { console.warn("settings failed", error); }
    try { populateTimeSelects(); } catch (error) { console.warn("time selects failed", error); }

    if (startButton) {
      startButton.addEventListener("click", handleStartClick);
      startButton.addEventListener("contextmenu", (event) => {
        event.preventDefault();
      });
    }

    if (notifyButton) {
      notifyButton.addEventListener("click", toggleSettingsPanel);
    }

    if (examplesButton) {
      examplesButton.addEventListener("click", openExamplesDialog);
    }

    if (clearButton) {
      clearButton.addEventListener("click", () => {
        showConfirm("очистить все напоминания?", () => {
          items = [];
          saveItems();
          renderList();
        });
      });
    }

    if (seriesOkButton) {
      seriesOkButton.addEventListener("click", finishSeriesByButton);
    }

    if (manualForm) {
      manualForm.addEventListener("submit", handleManualSubmit);
    }

    if (searchButton) {
      searchButton.addEventListener("click", startSearchListening);
    }

    if (manualInput) {
      // Если идёт поиск и тапнули в поле ручного ввода — выключаем голосовой
      // поиск; следующая отправка будет искать, а не создавать.
      manualInput.addEventListener("focus", () => {
        if (isSearchActive) {
          stopSearchVoice();
          manualSearchMode = true;
          startManualSearchIdleTimer();
        }
      });
      manualInput.addEventListener("input", () => {
        if (manualSearchMode) {
          startManualSearchIdleTimer();
        } else {
          startManualIdleTimer();
        }
      });
      manualInput.addEventListener("blur", () => {
        if (manualSearchMode && !manualInput.value.trim()) {
          manualSearchMode = false;
          clearTimeout(manualSearchTimer);
          if (manualPlaceholder) {
            manualPlaceholder.textContent = "или напиши";
          }
        }
      });
    }

    if (topButton) {
      topButton.addEventListener("click", scrollToAppTop);
    }

    if (searchCloseButton) {
      searchCloseButton.addEventListener("click", closeSearchDialog);
    }

    if (searchOkButton) {
      searchOkButton.addEventListener("click", closeSearchDialog);
    }

    if (editOkButton) {
      editOkButton.addEventListener("click", attemptCloseEdit);
    }

    if (editConfirmButton) {
      editConfirmButton.addEventListener("click", showSaveConfirm);
    }

    if (editManualConfirmButton) {
      editManualConfirmButton.addEventListener("click", showSaveConfirm);
    }

    if (calendarToggleButton) {
      calendarToggleButton.addEventListener("click", () => {
        openCalendarDialog();
      });
    }

    if (manualDateDisplay) {
      manualDateDisplay.addEventListener("click", openCalendarDialog);
    }

    if (calendarModal) {
      calendarModal.addEventListener("click", (event) => {
        if (event.target === calendarModal) {
          closeCalendarDialog();
        }
      });
    }

    if (editVoiceButton) {
      editVoiceButton.addEventListener("click", showVoiceEditPanel);
    }

    if (editManualButton) {
      editManualButton.addEventListener("click", showManualEditPanel);
    }

    if (editVoiceStartButton) {
      editVoiceStartButton.addEventListener("click", startEditVoiceListening);
    }

    if (calendarPrevButton) {
      calendarPrevButton.addEventListener("click", () => {
        changeCalendarMonth(-1);
      });
    }

    if (calendarNextButton) {
      calendarNextButton.addEventListener("click", () => {
        changeCalendarMonth(1);
      });
    }

    if (calendarMonthTitleButton) {
      calendarMonthTitleButton.addEventListener("click", selectCalendarMonth);
    }

    if (calendarTimeForm) {
      calendarTimeForm.addEventListener("submit", handleCalendarTimeSubmit);
    }

    if (calendarTimeInput) {
      calendarTimeInput.addEventListener("change", () => {
        applyCalendarTimeInput({ announce: true });
      });
    }

    if (calendarClearTimeButton) {
      calendarClearTimeButton.addEventListener("click", clearCalendarItemTime);
    }

    if (hourSelect) {
      hourSelect.addEventListener("change", () => applyCalendarTimeInput({ announce: true }));
    }

    if (minuteSelect) {
      minuteSelect.addEventListener("change", () => applyCalendarTimeInput({ announce: true }));
    }

    if (editNameInput) {
      editNameInput.addEventListener("change", applyEditNameInput);
      // Подсказка «название» исчезает при нажатии и возвращается, если поле пустое.
      editNameInput.addEventListener("focus", () => {
        editNameInput.placeholder = "";
      });
      editNameInput.addEventListener("blur", () => {
        if (!editNameInput.value) {
          editNameInput.placeholder = "название";
        }
      });
      // Enter сохраняет и остаётся в окне (не перезагружает страницу).
      editNameInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          applyEditNameInput();
          editNameInput.blur();
        }
      });
    }

    if (calendarGrid) {
      calendarGrid.addEventListener("click", handleCalendarGridClick);
    }

    if (examplesCloseButton) {
      examplesCloseButton.addEventListener("click", closeExamplesDialog);
    }

    document.addEventListener("keydown", handleDocumentKeydown);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        // Свернули/закрыли приложение — закрываем диалоги, чтобы открыть на главной.
        if (isEditDialogOpen()) {
          closeEditDialog();
        }
        if (isSearchDialogOpen()) {
          closeSearchDialog();
        }
      }
    });
  } catch (error) {
    console.error("App init failed", error);
  }
}

function applyPreviewTheme() {
  const theme = new URLSearchParams(window.location.search).get("theme");

  if (!theme || !PREVIEW_THEMES.has(theme)) {
    return;
  }

  document.body.classList.add(`theme-${theme}`);
}

function assignElements() {
  startButton = document.querySelector(".start-button");
  startHint = document.querySelector(".start-hint");
  phraseInput = document.querySelector(".phrase-input");
  manualForm = document.querySelector(".manual-form");
  manualInput = document.querySelector(".manual-input");
  manualPlaceholder = document.querySelector(".manual-input-placeholder");
  statusText = document.querySelector(".status");
  srStatus = document.querySelector(".sr-status");
  seriesOkButton = document.querySelector(".series-ok-button");
  notifyButton = document.querySelector(".notify-button");
  notifyStatus = document.querySelector(".notify-status");
  soundToggle = document.querySelector(".setting-sound");
  popupToggle = document.querySelector(".setting-popup");
  notifyToggle = document.querySelector(".setting-notify");
  settingsPanel = document.querySelector("#settings-panel");
  examplesButton = document.querySelector(".examples-button");
  themeToggleButton = document.querySelector(".theme-toggle-button");
  examplesPanel = document.querySelector(".examples-panel");
  examplesModal = document.querySelector(".examples-modal");
  examplesCloseButton = document.querySelector(".examples-close-button");
  clearButton = document.querySelector(".clear-button");
  searchButton = document.querySelector(".search-button");
  searchModal = document.querySelector(".search-modal");
  searchResults = document.querySelector(".search-results");
  searchTitle = document.querySelector("#search-dialog-title");
  searchCloseButton = document.querySelector(".search-close-button");
  searchOkButton = document.querySelector(".search-ok-button");
  editModal = document.querySelector(".edit-modal");
  editCard = document.querySelector(".edit-card-host");
  editPreviewCard = document.querySelector(".edit-preview-card");
  editVoiceResult = document.querySelector(".edit-voice-result");
  editManualCard = document.querySelector(".edit-manual-card");
  editManualPreview = document.querySelector(".edit-manual-preview");
  manualDateDisplay = document.querySelector(".manual-date-display");
  calendarToggleButton = document.querySelector(".calendar-toggle-button");
  calendarWrap = document.querySelector(".calendar-wrap");
  calendarModal = document.querySelector(".calendar-modal");
  calendarCloseButton = document.querySelector(".calendar-close-button");
  editManualConfirmButton = document.querySelector(".edit-manual-confirm-button");
  editOkButton = document.querySelector(".edit-close-button");
  editVoiceButton = document.querySelector(".edit-voice-button");
  editManualButton = document.querySelector(".edit-manual-button");
  editVoiceStartButton = document.querySelector(".edit-voice-start-button");
  editConfirmButton = document.querySelector(".edit-confirm-button");
  editVoicePanel = document.querySelector(".edit-voice-panel");
  editManualPanel = document.querySelector(".edit-manual-panel");
  calendarTitle = document.querySelector("#calendar-dialog-title");
  calendarGrid = document.querySelector(".calendar-grid");
  calendarPrevButton = document.querySelector(".calendar-prev-button");
  calendarNextButton = document.querySelector(".calendar-next-button");
  calendarMonthTitleButton = document.querySelector(".calendar-month-title-button");
  calendarTimeForm = document.querySelector(".calendar-time-form");
  calendarTimeInput = document.querySelector(".calendar-time-input");
  editNameInput = document.querySelector(".edit-name-input");
  hourSelect = document.querySelector(".calendar-hour-select");
  minuteSelect = document.querySelector(".calendar-minute-select");
  calendarClearTimeButton = document.querySelector(".calendar-clear-time-button");
  list = document.querySelector(".list");
  topButton = document.querySelector(".top-button");
  debugPanel = document.querySelector(".debug-panel");
  debugList = document.querySelector(".debug-list");
}

function scrollToAppTop() {
  const target = document.querySelector(".app") || document.body;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function handleStartClick() {
  unlockAudio();

  if (isSearchActive) {
    stopSearchVoice();
    cancelSearch();
    return;
  }

  // Повторное нажатие во время прослушивания работает как «стоп».
  if (isSeriesActive) {
    finishSeriesByButton();
    return;
  }

  startSeriesListening();
}

function handleStartPress() {
  unlockAudio();
  clearTimeout(longPressTimer);
  isLongPress = false;

  longPressTimer = setTimeout(() => {
    isLongPress = true;
    clearTimeout(startClickTimer);
    startSeriesListening();
  }, LONG_PRESS_DELAY_MS);
}

function clearStartPress() {
  clearTimeout(longPressTimer);
}

function startSingleListening() {
  if (!recognition) {
    showVoiceUnavailableFallback();
    return;
  }

  cancelEditing();
  cancelSearch();
  isSeriesActive = false;
  setRecognitionContinuous(false);
  startButton.classList.add("is-listening");
  showStatus("Слушаю");
  lastErrorPhrase = "";
  restartRecognition();
}

function stopSearchVoice() {
  if (!isSearchActive) {
    return;
  }
  isSearchActive = false;
  clearTimeout(searchSilenceTimer);
  shouldSkipNextRestart = true;
  try {
    recognition.stop();
  } catch (error) {}
  if (searchButton) {
    searchButton.classList.remove("is-listening");
  }
  if (startButton) {
    startButton.classList.remove("is-listening");
  }
  setStartButtonLabel("старт");
}

function startManualIdleTimer() {
  clearTimeout(manualIdleTimer);
  if (!manualInput || !manualInput.value.trim()) {
    return;
  }
  manualIdleTimer = setTimeout(() => {
    manualInput.value = "";
    manualInput.blur();
  }, 10000);
}

function startManualSearchIdleTimer() {
  clearTimeout(manualSearchTimer);
  manualSearchTimer = setTimeout(() => {
    manualSearchMode = false;
    if (manualInput) {
      manualInput.value = "";
      manualInput.blur();
    }
    if (manualPlaceholder) {
      manualPlaceholder.textContent = "или напиши";
    }
  }, 7000);
}

function startSearchListening() {
  unlockAudio();

  if (isSearchActive) {
    stopSearchVoice();
    cancelSearch();
    return;
  }

  if (!recognition) {
    showVoiceUnavailableFallback("голосовой поиск недоступен, напиши напоминание вручную");
    return;
  }

  cancelEditing();
  shouldSkipNextRestart = false;
  isSearchActive = true;
  isSeriesActive = false;
  setRecognitionContinuous(false);
  startButton.classList.add("is-listening");
  setStartButtonLabel("стоп");
  if (manualPlaceholder) {
    manualPlaceholder.textContent = "поиск";
  }
  showStatus("назови или напиши напоминание");
  lastErrorPhrase = "";
  restartRecognition();
  // Если молчишь и не печатаешь — через 7 сек поиск тихо завершается.
  clearTimeout(searchSilenceTimer);
  searchSilenceTimer = setTimeout(() => {
    stopSearchVoice();
    cancelSearch();
  }, 7000);
}

function openExamplesDialog() {
  if (!examplesModal || !examplesButton || !examplesCloseButton) {
    return;
  }

  examplesReturnFocus = document.activeElement;
  examplesModal.hidden = false;
  examplesButton.setAttribute("aria-expanded", "true");
  lockPageScroll();
  const examplesDialog = document.querySelector(".examples-dialog");

  if (examplesDialog) {
    examplesDialog.focus();
  }
}

function closeExamplesDialog(options = {}) {
  const { restoreFocus = true } = options;

  if (!examplesModal) {
    return;
  }

  examplesModal.hidden = true;
  if (!isEditDialogOpen()) {
    unlockPageScroll();
  }

  if (examplesButton) {
    examplesButton.setAttribute("aria-expanded", "false");
  }

  if (restoreFocus && examplesReturnFocus && typeof examplesReturnFocus.focus === "function") {
    examplesReturnFocus.focus();
  }

  examplesReturnFocus = null;
}

function handleDocumentKeydown(event) {
  if (event.key === "Escape" && isEditDialogOpen()) {
    closeEditDialog();
    return;
  }

  if (event.key === "Escape" && examplesModal && !examplesModal.hidden) {
    closeExamplesDialog();
    return;
  }

  if (event.key === "Escape" && searchModal && !searchModal.hidden) {
    closeSearchDialog();
    return;
  }

  if (event.key === "Tab" && examplesModal && !examplesModal.hidden) {
    keepFocusInsideDialog(event, examplesModal);
    return;
  }

  if (event.key === "Tab" && isEditDialogOpen()) {
    keepFocusInsideDialog(event, editModal);
    return;
  }

  if (event.key === "Tab" && searchModal && !searchModal.hidden) {
    keepFocusInsideSearchDialog(event);
  }
}

async function handleSearchPhrase(value) {
  const query = normalizeSearchText(value);

  if (!query) {
    showStatus("не нашла такое напоминание");
    return false;
  }

  const localMatches = findItemsBySearchQuery(query);
  const aiSearch = shouldUseAISearch(query, localMatches)
    ? await parseSearchWithAI(value)
    : null;
  const aiMatches = aiSearch ? findItemsByAISearch(aiSearch) : [];
  const matches = mergeSearchMatches(localMatches, aiMatches);
  cancelSearch();

  if (!matches.length) {
    showStatus(`не нашла: «${value}»`);
    clearPhraseSoon();
    return true;
  }

  showSearchDialog(matches, value);
  clearPhraseSoon();
  return true;
}

function findItemsBySearchQuery(query) {
  const searchWeek = parseSearchWeek(query);

  if (searchWeek) {
    return findItemsByDateRange(searchWeek.startDate, searchWeek.endDate);
  }

  const searchYearPart = parseSearchYearPart(query);

  if (searchYearPart) {
    return findItemsByMonthRange(searchYearPart.year, searchYearPart.startMonth, searchYearPart.endMonth);
  }

  const searchMonth = parseSearchMonth(query);

  if (searchMonth) {
    if (searchMonth.startDate && searchMonth.endDate) {
      return findItemsByDateRange(searchMonth.startDate, searchMonth.endDate);
    }

    return findItemsByMonth(searchMonth.year, searchMonth.month);
  }

  const searchYear = parseSearchYear(query);

  if (searchYear) {
    return findItemsByYear(searchYear);
  }

  const searchWeekday = parseSearchWeekday(query);

  if (searchWeekday) {
    return findItemsByDate(searchWeekday);
  }

  const searchPeriod = parseSearchPeriod(query);

  if (searchPeriod) {
    return findItemsByDateRange(searchPeriod.startDate, searchPeriod.endDate);
  }

  const searchDate = parseSearchDate(query);

  if (searchDate) {
    return findItemsByDate(searchDate);
  }

  return findItemsByName(query);
}

function findItemsByAISearch(search) {
  if (!search || typeof search !== "object") {
    return [];
  }

  switch (search.type) {
    case "name":
      return search.query ? findItemsByName(normalizeSearchText(search.query)) : [];
    case "date":
      return isValidAIISODate(search.date) ? findItemsByDate(parseIsoDate(search.date)) : [];
    case "range":
      return isValidAIISODate(search.startDate) && isValidAIISODate(search.endDate)
        ? findItemsByDateRange(parseIsoDate(search.startDate), parseIsoDate(search.endDate))
        : [];
    case "month":
      return Number.isInteger(search.year) && Number.isInteger(search.month)
        ? findItemsByMonth(search.year, search.month - 1)
        : [];
    case "year":
      return Number.isInteger(search.year) ? findItemsByYear(search.year) : [];
    case "soon":
      return findSoonItems(search.days);
    default:
      return [];
  }
}

function findSoonItems(days = 7) {
  const startDate = startOfToday();
  const endDate = startOfToday();
  const amount = Number.isFinite(days) ? days : 7;
  endDate.setDate(endDate.getDate() + Math.max(1, Math.min(amount, 30)));

  return findItemsByDateRange(startDate, endDate);
}

function mergeSearchMatches(...matchGroups) {
  const result = [];
  const usedIds = new Set();

  matchGroups.flat().forEach((item) => {
    if (!item || usedIds.has(item.id)) {
      return;
    }

    usedIds.add(item.id);
    result.push(item);
  });

  return sortByDate(result);
}

function shouldUseAISearch(query, localMatches) {
  if (!AI_PROXY_URL) {
    return false;
  }

  return !localMatches.length ||
    /\b(скоро|срочн|ближайш|просроч|что\s+у\s+меня|какие\s+у\s+меня|покажи|найди|где)\b/.test(query);
}

function findItemsByName(query) {
  return sortByDate(items).filter((item) => (
    isSearchMatch(normalizeSearchText(item.name), query)
  ));
}

function findItemsByDate(date) {
  const isoDate = toIsoDate(date);

  return sortByDate(items).filter((item) => item.date === isoDate);
}

function findItemsByDateRange(startDate, endDate) {
  return sortByDate(items).filter((item) => {
    const date = parseIsoDate(item.date);
    return date >= startDate && date <= endDate;
  });
}

function findItemsByYear(year) {
  return sortByDate(items).filter((item) => (
    parseIsoDate(item.date).getFullYear() === year
  ));
}

function findItemsByMonth(year, month) {
  return sortByDate(items).filter((item) => {
    const date = parseIsoDate(item.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });
}

function findItemsByMonthRange(year, startMonth, endMonth) {
  return sortByDate(items).filter((item) => {
    const date = parseIsoDate(item.date);
    const month = date.getMonth();
    return date.getFullYear() === year && month >= startMonth && month <= endMonth;
  });
}

function parseSearchWeek(query) {
  const phrase = normalizeSearchPhrase(query);
  const relativeMatch = phrase.match(/^через\s+(неделю|(\d+|один|одна|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять)\s+недел(?:ю|и|ь)?)$/);

  if (relativeMatch) {
    const amount = relativeMatch[2]
      ? getSearchAmount(relativeMatch[2])
      : 1;

    if (!amount) {
      return null;
    }

    const startDate = getStartOfWeek(startOfToday());
    startDate.setDate(startDate.getDate() + amount * 7);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    return { startDate, endDate };
  }

  if (!/^(на\s+)?(этой|следующей)\s+недел(?:е|ю)$/.test(phrase)) {
    return null;
  }

  const match = phrase.match(/(этой|следующей)/);
  const startDate = getStartOfWeek(startOfToday());

  if (match[1] === "следующей") {
    startDate.setDate(startDate.getDate() + 7);
  }

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  return { startDate, endDate };
}

function makePeriodRange(months, days) {
  const startDate = startOfToday();
  const endDate = startOfToday();
  if (months) {
    endDate.setMonth(endDate.getMonth() + months);
  }
  if (days) {
    endDate.setDate(endDate.getDate() + days);
  }
  return { startDate, endDate };
}

function parseSearchPeriod(query) {
  const phrase = normalizeSearchPhrase(query);

  if (/^пол\s?года$/.test(phrase)) {
    return makePeriodRange(6, 0);
  }

  if (/^полтора\s+месяца$/.test(phrase)) {
    return makePeriodRange(1, 15);
  }

  const match = phrase.match(/^(?:за\s+|на\s+|в\s+течение\s+|через\s+)?(\d+|один|одна|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять|пол)?\s*(год|года|лет|месяц|месяца|месяцев|недел[яюиь]|дн[яя]|дня|день|дней)$/);

  if (!match) {
    return null;
  }

  const word = match[2];
  let amount = 1;

  if (match[1] === "пол") {
    if (/год|года|лет/.test(word)) {
      return makePeriodRange(6, 0);
    }
    if (/месяц/.test(word)) {
      return makePeriodRange(0, 15);
    }
  } else if (match[1]) {
    amount = /^\d+$/.test(match[1]) ? parseInt(match[1], 10) : getSearchAmount(match[1]);
  }

  if (!amount || amount < 1) {
    amount = 1;
  }

  if (/год|года|лет/.test(word)) {
    return makePeriodRange(amount * 12, 0);
  }

  if (/месяц/.test(word)) {
    return makePeriodRange(amount, 0);
  }

  if (/недел/.test(word)) {
    return makePeriodRange(0, amount * 7);
  }

  return makePeriodRange(0, amount);
}

function getStartOfWeek(date) {
  const result = new Date(date);
  const day = result.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  result.setDate(result.getDate() - daysFromMonday);
  return result;
}

function parseSearchYearPart(query) {
  const phrase = normalizeSearchPhrase(query);
  const match = phrase.match(/^(?:в\s+)?(начале|середине|конце)\s+(следующего\s+)?года$/);

  if (!match) {
    return null;
  }

  const year = new Date().getFullYear() + (match[2] ? 1 : 0);

  if (match[1] === "начале") {
    return { year, startMonth: 0, endMonth: 3 };
  }

  if (match[1] === "середине") {
    return { year, startMonth: 4, endMonth: 7 };
  }

  return { year, startMonth: 8, endMonth: 11 };
}

function parseSearchMonth(query) {
  const phrase = normalizeSearchPhrase(query);
  const now = new Date();
  const monthPart = parseSearchMonthPart(phrase, now.getFullYear(), now.getMonth());

  if (monthPart) {
    return monthPart;
  }

  const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextMonthPart = parseSearchNextMonthPart(
    phrase,
    nextMonthDate.getFullYear(),
    nextMonthDate.getMonth(),
  );

  if (nextMonthPart) {
    return nextMonthPart;
  }

  if (/^(в\s+)?этом\s+месяц(?:е)?$/.test(phrase)) {
    return { year: now.getFullYear(), month: now.getMonth() };
  }

  if (/^(в\s+)?следующ(?:ем|ий)\s+месяц(?:е)?$/.test(phrase)) {
    const date = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return { year: date.getFullYear(), month: date.getMonth() };
  }

  const namedMonth = parseSearchNamedMonth(phrase);

  if (namedMonth) {
    return namedMonth;
  }

  const relativeMatch = phrase.match(/^через\s+(месяц|(\d+|один|одна|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять)\s+месяц(?:а|ев)?)$/);

  if (!relativeMatch) {
    return null;
  }

  const amount = relativeMatch[2]
    ? getSearchAmount(relativeMatch[2])
    : 1;

  if (!amount) {
    return null;
  }

  const date = new Date(now.getFullYear(), now.getMonth() + amount, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}

function parseSearchNamedMonth(phrase) {
  const regex = new RegExp(`^(?:в\\s+)?(${monthWordPattern})(?:\\s+(следующего\\s+года|\\d{4}))?$`);
  const match = regex.exec(phrase);

  if (!match) {
    return null;
  }

  const month = monthMap[match[1]];
  const now = new Date();
  let year = getExplicitYear(match[2]) || now.getFullYear();
  const monthEnd = new Date(year, month, lastDayOfMonth(month, year));

  if (!match[2] && monthEnd < startOfToday()) {
    year += 1;
  }

  return { year, month };
}

function parseSearchMonthPart(phrase, year, month) {
  const match = phrase.match(/^(?:в\s+)?(начале|середине|конце)\s+месяц(?:а|е)?$/);

  if (!match) {
    return null;
  }

  if (match[1] === "начале") {
    return getSearchMonthPartRange(year, month, 1, 10);
  }

  if (match[1] === "середине") {
    return getSearchMonthPartRange(year, month, 11, 20);
  }

  return getSearchMonthPartRange(year, month, 21, lastDayOfMonth(month, year));
}

function parseSearchNextMonthPart(phrase, year, month) {
  const match = phrase.match(/^(?:в\s+)?(начале|середине|конце)\s+следующ(?:его|ем)\s+месяц(?:а|е)?$/);

  if (!match) {
    return null;
  }

  if (match[1] === "начале") {
    return getSearchMonthPartRange(year, month, 1, 10);
  }

  if (match[1] === "середине") {
    return getSearchMonthPartRange(year, month, 11, 20);
  }

  return getSearchMonthPartRange(year, month, 21, lastDayOfMonth(month, year));
}

function getSearchMonthPartRange(year, month, startDay, endDay) {
  return {
    startDate: new Date(year, month, startDay),
    endDate: new Date(year, month, endDay),
  };
}

function getSearchAmount(value) {
  return /^\d+$/.test(value) ? Number(value) : amountWordMap[value];
}

function parseSearchYear(query) {
  const phrase = normalizeSearchPhrase(query);

  if (/^(в\s+)?этом\s+году$/.test(phrase)) {
    return new Date().getFullYear();
  }

  if (/^(в\s+)?следующ(?:ем|ий)\s+год(?:у)?$/.test(phrase)) {
    return new Date().getFullYear() + 1;
  }

  const match = phrase.match(/^(\d{4})\s*(год(?:у|а)?)?$/);

  return match ? Number(match[1]) : null;
}

function parseSearchWeekday(query) {
  const phrase = normalizeSearchPhrase(query);
  const regex = new RegExp(`^(?:в\\s+)?(?:следующ(?:ий|ая|ее|ей)\\s+)?(${weekdayWordPattern})$`);
  const match = regex.exec(phrase);

  if (!match) {
    return null;
  }

  return getWeekdayDate(weekdayMap[match[1]], phrase.includes("следующ"));
}

function parseSearchDate(query) {
  const phrase = normalizeSearchPhrase(query);

  return (
    parseNamedDate(phrase)?.date ||
    parseExactDate(phrase, null)?.date ||
    null
  );
}

function normalizeSearchPhrase(query) {
  return normalize(query)
    .replace(/^(что|какие|какое|какая|есть|записи|напоминания)\s+/, "")
    .replace(/^на\s+/, "")
    .replace(/^(что|какие|какое|какая|есть|записи|напоминания)\s+на\s+/, "")
    .trim();
}

function isSearchMatch(name, query) {
  if (name.includes(query) || query.includes(name)) {
    return true;
  }

  const queryWords = query.split(" ").filter(Boolean);
  const nameWords = name.split(" ").filter(Boolean);

  return queryWords.every((queryWord) => (
    nameWords.some((nameWord) => hasCommonWordStart(nameWord, queryWord))
  ));
}

function hasCommonWordStart(firstWord, secondWord) {
  const minLength = Math.min(firstWord.length, secondWord.length);

  if (minLength < 4) {
    return firstWord === secondWord;
  }

  return firstWord.slice(0, minLength - 1) === secondWord.slice(0, minLength - 1);
}

function normalizeSearchText(value) {
  return normalize(value)
    .replace(/[.,!?]+/g, "")
    .replace(/^(найди|найти|когда|покажи|показать)\s+/, "")
    .trim();
}

function showSearchDialog(matches, query) {
  if (!searchModal || !searchResults || !searchCloseButton) {
    return;
  }

  searchReturnFocus = document.activeElement;
  currentSearchItemIds = matches.map((item) => item.id);
  currentSearchQuery = query;
  searchResults.innerHTML = "";
  matches.forEach((item) => {
    searchResults.append(createSearchResult(item));
  });

  searchModal.hidden = false;
  updateSearchTitle(matches.length);
  lockPageScroll();
  searchCloseButton.focus();
  announceToScreenReader(`найдено по запросу ${query}: ${matches.length}`);
}

function updateSearchTitle(count) {
  if (!searchTitle) {
    return;
  }

  searchTitle.textContent = `найдено: ${count}`;
}

function lockPageScroll() {
  if (document.body.style.overflow === "hidden") {
    return;
  }

  previousPageOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
}

function unlockPageScroll() {
  document.body.style.overflow = previousPageOverflow;
  previousPageOverflow = "";
}

function createSearchResult(item) {
  const result = document.createElement("article");
  const content = document.createElement("div");
  const name = document.createElement("h3");
  const date = document.createElement("p");
  const time = document.createElement("p");
  const days = document.createElement("p");
  const actions = document.createElement("div");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  const closeButton = document.createElement("button");

  result.className = "search-result";
  content.className = "search-result-content";
  name.className = "search-result-name";
  date.className = "search-result-date";
  time.className = "search-result-time";
  days.className = "search-result-days";
  actions.className = "search-result-actions";
  editButton.className = "edit-button";
  deleteButton.className = "delete-button";
  closeButton.className = "search-result-close-button";
  editButton.type = "button";
  deleteButton.type = "button";
  closeButton.type = "button";
  editButton.setAttribute("aria-label", `изменить напоминание ${formatDisplayName(item.name)}`);
  deleteButton.setAttribute("aria-label", `удалить напоминание ${formatDisplayName(item.name)}`);
  closeButton.setAttribute("aria-label", `убрать из окна напоминание ${formatDisplayName(item.name)}`);

  appendLabeledText(name, "название", formatDisplayName(item.name));
  appendLabeledText(date, "дата", getItemDateText(item));
  appendLabeledText(time, "время", getItemTimeText(item));
  time.hidden = !getItemTimeText(item);
  days.textContent = formatDaysLeftVisible(item.date);
  editButton.textContent = "изменить";
  deleteButton.textContent = "удалить";
  closeButton.textContent = "закрыть";

  editButton.addEventListener("click", () => {
    startEditingItem(item.id);
  });

  deleteButton.addEventListener("click", () => {
    showConfirm("удалить напоминание?", () => {
      deleteItem(item.id);
      refreshSearchDialog();
    });
  });

  closeButton.addEventListener("click", () => {
    removeSearchResult(item.id);
  });
  content.append(name, date, time, days);
  actions.append(editButton, deleteButton, closeButton);
  result.append(content, actions);
  return result;
}

function closeSearchDialog(options = {}) {
  const { restoreFocus = true } = options;

  if (!searchModal) {
    return;
  }

  searchModal.hidden = true;
  if (!isEditDialogOpen()) {
    unlockPageScroll();
  }

  if (searchResults) {
    searchResults.innerHTML = "";
  }

  updateSearchTitle(0);

  currentSearchItemIds = [];
  currentSearchQuery = "";
  editingItemId = null;

  if (restoreFocus && searchReturnFocus && typeof searchReturnFocus.focus === "function") {
    searchReturnFocus.focus();
  }

  searchReturnFocus = null;
}

function removeSearchResult(id) {
  currentSearchItemIds = currentSearchItemIds.filter((itemId) => itemId !== id);
  refreshSearchDialog();
}

function refreshSearchDialog() {
  if (!searchModal || searchModal.hidden || !searchResults) {
    return;
  }

  const matches = currentSearchItemIds
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean);
  searchResults.innerHTML = "";

  if (!matches.length) {
    closeSearchDialog();
    return;
  }

  currentSearchItemIds = matches.map((item) => item.id);
  updateSearchTitle(matches.length);
  matches.forEach((item) => {
    searchResults.append(createSearchResult(item));
  });
  announceToScreenReader(`обновлено: ${matches.length}`);
}

function isSearchDialogOpen() {
  return Boolean(searchModal && !searchModal.hidden);
}

function keepFocusInsideSearchDialog(event) {
  keepFocusInsideDialog(event, searchModal);
}

function keepFocusInsideDialog(event, dialogRoot) {
  const focusable = getDialogFocusableElements(dialogRoot);

  if (!focusable.length) {
    return;
  }

  const firstElement = focusable[0];
  const lastElement = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

function getDialogFocusableElements(dialogRoot) {
  if (!dialogRoot || dialogRoot.hidden) {
    return [];
  }

  return Array.from(dialogRoot.querySelectorAll("button, [href], input, textarea, select, [tabindex]:not([tabindex='-1'])"));
}

async function handleManualSubmit(event) {
  event.preventDefault();

  const value = normalizeManualInput(manualInput.value);

  if (!value) {
    return;
  }

  // Ручной поиск: если включён режим поиска — ищем, а не создаём.
  if (manualSearchMode) {
    manualSearchMode = false;
    clearTimeout(manualSearchTimer);
    manualInput.value = "";
    manualInput.blur();
    handleSearchPhrase(value);
    return;
  }

  const result = await handlePhrase(value, { preferWrittenTime: true, preserveNameCase: true });

  if (result !== false) {
    manualInput.value = "";
    manualInput.blur();
    clearTimeout(manualIdleTimer);
  }
}

function normalizeManualInput(value) {
  return value
    .replace(/[\\/]+/g, " ")
    .replace(/([а-яё])(\d)/gi, "$1 $2")
    .replace(/(\d)([а-яё])/gi, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

async function handlePhrase(value, options = {}) {
  const localParsed = parsePhrase(value, options);
  const aiParsed = !options.fromSpeech && !localParsed
    ? await parsePhraseWithAI(value)
    : null;
  const parsed = localParsed || aiParsed;

  if (!parsed || parsed.name === "предмет") {
    if (options.fromSpeech) {
      hideStatus();
      speakError(value, lastParseError);
    } else {
      showStatus("Введите напоминание в формате что и когда");
      clearPhraseSoon();
    }
    return false;
  }

  if (hasDuplicateItem(parsed)) {
    showStatus(isSeriesActive ? "Такая запись уже есть" : "Такая запись уже есть");
    clearPhraseSoon();
    return true;
  }

  items.push(parsed);
  items = sortByDate(items);
  saveItems();
  renderList();
  lastErrorPhrase = "";

  playSavedSound();
  showStatus(
    isSeriesActive
      ? `Сохранено, ${formatReminderMessage(parsed)}`
      : `Сохранено, ${formatReminderMessage(parsed)}`,
  );
  clearPhraseSoon();
  scheduleItemNotifications(parsed);
  return { type: "create", item: parsed };
}

async function parsePhraseWithAI(value) {
  if (!AI_PROXY_URL) {
    return null;
  }

  const normalizedValue = normalizeInputForAI(value);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, AI_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(AI_PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        text: normalizedValue,
        now: new Date().toISOString(),
        localNow: formatLocalDateTimeForAI(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    });

    if (!response.ok) {
      logAIProblem("bad-response", {
        status: response.status,
        phrase: normalizedValue,
      });
      return null;
    }

    const data = await response.json();
    return createItemFromAIData(data, value);
  } catch (error) {
    logAIProblem(error.name === "AbortError" ? "timeout" : "request-error", {
      phrase: normalizedValue,
      message: error.message,
    });
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function parseSearchWithAI(value) {
  if (!AI_PROXY_URL) {
    return null;
  }

  const normalizedValue = normalizeInputForAI(value);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, AI_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(AI_PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        mode: "search",
        text: normalizedValue,
        now: new Date().toISOString(),
        localNow: formatLocalDateTimeForAI(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    });

    if (!response.ok) {
      logAIProblem("search-bad-response", {
        status: response.status,
        phrase: normalizedValue,
      });
      return null;
    }

    const data = await response.json();
    return normalizeAISearchData(data, normalizedValue);
  } catch (error) {
    logAIProblem(error.name === "AbortError" ? "search-timeout" : "search-request-error", {
      phrase: normalizedValue,
      message: error.message,
    });
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function normalizeAISearchData(data, phrase) {
  if (!data || typeof data !== "object") {
    return null;
  }

  const type = getAIString(data.type);

  if (!["name", "date", "range", "month", "year", "soon"].includes(type)) {
    logAIProblem("search-invalid-type", { phrase, type });
    return null;
  }

  return {
    type,
    query: getAIString(data.query),
    date: getAIString(data.date),
    startDate: getAIString(data.startDate),
    endDate: getAIString(data.endDate),
    year: Number(data.year),
    month: Number(data.month),
    days: Number(data.days),
  };
}

function normalizeInputForAI(value) {
  return value
    .replace(/([а-яё])(\d)/gi, "$1 $2")
    .replace(/(\d)([а-яё])/gi, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

function formatLocalDateTimeForAI() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function logAIProblem(reason, details = {}) {
  const entry = {
    reason,
    details,
    time: new Date().toLocaleString("ru-RU"),
  };

  console.warn("[AI parser fallback]", reason, details);
  saveAIDebugEntry(entry);
  renderDebugPanel();
}

function setupDebugPanel() {
  if (!debugPanel) {
    return;
  }

  if (!DEBUG_MODE) {
    debugPanel.hidden = true;
    return;
  }

  debugPanel.hidden = false;
  renderDebugPanel();
}

function saveAIDebugEntry(entry) {
  try {
    const entries = loadAIDebugEntries();
    entries.unshift(entry);
    localStorage.setItem(AI_DEBUG_STORAGE_KEY, JSON.stringify(entries.slice(0, 10)));
  } catch (error) {
    console.warn("AI debug save failed", error);
  }
}

function loadAIDebugEntries() {
  try {
    const rawEntries = localStorage.getItem(AI_DEBUG_STORAGE_KEY);
    const entries = rawEntries ? JSON.parse(rawEntries) : [];
    return Array.isArray(entries) ? entries : [];
  } catch (error) {
    console.warn("AI debug load failed", error);
    return [];
  }
}

function renderDebugPanel() {
  if (!DEBUG_MODE || !debugList) {
    return;
  }

  const entries = loadAIDebugEntries();
  debugList.innerHTML = "";

  if (!entries.length) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "пока ошибок нет";
    debugList.append(emptyItem);
    return;
  }

  entries.forEach((entry) => {
    const item = document.createElement("li");
    const phrase = entry.details?.phrase ? `: ${entry.details.phrase}` : "";
    item.textContent = `${entry.time} - ${entry.reason}${phrase}`;
    debugList.append(item);
  });
}

function createItemFromAIData(data, source) {
  if (!data || typeof data !== "object") {
    return null;
  }

  const name = getAIString(data.name || data["название"]);
  const date = getAIString(data.date || data["дата"]);
  const time = getAINullableString(data.time || data["время"]);
  const period = getAINullableString(data.period || data["часть_дня"]);
  const displayDate = getAINullableString(data.displayDate || data["текст_даты"]);
  const parsedName = getParsedName(name);

  if (!name || !isValidAIISODate(date) || !isValidAITime(time)) {
    logAIProblem("invalid-data", {
      phrase: normalizeInputForAI(source),
      name,
      date,
      time,
    });
    return null;
  }

  if (period && !["утром", "днем", "днём", "вечером", "ночью"].includes(period)) {
    logAIProblem("invalid-period", {
      phrase: normalizeInputForAI(source),
      period,
    });
    return null;
  }

  if (!isReliableAIItem({ name: parsedName, date, time, period, source })) {
    logAIProblem("low-confidence", {
      phrase: normalizeInputForAI(source),
      name: parsedName,
      date,
      time,
      period,
    });
    return null;
  }

  return {
    id: createId(),
    name: parsedName,
    date,
    time,
    period: time ? "" : (period || ""),
    displayDate: displayDate || "",
    source: source.trim(),
  };
}

function getAIString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getAINullableString(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return getAIString(value);
}

function isValidAIISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
}

function isValidAITime(value) {
  if (!value) {
    return true;
  }

  if (!/^\d{2}:\d{2}$/.test(value)) {
    return false;
  }

  const [hour, minute] = value.split(":").map(Number);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

function isReliableAIItem(item) {
  const name = normalize(item.name || "");
  const source = normalize(normalizeInputForAI(item.source || ""));

  if (!name || name.length < AI_MIN_NAME_LENGTH || suspiciousAINames.has(name)) {
    return false;
  }

  if (!hasDateSignal(source)) {
    return false;
  }

  if (!isAIDateInReasonableRange(item.date)) {
    return false;
  }

  if (!doesNameComeFromSource(name, source)) {
    return false;
  }

  return true;
}

function hasDateSignal(source) {
  return /\b(сегодня|завтра|послезавтра|через|до|следующ(?:ий|ая|ее|ем|его)|понедельник|вторник|сред[ау]|четверг|пятниц[ау]|суббот[ау]|воскресенье|январ[ьяе]|феврал[ьяе]|март[ае]?|апрел[ьяе]|ма[йяе]|июн[ьяе]|июл[ьяе]|август[ае]?|сентябр[ьяе]|октябр[ьяе]|ноябр[ьяе]|декабр[ьяе])\b/.test(source) ||
    /\d/.test(source);
}

function isAIDateInReasonableRange(value) {
  const date = parseIsoDate(value);
  const minDate = startOfToday();
  const maxDate = startOfToday();
  maxDate.setFullYear(maxDate.getFullYear() + 20);

  return date >= minDate && date <= maxDate;
}

function doesNameComeFromSource(name, source) {
  const nameWords = name
    .split(" ")
    .filter((word) => word.length >= AI_MIN_NAME_LENGTH);

  if (!nameWords.length) {
    return false;
  }

  return nameWords.some((word) => source.includes(word));
}

function handleEditPhrase(value) {
  const item = items.find((currentItem) => currentItem.id === editingItemId);

  if (!item) {
    finishEditing();
    return false;
  }

  // Изменения копятся в черновик и НЕ применяются к верхней карточке,
  // пока не нажмёшь «ок» -> «сохранить».
  const base = pendingEditItem || item;
  const phrase = normalize(value);

  const renamedItem = getRenamedItem(base, phrase);

  if (renamedItem) {
    pendingEditItem = renamedItem;
    renderEditPreviewCard(pendingEditItem);
    playSavedSound();
    showStatus("записала, нажми «ок»");
    return { type: "edit", item: renamedItem };
  }

  const correction = getCorrectedItem(base, value);

  if (!correction) {
    hideStatus();
    speakError(value, lastParseError);
    return false;
  }

  pendingEditItem = correction;
  renderEditPreviewCard(pendingEditItem);
  playSavedSound();
  showStatus("записала, нажми «ок»");
  return { type: "edit", item: correction };
}

function refreshAfterEditModalUpdate(updatedItem) {
  renderEditDialogItem(updatedItem);
  resetEditModalTimer();
  refreshSearchDialog();
}

function openCalendarDialog() {
  if (!calendarModal) {
    return;
  }
  renderCalendar();
  calendarModal.hidden = false;
}

function closeCalendarDialog() {
  if (!calendarModal) {
    return;
  }
  calendarModal.hidden = true;
}

function isCalendarDialogOpen() {
  return Boolean(editManualPanel && !editManualPanel.hidden);
}

function changeCalendarMonth(offset) {
  const date = new Date(calendarYear, calendarMonth + offset, 1);
  calendarYear = date.getFullYear();
  calendarMonth = date.getMonth();
  renderCalendar();
}

function renderCalendar() {
  if (!calendarGrid || !calendarTitle || calendarYear === null || calendarMonth === null) {
    return;
  }

  const item = pendingEditItem || items.find((currentItem) => currentItem.id === calendarItemId);
  const selectedDate = item ? parseIsoDate(item.date) : null;
  const firstDay = new Date(calendarYear, calendarMonth, 1);
  const daysInMonth = lastDayOfMonth(calendarMonth, calendarYear);
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7;

  calendarTitle.textContent = `${monthDisplayNames[calendarMonth]} ${calendarYear}`;
  calendarGrid.innerHTML = "";

  for (let index = 0; index < leadingEmptyDays; index += 1) {
    const empty = document.createElement("span");
    empty.className = "calendar-day calendar-day--empty";
    calendarGrid.append(empty);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(calendarYear, calendarMonth, day);
    const button = document.createElement("button");
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isSelected = selectedDate && toIsoDate(date) === toIsoDate(selectedDate);

    button.className = "calendar-day";
    button.type = "button";
    button.textContent = String(day);
    button.dataset.date = toIsoDate(date);
    button.setAttribute("aria-label", `${day} ${monthNames[calendarMonth]} ${calendarYear}`);

    if (isWeekend) {
      button.classList.add("calendar-day--weekend");
    }

    if (isSelected) {
      button.classList.add("calendar-day--selected");
      button.setAttribute("aria-current", "date");
    }

    calendarGrid.append(button);
  }
}

function handleCalendarGridClick(event) {
  const button = event.target.closest("[data-date]");

  if (!button || !calendarGrid.contains(button)) {
    return;
  }

  selectCalendarDate(button.dataset.date);
}

function selectCalendarDate(dateValue) {
  const base = pendingEditItem || items.find((currentItem) => currentItem.id === calendarItemId);

  if (!base) {
    closeCalendarDialog();
    return;
  }

  pendingEditItem = { ...base, date: dateValue, displayDate: "" };
  editHasChanges = true;
  renderEditPreviewCard(pendingEditItem);
  updateManualDateDisplay();
  renderCalendar();
  playSavedSound();
  closeCalendarDialog();
}

function selectCalendarMonth() {
  const base = pendingEditItem || items.find((currentItem) => currentItem.id === calendarItemId);

  if (!base || calendarYear === null || calendarMonth === null) {
    closeCalendarDialog();
    return;
  }

  pendingEditItem = {
    ...base,
    date: toIsoDate(new Date(calendarYear, calendarMonth, 1)),
    displayDate: `в ${monthPrepositionNames[calendarMonth]} ${calendarYear} года`,
  };
  editHasChanges = true;
  renderEditPreviewCard(pendingEditItem);
  updateManualDateDisplay();
  renderCalendar();
  playSavedSound();
  closeCalendarDialog();
}

function populateTimeSelects() {
  if (hourSelect && !hourSelect.options.length) {
    for (let h = 0; h < 24; h += 1) {
      const option = document.createElement("option");
      option.value = String(h).padStart(2, "0");
      option.textContent = option.value;
      hourSelect.appendChild(option);
    }
  }
  if (minuteSelect && !minuteSelect.options.length) {
    for (let m = 0; m < 60; m += 5) {
      const option = document.createElement("option");
      option.value = String(m).padStart(2, "0");
      option.textContent = option.value;
      minuteSelect.appendChild(option);
    }
  }
}

function renderCalendarTimeInput(item) {
  if (!hourSelect || !minuteSelect) {
    return;
  }
  populateTimeSelects();

  let hh = "00";
  let mm = "00";
  const editedTime = pendingEditItem && pendingEditItem.time;
  if (/^\d{2}:\d{2}$/.test(editedTime || "")) {
    hh = editedTime.slice(0, 2);
    let minutes = parseInt(editedTime.slice(3, 5), 10);
    minutes = Math.round(minutes / 5) * 5;
    if (minutes >= 60) minutes = 55;
    mm = String(minutes).padStart(2, "0");
  }
  hourSelect.value = hh;
  minuteSelect.value = mm;
}

function handleCalendarTimeSubmit(event) {
  event.preventDefault();
  applyCalendarTimeInput({ announce: true });
}

function applyCalendarTimeInput(options = {}) {
  if (!hourSelect || !minuteSelect || !calendarItemId) {
    return false;
  }

  const value = `${hourSelect.value}:${minuteSelect.value}`;

  const base = pendingEditItem || items.find((currentItem) => currentItem.id === calendarItemId);

  if (!base) {
    return false;
  }

  if (!isValidAITime(value)) {
    showStatus("Не получилось разобрать время");
    return "invalid";
  }

  pendingEditItem = { ...base, time: value, period: "" };
  editHasChanges = true;
  renderEditPreviewCard(pendingEditItem);

  if (options.announce) {
    playSavedSound();
  }

  return true;
}

function applyEditNameInput() {
  if (!editNameInput || !calendarItemId) {
    return;
  }

  const value = editNameInput.value.trim();

  if (!value) {
    return;
  }

  const base = pendingEditItem || items.find((currentItem) => currentItem.id === calendarItemId);

  if (!base) {
    return;
  }

  pendingEditItem = { ...base, name: value, source: value };
  editHasChanges = true;
  renderEditPreviewCard(pendingEditItem);
  playSavedSound();
}

function clearCalendarItemTime() {
  const base = pendingEditItem || items.find((currentItem) => currentItem.id === calendarItemId);

  if (!base) {
    return;
  }

  pendingEditItem = { ...base, time: "", period: "" };
  editHasChanges = true;
  renderEditPreviewCard(pendingEditItem);
  renderCalendarTimeInput(pendingEditItem);
  playSavedSound();
}

function getRenamedItem(item, phrase) {
  const match = phrase.match(/(?:^|\s)(?:измени|изменить)\s+название(?:\s+над?)?\s+(.+)$/);

  if (!match) {
    return null;
  }

  return {
    ...item,
    name: getParsedName(match[1]),
    source: match[1],
  };
}

function getRecognizedPhraseText(phrase, result) {
  if (!result || !result.item) {
    return formatRecognizedPhraseText(phrase);
  }

  if (result.type === "create") {
    // В поле показываем то, что сказал пользователь («через 2 часа»),
    // а не пересчитанное время (оно остаётся на карточке внизу).
    return formatRecognizedPhraseText(phrase);
  }

  if (result.type !== "edit") {
    return formatRecognizedPhraseText(phrase);
  }

  const commandType = getCorrectionCommandType(phrase);

  if (commandType !== "time") {
    return formatRecognizedPhraseText(phrase);
  }

  const timeText = getItemTimeText(result.item);
  return timeText ? "Изменить время " + timeText : formatRecognizedPhraseText(phrase);
}

function formatCreatedPhraseText(phrase, item) {
  const text = formatRecognizedPhraseText(phrase);
  const timeText = getItemTimeText(item);

  if (!timeText || item.period) {
    return text;
  }

  const timePattern = /(?:^|\s)(?:(?:(?:в|на)\s+\d{1,2}(?:(?::|\.)\d{2})?)|(?:\d{1,2}(?:(?::|\.)\d{2}|\s*(?:часа?|часов)(?:\s*(?:и\s*)?\d{1,2}\s*(?:минут|минуты|минута))?)))(?:\s*(?:утра|вечера|дня|ночи))?(?=\s|$)/gi;
  const matches = Array.from(text.matchAll(timePattern));
  const match = matches[matches.length - 1];

  if (!match) {
    return `${text} ${timeText}`;
  }

  const startsWithSpace = /^\s/.test(match[0]);
  const replacement = `${startsWithSpace ? " " : ""}в ${timeText}`;

  return text.slice(0, match.index) + replacement + text.slice(match.index + match[0].length);
}

function formatRecognizedPhraseText(phrase) {
  const text = phrase
    .trim()
    .replace(/\bЧерез\b/g, "через");

  if (!/^(измени|изменить|добавь|добавить|удали|удалить|убери|убрать)(\s|$)/i.test(text)) {
    return text;
  }

  const normalizedText = text.toLocaleLowerCase("ru-RU");
  return normalizedText.charAt(0).toLocaleUpperCase("ru-RU") + normalizedText.slice(1);
}

function getCorrectedItem(item, value) {
  const isCommand = isCorrectionCommand(value);
  let commandType = getCorrectionCommandType(value);
  const cleanedValue = getCorrectionTarget(value);

  if (!isCommand) {
    return null;
  }

  // Если человек не сказал ключевое слово («дату»/«время»),
  // пробуем понять по смыслу: «измени на 9 июня» -> это дата.
  if (!commandType) {
    commandType = inferCorrectionType(item, cleanedValue);
  }

  if (!commandType) {
    return null;
  }

  if (commandType === "delete-time") {
    return {
      ...item,
      time: "",
      period: "",
      source: value.trim(),
    };
  }

  if (!cleanedValue) {
    return null;
  }

  if (commandType === "name") {
    return {
      ...item,
      name: getParsedName(cleanedValue),
      source: value.trim(),
    };
  }

  if (commandType === "time") {
    const relativeTime = getRelativeCorrectionTime(cleanedValue);
    const period = parseDayPeriod(cleanedValue);
    const time = parseCorrectionTime(cleanedValue);

    if (relativeTime) {
      return {
        ...item,
        date: relativeTime.date,
        time: relativeTime.time,
        period: "",
        displayDate: "",
        source: value.trim(),
      };
    }

    if (period) {
      return {
        ...item,
        time: "",
        period,
        source: value.trim(),
      };
    }

    if (time) {
      return {
        ...item,
        time,
        period: "",
        source: value.trim(),
      };
    }

    return null;
  }

  if (commandType !== "date") {
    return null;
  }

  const parsedDate = parsePhrase(`${item.name} ${getCorrectionDateTarget(cleanedValue)}`);

  if (parsedDate && parsedDate.name !== "предмет") {
    // Команда «изменить дату» меняет ТОЛЬКО дату — время и часть дня не трогаем.
    return {
      ...item,
      date: parsedDate.date,
      displayDate: parsedDate.displayDate || "",
      source: value.trim(),
    };
  }

  return null;
}

function looksLikeDateTarget(value) {
  return (
    /(завтра|послезавтра|сегодня)/.test(value) ||
    /следующ/.test(value) ||
    isRelativeDateTarget(value) ||
    /(январ|феврал|март|апрел|\bма[йя]\b|июн|июл|август|сентябр|октябр|ноябр|декабр)/.test(value) ||
    monthMap[value] !== undefined
  );
}

function inferCorrectionType(item, cleanedValue) {
  if (!cleanedValue) {
    return "";
  }

  // Сначала проверяем дату (если в словах есть месяц/«завтра»/«следующий» и т.п.).
  if (looksLikeDateTarget(cleanedValue)) {
    const parsedDate = parsePhrase(`${item.name} ${getCorrectionDateTarget(cleanedValue)}`);

    if (parsedDate && parsedDate.name !== "предмет") {
      return "date";
    }
  }

  // Иначе пробуем как время.
  if (
    getRelativeCorrectionTime(cleanedValue) ||
    parseDayPeriod(cleanedValue) ||
    parseCorrectionTime(cleanedValue)
  ) {
    return "time";
  }

  return "";
}

function getRelativeCorrectionTime(value) {
  const relative = parseRelativeDate(`напоминание ${value}`);

  if (!relative || !["minute", "hour"].includes(relative.unit)) {
    return null;
  }

  return {
    date: toIsoDate(relative.date),
    time: getTimeFromRelative(relative),
  };
}

function isCorrectionCommand(value) {
  return /^(измени|изменить|добавь|добавить|удали|удалить|убери|убрать)(\s|$)/.test(normalize(value));
}

function getCorrectionCommandType(value) {
  const phrase = normalize(value).replace(/^(измени|изменить|добавь|добавить|удали|удалить|убери|убрать)\s+/, "");

  if (/^название(?:\s|$)/.test(phrase)) {
    return "name";
  }

  if (/^(дату|дата|даты|дате|срок)(?:\s|$)/.test(phrase)) {
    return "date";
  }

  if (/^время(?:\s|$)/.test(phrase)) {
    if (/^(удали|удалить|убери|убрать)\s+/.test(normalize(value))) {
      return "delete-time";
    }

    return "time";
  }

  return "";
}

function getCorrectionTarget(value) {
  return normalize(value)
    .replace(/^(измени|изменить|добавь|добавить|удали|удалить|убери|убрать)\s+/, "")
    .replace(/^название(?:\s+над?)?\s+/, "")
    .replace(/^дат[ауые](?:\s+над?)?\s+/, "")
    .replace(/^срок(?:\s+над?)?\s+/, "")
    .replace(/^время(?:\s+над?)?\s+/, "")
    .replace(/^над?\s+/, "")
    .trim();
}

function getCorrectionDateTarget(value) {
  if (monthMap[value] !== undefined) {
    return `в ${monthPrepositionNames[monthMap[value]]}`;
  }

  if (/^следующ(?:ий|его|ем)\s+год(?:а|у)?$/.test(value)) {
    return "в следующем году";
  }

  if (/^следующ(?:ий|его|ем)\s+месяц(?:а|е)?$/.test(value)) {
    return "в следующем месяце";
  }

  if (/^следующ(?:ий|его|ем)\s+день$/.test(value)) {
    return "завтра";
  }

  if (isRelativeDateTarget(value)) {
    return `через ${value}`;
  }

  return value;
}

function isRelativeDateTarget(value) {
  return /^(\d+|один|одна|одну|одно|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять)\s+(день|дня|дней|неделю|недели|недель|месяц|месяца|месяцев|год|года|лет)$/.test(value);
}

function parseCorrectionTime(value) {
  const phrase = normalize(value);

  if (isMidnightPhrase(phrase)) {
    return "00:00";
  }

  const prefixedTime = parseTime(`на ${phrase}`);

  if (prefixedTime && !/\d{1,2}\s+(январь|январе|января|феврале|февраль|февраля|март|марте|марта|апрель|апреле|апреля|май|мае|мая|июнь|июне|июня|июль|июле|июля|август|августе|августа|сентябрь|сентябре|сентября|октябрь|октябре|октября|ноябрь|ноябре|ноября|декабрь|декабре|декабря)/.test(phrase)) {
    return prefixedTime;
  }

  const match = phrase.match(/(?:^|\s)(\d{1,2})(?:(?::|\.)(\d{2})|\s*(?:часа?|часов)(?:\s*(?:и\s*)?(\d{1,2})\s*(?:минут|минуты|минута))?)?\s*(утра|вечера|дня|ночи)?$/);

  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2] || match[3] || 0);
  const dayPart = match[4];

  hour = normalizeParsedHour(hour, dayPart);

  if (dayPart === "ночи" && hour === 12) {
    hour = 0;
  }

  if (hour > 23 || minute > 59) {
    return null;
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function isMidnightPhrase(phrase) {
  return /^(в\s+|на\s+)?полночь$/.test(phrase) ||
    /^(в\s+|на\s+)?ноль(?:\s+ноль)?$/.test(phrase) ||
    /^(в\s+|на\s+)?0(?::?00)?$/.test(phrase);
}

function updateItem(updatedItem, options = {}) {
  const { sortNow = true } = options;

  items = items.map((item) => (
    item.id === updatedItem.id ? updatedItem : item
  ));

  if (sortNow) {
    items = sortByDate(items);
  }

  saveItems();
  renderList();
  scheduleAllNotifications();
}

function finishEditing() {
  const wasEditDialogOpen = isEditDialogOpen();
  editingItemId = null;
  stopSeriesListening();
  if (editModal) {
    editModal.hidden = true;
  }
  calendarItemId = null;
  if (editManualPanel) {
    editManualPanel.hidden = true;
  }
  if (wasEditDialogOpen && !isSearchDialogOpen()) {
    unlockPageScroll();
  }
  renderList();
}

function openEditDialog(item) {
  if (!editModal || !editCard || !editOkButton) {
    return;
  }

  editModal.hidden = false;
  editHasChanges = false;
  pendingEditItem = null;
  editVoiceActive = false;
  clearTimeout(editVoiceSilenceTimer);
  if (editHasChanges) {
    showEditConfirmButton();
  } else {
    hideEditConfirmButton();
    hideEditVoiceResult();
  }
  if (editVoiceStartButton) {
    editVoiceStartButton.classList.remove("is-listening");
    editVoiceStartButton.textContent = "старт";
  }
  renderEditOriginalCard(item);
  renderEditPreviewCard(item);
  showVoiceEditPanel();

  if (!isSearchDialogOpen()) {
    lockPageScroll();
  }

  editOkButton.focus();
}

function showVoiceEditPanel() {
  if (isCalendarDialogOpen() && applyCalendarTimeInput() === "invalid") {
    return;
  }

  if (editVoicePanel) {
    editVoicePanel.hidden = false;
  }

  if (editManualPanel) {
    editManualPanel.hidden = true;
  }

  if (editVoiceButton) {
    editVoiceButton.classList.add("is-active");
  }

  if (editManualButton) {
    editManualButton.classList.remove("is-active");
  }
}

function showManualEditPanel() {
  const original = items.find((currentItem) => currentItem.id === editingItemId);

  if (!original || !editManualPanel) {
    return;
  }

  if (editVoicePanel) {
    editVoicePanel.hidden = true;
  }

  editManualPanel.hidden = false;

  if (editVoiceButton) {
    editVoiceButton.classList.remove("is-active");
  }

  if (editManualButton) {
    editManualButton.classList.add("is-active");
  }

  const base = pendingEditItem || original;
  const date = parseIsoDate(base.date);
  calendarItemId = original.id;
  calendarYear = date.getFullYear();
  calendarMonth = date.getMonth();
  if (editNameInput) {
    editNameInput.value = "";
    editNameInput.placeholder = "название";
  }
  if (calendarModal) {
    calendarModal.hidden = true;
  }
  renderCalendarTimeInput(base);
  renderCalendar();
  updateManualDateDisplay();
  renderEditOriginalCard(original);
  renderEditPreviewCard(base);
}

function startEditVoiceListening() {
  if (!recognition) {
    showVoiceUnavailableFallback("голосовое изменение недоступно в этом браузере");
    return;
  }

  if (!editingItemId) {
    return;
  }

  // Повторное нажатие — стоп.
  if (editVoiceActive) {
    stopEditVoiceListening();
    return;
  }

  unlockAudio();
  isSeriesActive = false;
  isSearchActive = false;
  editVoiceActive = true;
  setRecognitionContinuous(false);
  if (editVoiceStartButton) {
    editVoiceStartButton.classList.add("is-listening");
    editVoiceStartButton.textContent = "стоп";
  }
  if (editHasChanges) {
    showEditConfirmButton();
  } else {
    hideEditConfirmButton();
    hideEditVoiceResult();
  }
  hideStatus();
  restartRecognition();
  resetEditVoiceSilenceTimer();
}

function stopEditVoiceListening() {
  editVoiceActive = false;
  clearTimeout(editVoiceSilenceTimer);
  clearTimeout(restartTimer);
  shouldSkipNextRestart = true;
  try {
    recognition.stop();
  } catch (error) {}
  if (editVoiceStartButton) {
    editVoiceStartButton.classList.remove("is-listening");
    editVoiceStartButton.textContent = "старт";
  }
  // «ок» остаётся, если были изменения; иначе прячем.
  if (editHasChanges) {
    showEditConfirmButton();
  } else {
    hideEditConfirmButton();
    hideEditVoiceResult();
  }
}

function resetEditVoiceSilenceTimer() {
  clearTimeout(editVoiceSilenceTimer);
  if (!editVoiceActive) {
    return;
  }
  editVoiceSilenceTimer = setTimeout(() => {
    stopEditVoiceListening();
  }, 7000);
}

function showEditConfirmButton() {
  showEditVoiceResult();
  if (editConfirmButton) {
    editConfirmButton.hidden = false;
  }
}

function hideEditConfirmButton() {
  if (editConfirmButton) {
    editConfirmButton.hidden = true;
  }
}

function showEditVoiceResult() {
  if (editVoiceResult) {
    editVoiceResult.hidden = false;
  }
}

function hideEditVoiceResult() {
  if (editVoiceResult) {
    editVoiceResult.hidden = true;
  }
}

function attemptCloseEdit() {
  if (editVoiceActive) {
    stopEditVoiceListening();
  }
  // Крестик — сразу на главную, без вопроса (вопрос только по кнопке «ок»).
  closeEditDialog();
}

function showSaveConfirm() {
  if (editVoiceActive) {
    stopEditVoiceListening();
  }
  showConfirm("сохранить изменения?", () => {
    if (pendingEditItem) {
      updateItem(pendingEditItem);
      refreshSearchDialog();
    }
    editHasChanges = false;
    pendingEditItem = null;
    closeEditDialog();
    if (isSearchDialogOpen()) {
      closeSearchDialog();
    }
  }, { yesLabel: "сохранить", noLabel: "отмена", yesColor: "var(--color-primary)" });
}

function closeEditDialog() {
  if (!editModal) {
    return;
  }

  editVoiceActive = false;
  editHasChanges = false;
  pendingEditItem = null;
  clearTimeout(editVoiceSilenceTimer);
  hideEditConfirmButton();
  hideEditVoiceResult();
  if (editVoiceStartButton) {
    editVoiceStartButton.classList.remove("is-listening");
    editVoiceStartButton.textContent = "старт";
  }

  editModal.hidden = true;
  clearPhraseInput();
  hideStatus();
  if (document.activeElement && typeof document.activeElement.blur === "function") {
    document.activeElement.blur();
  }
  clearTimeout(editModalTimer);
  editingItemId = null;
  calendarItemId = null;
  if (editManualPanel) {
    editManualPanel.hidden = true;
  }
  if (calendarModal) {
    calendarModal.hidden = true;
  }
  stopSeriesListening();
  items = sortByDate(items);
  saveItems();
  renderList();
  refreshSearchDialog();

  if (!isSearchDialogOpen()) {
    unlockPageScroll();
  }
}

function isEditDialogOpen() {
  return Boolean(editModal && !editModal.hidden);
}

function resetEditModalTimer() {
  // Авто-закрытие окна изменения отключено: закрывается только кнопкой «закрыть».
  clearTimeout(editModalTimer);
}

function renderEditPreviewCard(item) {
  [editPreviewCard, editManualPreview].forEach((el) => {
    if (!el) {
      return;
    }
    el.innerHTML = "";
    if (item) {
      el.append(buildItemCard(item));
    }
  });
}

function renderEditOriginalCard(item) {
  [editCard, editManualCard].forEach((el) => {
    if (!el) {
      return;
    }
    el.innerHTML = "";
    if (item) {
      el.append(buildItemCard(item));
    }
  });
}

function updateManualDateDisplay() {
  if (!manualDateDisplay) {
    return;
  }
  const original = items.find((currentItem) => currentItem.id === calendarItemId);
  const hasDateChange = Boolean(
    pendingEditItem &&
    original &&
    (
      pendingEditItem.date !== original.date ||
      (pendingEditItem.displayDate || "") !== (original.displayDate || "")
    )
  );
  const text = hasDateChange ? getItemDateText(pendingEditItem) : "дата";
  manualDateDisplay.classList.toggle("has-value", hasDateChange);
  manualDateDisplay.innerHTML = "";
  manualDateDisplay.append(document.createTextNode(text + " "));
  const icon = document.createElement("span");
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "📅";
  manualDateDisplay.append(icon);
}

function buildItemCard(item) {
  const card = document.createElement("div");
  card.className = "edit-card";

  const name = document.createElement("p");
  const date = document.createElement("p");
  const time = document.createElement("p");

  name.className = "edit-card-name";
  date.className = "edit-card-date";
  time.className = "edit-card-time";

  appendLabeledText(name, "название", formatDisplayName(item.name));
  appendLabeledText(date, "дата", getItemDateText(item));
  appendLabeledText(time, "время", getItemTimeText(item));
  time.hidden = !getItemTimeText(item);

  card.append(name, date, time);
  return card;
}

function renderEditDialogItem(item) {
  if (!editCard || !item) {
    return;
  }

  editCard.innerHTML = "";

  const name = document.createElement("p");
  const date = document.createElement("p");
  const time = document.createElement("p");

  name.className = "edit-card-name";
  date.className = "edit-card-date";
  time.className = "edit-card-time";

  appendLabeledText(name, "название", formatDisplayName(item.name));
  appendLabeledText(date, "дата", getItemDateText(item));
  appendLabeledText(time, "время", getItemTimeText(item));
  time.hidden = !getItemTimeText(item);

  editCard.append(name, date, time);
}

function cancelEditing() {
  if (!editingItemId) {
    return;
  }

  const wasEditDialogOpen = isEditDialogOpen();
  editingItemId = null;
  if (editModal) {
    editModal.hidden = true;
  }
  clearTimeout(editModalTimer);
  if (wasEditDialogOpen && !isSearchDialogOpen()) {
    unlockPageScroll();
  }
  renderList();
}

function cancelSearch() {
  isSearchActive = false;
  manualSearchMode = false;
  clearTimeout(searchSilenceTimer);
  clearTimeout(manualSearchTimer);
  hideStatus();
  setStartButtonLabel("старт");

  if (manualInput && document.activeElement === manualInput) {
    manualInput.blur();
  }

  if (manualPlaceholder) {
    manualPlaceholder.textContent = "или напиши";
  }

  if (searchButton) {
    searchButton.classList.remove("is-listening");
  }

  if (startButton) {
    startButton.classList.remove("is-listening");
  }
  setStartButtonLabel("старт");
}

function startEditingItem(id) {
  const item = items.find((currentItem) => currentItem.id === id);

  if (!item) {
    return;
  }

  cancelSearch();
  editingItemId = id;
  isSeriesActive = false;
  setRecognitionContinuous(false);
  clearEditButtonFocus(id);
  openEditDialog(item);
}

function clearEditButtonFocus(id) {
  const button = document.querySelector(`.edit-button[data-item-id="${id}"]`);

  if (button) {
    button.blur();
  }
}

function hasDuplicateItem(newItem) {
  return items.some((item) => (
    normalize(item.name) === normalize(newItem.name) &&
    item.date === newItem.date &&
    (item.time || "") === (newItem.time || "") &&
    (item.period || "") === (newItem.period || "") &&
    (item.displayDate || "") === (newItem.displayDate || "")
  ));
}

function startSeriesListening() {
  if (!recognition) {
    showVoiceUnavailableFallback();
    return;
  }

  cancelEditing();
  cancelSearch();
  shouldSkipNextRestart = false;
  isSeriesActive = true;
  setRecognitionContinuous(false);
  startButton.classList.add("is-listening");
  setStartButtonLabel("стоп");
  if (startHint) {
    startHint.textContent = "Слушаю, можно сказать несколько напоминаний";
  }
  lastErrorPhrase = "";
  restartRecognition();
  resetSeriesSilenceTimer();
}

function setStartButtonLabel(text) {
  const label = startButton && startButton.querySelector(".start-text");
  if (label) {
    label.textContent = text;
  }
}

function stopSeriesListening() {
  isSeriesActive = false;
  clearTimeout(restartTimer);
  clearTimeout(seriesSilenceTimer);
  startButton.classList.remove("is-listening");
  setStartButtonLabel("старт");
  if (startHint) {
    startHint.textContent = "Нажми старт и скажи";
  }
  hideSeriesOkButton();
  setRecognitionContinuous(false);

  try {
    recognition.stop();
  } catch (error) {
    // Recognition may already be stopped by the browser.
  }
}

function finishSeriesByButton() {
  stopSeriesListening();
  hideStatus();
  clearPhraseInput();
}

function resetSeriesSilenceTimer() {
  clearTimeout(seriesSilenceTimer);

  if (!isSeriesActive) {
    return;
  }

  seriesSilenceTimer = setTimeout(() => {
    finishSeriesByButton();
  }, SERIES_SILENCE_TIMEOUT_MS);
}

function showSeriesOkButton() {
  if (seriesOkButton) {
    seriesOkButton.hidden = false;
  }
}

function hideSeriesOkButton() {
  if (seriesOkButton) {
    seriesOkButton.hidden = true;
  }
}

function setRecognitionContinuous(value) {
  if (!recognition) {
    return;
  }

  try {
    recognition.continuous = value;
  } catch (error) {
    // Some browsers do not allow changing this while recognition is active.
  }
}

function startRecognition() {
  try {
    recognition.start();
    isRecognitionRunning = true;
  } catch (error) {
    if (error && error.name === "InvalidStateError") {
      // распознавание уже идёт — просто продолжаем слушать
      isRecognitionRunning = true;
      return;
    }
    isRecognitionRunning = false;
    startButton.classList.remove("is-listening");
  }
}

function restartRecognition() {
  clearTimeout(restartTimer);

  if (!isRecognitionRunning) {
    startRecognition();
    return;
  }

  try {
    shouldSkipNextRestart = true;
    recognition.stop();
  } catch (error) {
    shouldSkipNextRestart = false;
    // Recognition may already be stopped.
  }

  restartTimer = setTimeout(startRecognition, 80);
}

function parsePhrase(value, options = {}) {
  lastParseError = "";
  const phrase = normalize(value);
  const sourceText = value.trim();
  const getName = (endIndex) => getParsedName(
    options.preserveNameCase ? sourceText.slice(0, endIndex) : phrase.slice(0, endIndex),
  );

  if (!phrase) {
    return null;
  }

  const time = parseTime(phrase, options);
  const period = time ? "" : parseDayPeriod(phrase);
  const relative = parseRelativeDate(phrase);
  const yearOnly = parseYearOnlyDate(phrase);
  if (yearOnly) {
    return {
      id: createId(),
      name: getName(yearOnly.index),
      date: toIsoDate(yearOnly.date),
      time: null,
      period,
      displayDate: yearOnly.displayDate,
      source: value.trim(),
    };
  }

  // Для «через N часов/минут» время берём из расчёта «через», а не из часов
  // (иначе «через 2 часа» путается с «в 2 часа» = 14:00).
  const parsedTime = getTimeFromRelative(relative) || time;
  const approximate = parseApproximateDate(phrase);
  if (approximate) {
    return {
      id: createId(),
      name: getName(approximate.index),
      date: toIsoDate(approximate.date),
      time: parsedTime,
      period,
      displayDate: approximate.displayDate,
      source: value.trim(),
    };
  }

  const weekday = parseWeekdayDate(phrase);
  if (weekday) {
    return {
      id: createId(),
      name: getName(weekday.index),
      date: toIsoDate(weekday.date),
      time: parsedTime,
      period,
      source: value.trim(),
    };
  }

  const exact = parseExactDate(phrase, relative);
  if (exact) {
    const name = getName(exact.index);

    return {
      id: createId(),
      name,
      date: toIsoDate(exact.date),
      time: parsedTime,
      period,
      displayDate: exact.displayDate,
      source: value.trim(),
    };
  }

  const named = parseNamedDate(phrase);
  if (named) {
    const name = getName(named.index);

    return {
      id: createId(),
      name,
      date: toIsoDate(named.date),
      time: parsedTime,
      period,
      source: value.trim(),
    };
  }

  if (relative) {
    const name = getName(relative.index);

    return {
      id: createId(),
      name,
      date: toIsoDate(relative.date),
      time: parsedTime,
      period,
      source: value.trim(),
    };
  }

  return null;
}

function parseRelativeDate(phrase) {
  const halfYear = parseHalfYearDate(phrase);

  if (halfYear) {
    return halfYear;
  }

  const spokenRelativeDate = parseSpokenRelativeDate(phrase);

  if (spokenRelativeDate) {
    return spokenRelativeDate;
  }

  const match = phrase.match(
    /(?:^|\s)через\s+(минуту|час|день|неделю|месяц|год|(\d+)\s*(минуту|минуты|минут|час|часа|часов|день|дня|дней|неделю|недели|недель|месяц|месяца|месяцев|год|года|лет))/,
  );

  if (!match) {
    return null;
  }

  const date = new Date();
  const amount = match[2] ? Number(match[2]) : 1;
  const unit = match[3] || match[1];

  if (unit.startsWith("мин")) {
    date.setMinutes(date.getMinutes() + amount);
  } else if (unit.startsWith("час")) {
    date.setHours(date.getHours() + amount);
  } else if (unit.startsWith("д")) {
    date.setDate(date.getDate() + amount);
  } else if (unit.startsWith("нед")) {
    date.setDate(date.getDate() + amount * 7);
  } else if (unit.startsWith("мес")) {
    date.setMonth(date.getMonth() + amount);
  } else {
    date.setFullYear(date.getFullYear() + amount);
  }

  return { date, index: match.index, unit: getRelativeUnit(unit) };
}

function parseSpokenRelativeDate(phrase) {
  const amountWords = Object.keys(amountWordMap).sort((a, b) => b.length - a.length).join("|");
  const regex = new RegExp(
    `(?:^|\\s)через\\s+(${amountWords})\\s+(минуту|минуты|минут|час|часа|часов|день|дня|дней|неделю|недели|недель|месяц|месяца|месяцев|год|года|лет)`,
  );
  const match = regex.exec(phrase);

  if (!match) {
    return null;
  }

  return getRelativeDateByAmount(amountWordMap[match[1]], match[2], match.index);
}

function getRelativeDateByAmount(amount, unit, index, baseDate = new Date()) {
  const date = new Date(baseDate);

  if (unit.startsWith("мин")) {
    date.setMinutes(date.getMinutes() + amount);
  } else if (unit.startsWith("час")) {
    date.setHours(date.getHours() + amount);
  } else if (unit.startsWith("д")) {
    date.setDate(date.getDate() + amount);
  } else if (unit.startsWith("нед")) {
    date.setDate(date.getDate() + amount * 7);
  } else if (unit.startsWith("мес")) {
    date.setMonth(date.getMonth() + amount);
  } else {
    date.setFullYear(date.getFullYear() + amount);
  }

  return { date, index, unit: getRelativeUnit(unit) };
}

function parseHalfYearDate(phrase) {
  const match = phrase.match(/(?:^|\s)через\s+(полгода|пол\s+года|полгоду)/);

  if (!match) {
    return null;
  }

  const date = new Date();
  date.setMonth(date.getMonth() + 6);

  return { date, index: match.index, unit: "month" };
}

function parseYearOnlyDate(phrase) {
  const match = phrase.match(/(?:^|\s)до\s+((?:\d{4})|(?:следующего|следующий)\s+года?)/);

  if (!match) {
    return null;
  }

  const year = getExplicitYear(match[1]);
  if (!year) {
    return null;
  }

  return {
    date: new Date(year, 0, 1),
    index: match.index,
    displayDate: normalize(match[0]),
  };
}

function parseDayPeriod(phrase) {
  const match = phrase.match(/(?:^|\s)(утром|утро|днем|днём|день|вечером|вечер|ночью|ночь)(?:\s|$)/);

  if (!match) {
    return "";
  }

  if (match[1] === "утром" || match[1] === "утро") {
    return "утром";
  }

  if (match[1] === "днем" || match[1] === "днём" || match[1] === "день") {
    return "днём";
  }

  if (match[1] === "вечером" || match[1] === "вечер") {
    return "вечером";
  }

  return "ночью";
}

function getRelativeUnit(unit) {
  if (unit.startsWith("мин")) {
    return "minute";
  }

  if (unit.startsWith("час")) {
    return "hour";
  }

  if (unit.startsWith("д")) {
    return "day";
  }

  if (unit.startsWith("нед")) {
    return "week";
  }

  if (unit.startsWith("мес")) {
    return "month";
  }

  return "year";
}

function parseNamedDate(phrase) {
  const match = phrase.match(/(?:^|\s)(?:до\s+)?(сегодня|завтра|послезавтра)(?=\s|$)/);

  if (!match) {
    return null;
  }

  const date = new Date();

  if (match[1] === "завтра") {
    date.setDate(date.getDate() + 1);
  }

  if (match[1] === "послезавтра") {
    date.setDate(date.getDate() + 2);
  }

  return { date, index: match.index };
}

function parseApproximateDate(phrase) {
  return (
    parseNextYearDate(phrase) ||
    parseYearPartDate(phrase) ||
    parseNextMonthDate(phrase) ||
    parseMonthPartDate(phrase)
  );
}

function parseNextYearDate(phrase) {
  const match = phrase.match(/(?:^|\s)в\s+следующ(?:ем|ий)\s+год(?:у)?/);

  if (!match) {
    return null;
  }

  return {
    date: new Date(new Date().getFullYear() + 1, 0, 1),
    index: match.index,
    displayDate: normalize(match[0]),
  };
}

function parseYearPartDate(phrase) {
  const match = phrase.match(/(?:^|\s)в\s+(начале|середине|конце)\s+(следующего\s+)?года/);

  if (!match) {
    return null;
  }

  const now = new Date();
  let month = 0;
  let day = 1;

  if (match[1] === "середине") {
    month = 6;
    day = 15;
  }

  if (match[1] === "конце") {
    month = 11;
    day = 1;
  }

  let year = now.getFullYear() + (match[2] ? 1 : 0);
  let date = new Date(year, month, day);
  let displayDate = normalize(match[0]);

  if (!match[2] && date < startOfToday()) {
    year = now.getFullYear() + 1;
    date = new Date(year, month, day);
    displayDate = `${displayDate.replace(/\s+года$/, "")} ${year} года`;
  }

  return { date, index: match.index, displayDate };
}

function parseNextMonthDate(phrase) {
  const match = phrase.match(/(?:^|\s)в\s+следующ(?:ем|ий)\s+месяц(?:е)?/);

  if (!match) {
    return null;
  }

  const now = new Date();
  return {
    date: new Date(now.getFullYear(), now.getMonth() + 1, 1),
    index: match.index,
    displayDate: normalize(match[0]),
  };
}

function parseMonthPartDate(phrase) {
  const regex = new RegExp(
    `(?:^|\\s)в\\s+(?:(начале|середине|конце)\\s+)?(${monthWordPattern})`,
  );
  const match = regex.exec(phrase);

  if (!match) {
    return null;
  }

  const month = monthMap[match[2]];
  const now = new Date();
  let year = getPhraseYearHint(phrase) || now.getFullYear();
  const day = getApproximateMonthDay(match[1], month, year);
  let date = new Date(year, month, day);
  let displayDate = match[1]
    ? normalize(match[0])
    : monthDisplayNames[month];

  if (!getPhraseYearHint(phrase) && date < startOfToday()) {
    year += 1;
    date = new Date(year, month, getApproximateMonthDay(match[1], month, year));
    displayDate = `${displayDate} ${year} года`;
  }

  return { date, index: match.index, displayDate };
}

function getApproximateMonthDay(part, month, year) {
  if (part === "середине") {
    return 15;
  }

  if (part === "конце") {
    return lastDayOfMonth(month, year);
  }

  return 1;
}

function parseWeekdayDate(phrase) {
  const regex = /(?:^|\s)(?:в\s+)?(?:(следующий|следующая|следующее|следующей)\s+)?([а-яё]+)/g;
  let match = regex.exec(phrase);

  while (match) {
    const weekday = weekdayMap[match[2]];

    if (weekday !== undefined) {
      const date = getWeekdayDate(weekday, Boolean(match[1]));
      return { date, index: match.index };
    }

    match = regex.exec(phrase);
  }

  return null;
}

function getWeekdayDate(weekday, isNextWeek) {
  const date = startOfToday();
  const today = date.getDay();
  let daysToAdd = (weekday - today + 7) % 7;

  if (daysToAdd === 0 || isNextWeek) {
    daysToAdd += 7;
  }

  date.setDate(date.getDate() + daysToAdd);
  return date;
}

function parseTime(phrase, options = {}) {
  if (/(?:^|\s)(?:в|на)?\s*полночь(?:\s|$)/.test(phrase)) {
    return "00:00";
  }

  const spokenTime = parseSpokenHourTime(phrase);

  if (spokenTime) {
    return spokenTime;
  }

  const wordMatch = phrase.match(/(?:^|\s)(?:в|на)\s+час\s*(утра|вечера|дня|ночи)?/);

  if (wordMatch) {
    const dayPart = wordMatch[1];
    const hour = dayPart === "утра" || dayPart === "ночи" ? 1 : 13;

    return `${String(hour).padStart(2, "0")}:00`;
  }

  const match = phrase.match(
    /(?:^|\s)(?:(?:в|на)\s+)?(\d{1,2})(?:(?::|\.)(\d{2})|\s*(?:часа?|часов)(?:\s*(?:и\s*)?(\d{1,2})\s*(?:минут|минуты|минута))?)\s*(утра|вечера|дня|ночи)?/,
  );

  if (!match && options.preferWrittenTime) {
    const writtenMatch = phrase.match(/(?:^|\s)(?:(?:в|на)\s+)?(\d{1,2})\s*(утра|вечера|дня|ночи)?$/);

    if (writtenMatch) {
      const hour = normalizeParsedHour(Number(writtenMatch[1]), writtenMatch[2], options);

      if (hour <= 23) {
        return `${String(hour).padStart(2, "0")}:00`;
      }
    }
  }

  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2] || match[3] || 0);
  const dayPart = match[4];

  hour = normalizeParsedHour(hour, dayPart, options);

  if (dayPart === "ночи" && hour === 12) {
    hour = 0;
  }

  if (hour > 23 || minute > 59) {
    return null;
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function parseSpokenHourTime(phrase) {
  const hourWords = Object.keys(hourWordMap).sort((a, b) => b.length - a.length).join("|");
  const regex = new RegExp(
    `(?:^|\\s)(?:в|на)\\s+(${hourWords})(?:\\s+час(?:а|ов)?)?\\s*(утра|вечера|дня|ночи)?`,
  );
  const match = regex.exec(phrase);

  if (!match) {
    return null;
  }

  let hour = hourWordMap[match[1]];
  const dayPart = match[2];

  hour = normalizeParsedHour(hour, dayPart);

  if (dayPart === "ночи" && hour === 12) {
    hour = 0;
  }

  return `${String(hour).padStart(2, "0")}:00`;
}

function normalizeParsedHour(hour, dayPart, options = {}) {
  if (dayPart === "вечера" || dayPart === "дня") {
    return hour < 12 ? hour + 12 : hour;
  }

  if (options.preferWrittenTime) {
    return hour;
  }

  if (!dayPart && hour >= 1 && hour <= 7) {
    return hour + 12;
  }

  return hour;
}

function parseExactDate(phrase, relative) {
  const numericDate = parseNumericExactDate(phrase);

  if (numericDate) {
    return numericDate;
  }

  const spokenDate = parseSpokenExactDate(phrase, relative);

  if (spokenDate) {
    return spokenDate;
  }

  const regex = /(?:^|\s)(до\s+)?(?:(\d{1,2})\s*)?([а-яё]+)(?:\s+((?:\d{4})|(?:следующего|следующий)\s+года?))?/g;
  let match = null;
  let currentMatch = regex.exec(phrase);

  while (currentMatch) {
    const hasDateSignal = Boolean(currentMatch[1] || currentMatch[2]);
    const hasKnownMonth = monthMap[currentMatch[3]] !== undefined;

    if (hasDateSignal && hasKnownMonth) {
      match = currentMatch;
      break;
    }

    currentMatch = regex.exec(phrase);
  }

  if (!match) {
    return null;
  }

  const month = monthMap[match[3]];
  if (month === undefined) {
    return null;
  }

  const now = new Date();
  const day = match[2]
    ? Number(match[2])
    : 1;
  let year =
    getExplicitYear(match[4]) ||
    getPhraseYearHint(phrase) ||
    getRelativeYear(relative) ||
    now.getFullYear();

  let date = new Date(year, month, day);
  let displayDate = !match[2] ? normalize(match[0]) : "";

  if (!match[4] && !getRelativeYear(relative) && date < startOfToday()) {
    year += 1;
    date = new Date(year, month, day);
    if (displayDate) {
      displayDate = `${displayDate} ${year} года`;
    }
  }

  if (!isValidMonthDay(day, month, year)) {
    setInvalidDateError(day, month);
    return null;
  }

  return { date, index: match.index, displayDate };
}

function parseNumericExactDate(phrase) {
  const match = phrase.match(/(?:^|\s)(?:до\s+)?(\d{1,2})[./-](\d{1,2})(?:[./-](\d{2}|\d{4}))?\.?(?=\s|$)/);

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const now = new Date();
  let year = match[3]
    ? normalizeNumericYear(match[3])
    : now.getFullYear();

  let date = new Date(year, month, day);

  if (!match[3] && date < startOfToday()) {
    year += 1;
    date = new Date(year, month, day);
  }

  if (month < 0 || month > 11 || !isValidMonthDay(day, month, year)) {
    setInvalidDateError(day, Math.max(0, Math.min(month, 11)));
    return null;
  }

  return { date, index: match.index, displayDate: "" };
}

function normalizeNumericYear(value) {
  const year = Number(value);
  return value.length === 2 ? 2000 + year : year;
}

function parseSpokenExactDate(phrase, relative) {
  const dayWords = Object.keys(dayWordMap).sort((a, b) => b.length - a.length).join("|");
  const regex = new RegExp(
    `(?:^|\\s)(до\\s+)?(${dayWords})\\s+(${monthWordPattern})(?:\\s+((?:\\d{4})|(?:следующего|следующий)\\s+года?))?`,
    "g",
  );
  const match = regex.exec(phrase);

  if (!match) {
    return null;
  }

  const day = dayWordMap[match[2]];
  const month = monthMap[match[3]];
  const now = new Date();
  let year =
    getExplicitYear(match[4]) ||
    getPhraseYearHint(phrase) ||
    getRelativeYear(relative) ||
    now.getFullYear();

  let date = new Date(year, month, day);
  let displayDate = !match[2] ? normalize(match[0]) : "";

  if (!match[4] && !getRelativeYear(relative) && date < startOfToday()) {
    year += 1;
    date = new Date(year, month, day);
    if (displayDate) {
      displayDate = `${displayDate} ${year} года`;
    }
  }

  if (!isValidMonthDay(day, month, year)) {
    setInvalidDateError(day, month);
    return null;
  }

  return { date, index: match.index, displayDate };
}

function isValidMonthDay(day, month, year) {
  return day >= 1 && day <= lastDayOfMonth(month, year);
}

function setInvalidDateError(day, month) {
  lastParseError = day === 29 && month === 1
    ? "invalid-leap-day"
    : "invalid-month-day";
}

function getExplicitYear(value) {
  if (!value) {
    return null;
  }

  if (/^\d{4}$/.test(value)) {
    return Number(value);
  }

  if (value.includes("следующ")) {
    return new Date().getFullYear() + 1;
  }

  return null;
}

function getPhraseYearHint(phrase) {
  if (/(?:^|\s)(?:следующ(?:его|ий|ем)|следук)\s+год(?:а|у)?(?:\s|$)/.test(phrase)) {
    return new Date().getFullYear() + 1;
  }

  return null;
}

function getRelativeYear(relative) {
  if (!relative || relative.unit !== "year") {
    return null;
  }

  return relative.date.getFullYear();
}

function getTimeFromRelative(relative) {
  if (!relative || !["minute", "hour"].includes(relative.unit)) {
    return null;
  }

  return `${String(relative.date.getHours()).padStart(2, "0")}:${String(relative.date.getMinutes()).padStart(2, "0")}`;
}

function getParsedName(rawName) {
  const name = cleanName(rawName);

  return name;
}

function cleanName(name) {
  return (
    name
      .replace(/\bсрок\b/g, "")
      .replace(/\bпредмет\b/g, "")
      .replace(/(?:^|\s)(?:до\s+)?\d{1,2}[./-]\d{1,2}(?:[./-]\d{2,4})?\.?(?=\s|$)/g, " ")
      .replace(/\b(?:до|на)\s+(сегодня|завтра|послезавтра)\b/g, "")
      .replace(/через\s+(полгода|пол\s+года|полгоду)/g, "")
      .replace(/через\s+(минуту|час|день|неделю|месяц|год|(\d+)\s*(минуту|минуты|минут|час|часа|часов|день|дня|дней|неделю|недели|недель|месяц|месяца|месяцев|год|года|лет))/g, "")
      .replace(/\bв\s+следующ(?:ем|ий)\s+год(?:у)?/g, "")
      .replace(/\bв\s+(начале|середине|конце)\s+(следующего\s+)?года/g, "")
      .replace(/\bв\s+следующ(?:ем|ий)\s+месяц(?:е)?/g, "")
      .replace(/\bв\s+(?:(начале|середине|конце)\s+)?(январь|январе|января|феврале|февраль|февраля|март|марте|марта|апрель|апреле|апреля|май|мае|мая|июнь|июне|июня|июль|июле|июля|август|августе|августа|сентябрь|сентябре|сентября|октябрь|октябре|октября|ноябрь|ноябре|ноября|декабрь|декабре|декабря)/g, "")
      .replace(/\b(?:в|на)\s+(один|одна|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять|одиннадцать|двенадцать|тринадцать|четырнадцать|пятнадцать|шестнадцать|семнадцать|восемнадцать|девятнадцать|двадцать|двадцать один|двадцать два|двадцать три)(?:\s+час(?:а|ов)?)?\s*(утра|вечера|дня|ночи)?/g, "")
      .replace(/\b(?:в|на)\s+час\s*(утра|вечера|дня|ночи)?/g, "")
      .replace(/\b(?:в|на)?\s*полночь\b/g, "")
      .replace(/\b(?:(?:в|на)\s+)?\d{1,2}(?:(?::|\.)\d{2}|\s*(?:часа?|часов)(?:\s*(?:и\s*)?\d{1,2}\s*(?:минут|минуты|минута))?)\s*(утра|вечера|дня|ночи)?/g, "")
      .replace(/(?:в\s+)?(?:следующий|следующая|следующее|следующей)?\s*(понедельник|понедельника|вторник|вторника|среду|среда|среды|четверг|четверга|пятницу|пятница|пятницы|субботу|суббота|субботы|воскресенье|воскресенья)/g, "")
      .replace(/\b(утром|утро|днем|днём|день|вечером|вечер|ночью|ночь)\b/g, "")
      .replace(/[.,!?]+/g, "")
      .replace(/\s+/g, " ")
      .replace(/(?:^|\s)(?:на|до)\s*$/g, "")
      .trim()
      || "предмет"
  );
}

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function formatDisplayName(value) {
  return String(value || "");
}

function showConfirm(message, onConfirm, options = {}) {
  const overlay = document.createElement("div");
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.45);" +
    "display:flex;align-items:center;justify-content:center;padding:20px;";
  const box = document.createElement("div");
  box.style.cssText =
    "background:#fff;color:#222;border-radius:16px;padding:22px;max-width:340px;" +
    "width:100%;text-align:center;display:flex;flex-direction:column;gap:18px;";
  const text = document.createElement("p");
  text.textContent = message;
  text.style.cssText = "margin:0;font-size:18px;";
  const row = document.createElement("div");
  row.style.cssText = "display:flex;gap:10px;";
  const yes = document.createElement("button");
  yes.type = "button";
  yes.textContent = options.yesLabel || "да";
  const isDangerConfirm = String(options.yesColor || "").includes("danger");
  const confirmBackground = isDangerConfirm
    ? "radial-gradient(circle at 50% 12%, rgba(255,255,255,.14), transparent 3.5rem),linear-gradient(145deg,#e06c62,#c6534b)"
    : "radial-gradient(circle at 50% 12%, rgba(255,255,255,.16), transparent 3.5rem),linear-gradient(145deg,#39b978,#21865a)";
  yes.style.cssText =
    "flex:1;min-height:46px;border:1px solid rgba(255,255,255,.32);border-radius:12px;" +
    "font-size:16px;color:#fff;font-weight:700;text-shadow:0 1px 2px rgba(8,36,22,.22);" +
    "box-shadow:0 14px 32px rgba(22,115,72,.24);background:" + confirmBackground + ";";
  const no = document.createElement("button");
  no.type = "button";
  no.textContent = options.noLabel || "отмена";
  no.style.cssText =
    "flex:1;min-height:46px;border:0;border-radius:12px;font-size:16px;font-weight:700;" +
    "background:#e2e2e2;color:#222;";
  yes.addEventListener("click", () => { overlay.remove(); onConfirm(); });
  no.addEventListener("click", () => overlay.remove());
  row.append(no, yes);
  if (options.cardNode) {
    const cardWrap = document.createElement("div");
    cardWrap.style.cssText =
      "background:var(--color-soft,#eef4f0);color:#222;border-radius:12px;" +
      "padding:14px;text-align:left;";
    cardWrap.append(options.cardNode);
    box.append(cardWrap, text, row);
  } else {
    box.append(text, row);
  }
  overlay.append(box);
  document.body.append(overlay);
}

function renderList() {
  list.innerHTML = "";
  list.setAttribute("role", "group");
  list.setAttribute("aria-labelledby", "reminders-list-title");

  if (topButton) {
    topButton.hidden = items.length < 3;
  }

  const timelineHead = document.querySelector(".timeline-head");
  if (timelineHead) {
    timelineHead.style.display = items.length === 0 ? "none" : "";
  }

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "пока ничего нет";
    list.append(empty);
    return;
  }

  items.forEach((item) => {
    const element = document.createElement("li");
    element.className = "item";
    element.setAttribute("role", "none");
    element.dataset.itemId = item.id;

    const content = document.createElement("div");
    const actions = document.createElement("div");
    const name = document.createElement("p");
    const date = document.createElement("p");
    const time = document.createElement("p");
    const visibleName = document.createElement("span");
    const visibleDate = document.createElement("span");
    const visibleTime = document.createElement("span");
    const screenReaderName = document.createElement("span");
    const screenReaderDate = document.createElement("span");
    const screenReaderTime = document.createElement("span");
    const days = document.createElement("p");
    const visibleDays = document.createElement("span");
    const screenReaderDays = document.createElement("span");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    const visibleEditText = document.createElement("span");
    const screenReaderEditText = document.createElement("span");
    const visibleDeleteText = document.createElement("span");
    const screenReaderDeleteText = document.createElement("span");

    name.className = "item-name";
    date.className = "item-date";
    time.className = "item-time";
    screenReaderName.className = "visually-hidden";
    screenReaderDate.className = "visually-hidden";
    screenReaderTime.className = "visually-hidden";
    days.className = "item-days";
    screenReaderDays.className = "visually-hidden";
    actions.className = "item-actions";
    editButton.className = "edit-button";
    deleteButton.className = "delete-button";
    screenReaderEditText.className = "visually-hidden";
    screenReaderDeleteText.className = "visually-hidden";
    editButton.type = "button";
    deleteButton.type = "button";
    editButton.dataset.itemId = item.id;

    appendLabeledText(visibleName, "название", formatDisplayName(item.name));
    visibleName.setAttribute("aria-hidden", "true");
    screenReaderName.textContent = `название: ${formatDisplayName(item.name)}`;
    appendLabeledText(visibleDate, "дата", getItemDateText(item));
    visibleDate.setAttribute("aria-hidden", "true");
    screenReaderDate.textContent = `дата: ${getItemDateLabelText(item)}`;
    appendLabeledText(visibleTime, "время", getItemTimeText(item));
    visibleTime.setAttribute("aria-hidden", "true");
    screenReaderTime.textContent = `время: ${getItemTimeText(item)}`;
    time.hidden = !getItemTimeText(item);
    visibleDays.textContent = formatDaysLeftVisible(item.date);
    visibleDays.setAttribute("aria-hidden", "true");
    screenReaderDays.textContent = formatDaysLeftLabel(item.date);
    visibleEditText.textContent = "изменить";
    visibleEditText.setAttribute("aria-hidden", "true");
    screenReaderEditText.textContent = `изменить напоминание ${formatDisplayName(item.name)}`;
    visibleDeleteText.textContent = "удалить";
    visibleDeleteText.setAttribute("aria-hidden", "true");
    screenReaderDeleteText.textContent = `удалить напоминание ${formatDisplayName(item.name)}`;
    editButton.addEventListener("click", () => {
      startEditingItem(item.id);
    });
    deleteButton.addEventListener("click", () => {
      showConfirm("удалить напоминание?", () => {
        deleteItem(item.id);
      });
    });

    days.append(visibleDays, screenReaderDays);
    name.append(visibleName, screenReaderName);
    date.append(visibleDate, screenReaderDate);
    time.append(visibleTime, screenReaderTime);
    editButton.append(visibleEditText, screenReaderEditText);
    deleteButton.append(visibleDeleteText, screenReaderDeleteText);
    content.append(name, date, time);
    actions.append(editButton, deleteButton);
    element.append(content, days, actions);
    list.append(element);
  });
}

function getListLabel() {
  if (!items.length) {
    return "список пуст.";
  }

  return "список напоминаний.";
}

function appendLabeledText(container, label, value) {
  const labelElement = document.createElement("span");
  const valueElement = document.createElement("span");

  labelElement.className = "field-label";
  labelElement.textContent = `${label}: `;
  valueElement.className = "field-value";
  valueElement.textContent = value;
  container.append(labelElement, valueElement);
}

function deleteItem(id) {
  items = items.filter((item) => item.id !== id);
  saveItems();
  renderList();
  scheduleAllNotifications();
  showStatus("удалено", SHORT_MESSAGE_VISIBLE_MS);
}

// Поправки частых ошибок распознавания голоса (слышит одно — пишем нужное).
// Сюда можно дописывать новые пары: [что услышалось, на что заменить].
const VOICE_CORRECTIONS = [
  [/(^|[^а-яёa-z])то\s+есть(?![а-яёa-z])/gi, "$1тест"],
  [/\btest\b/gi, "тест"],
  [/^\s*ты\s*$/i, "тест"],
];

function applyVoiceCorrections(text) {
  let result = text || "";
  for (const [pattern, replacement] of VOICE_CORRECTIONS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function getFinalPhraseFromResult(event) {
  let phrase = "";

  for (let index = event.resultIndex; index < event.results.length; index += 1) {
    if (event.results[index].isFinal) {
      phrase += ` ${event.results[index][0].transcript}`;
    }
  }

  return phrase.trim();
}

function splitSeriesPhrase(value) {
  const phrase = normalizeInputForAI(value);
  const markerPattern = "(?:через\\s+(?:минуту|час|полчаса|пол\\s+часа|(?:\\d+|одну|один|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять|пару)\\s+(?:минуту|минуты|минут|час|часа|часов|день|дня|дней|неделю|недели|недель|месяц|месяца|месяцев))|(?:до\\s+)?(?:сегодня|завтра|послезавтра))";
  const markerRegex = new RegExp(markerPattern, "gi");
  const markers = Array.from(phrase.matchAll(markerRegex));

  if (markers.length < 2) {
    return [value];
  }

  const chunks = [];
  let chunkStart = 0;

  markers.forEach((match, index) => {
    const markerEnd = match.index + match[0].length;
    const nextMarker = markers[index + 1];

    if (!nextMarker) {
      chunks.push(phrase.slice(chunkStart).trim());
      return;
    }

    const between = phrase.slice(markerEnd, nextMarker.index).trim();

    if (!between) {
      return;
    }

    const nextNameMatch = between.match(/[а-яёa-z0-9][а-яёa-z0-9\s-]*$/i);

    if (!nextNameMatch) {
      return;
    }

    const nextChunkStart = markerEnd + between.lastIndexOf(nextNameMatch[0]);
    chunks.push(phrase.slice(chunkStart, nextChunkStart).trim());
    chunkStart = nextChunkStart;
  });

  const cleanChunks = chunks.filter(Boolean);

  return cleanChunks.length > 1 ? cleanChunks : [value];
}

function setupSpeech() {
  const BrowserRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!BrowserRecognition) {
    showStatus(
      getVoiceUnavailableMessage(),
    );
    return;
  }

  recognition = new BrowserRecognition();
  recognition.lang = "ru-RU";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.addEventListener("result", async (event) => {
    const phrase = applyVoiceCorrections(getFinalPhraseFromResult(event));

    if (!phrase) {
      return;
    }

    if (isSeriesActive && !isSearchActive && !editingItemId) {
      const phrases = splitSeriesPhrase(phrase);

      if (phrases.length > 1) {
        for (const currentPhrase of phrases) {
          const result = await handlePhrase(currentPhrase, { fromSpeech: true });

          if (result !== false && result !== "silent") {
            const displayedPhrase = getRecognizedPhraseText(currentPhrase, result);
            showRecognizedPhrase(displayedPhrase);
            announceToScreenReader(`распознано: ${displayedPhrase}`);
          }
        }

        resetSeriesSilenceTimer();
        return;
      }
    }

    const result = isSearchActive
      ? await handleSearchPhrase(phrase)
      : editingItemId
        ? handleEditPhrase(phrase)
        : await handlePhrase(phrase, { fromSpeech: true });

    if (result !== false && result !== "silent") {
      const displayedPhrase = getRecognizedPhraseText(phrase, result);
      showRecognizedPhrase(displayedPhrase);
      announceToScreenReader(`распознано: ${displayedPhrase}`);
    }

    if (editingItemId && result && result.type === "edit") {
      editHasChanges = true;
      showEditConfirmButton();
      resetEditVoiceSilenceTimer();
    } else if (!isSeriesActive && !isEditDialogOpen() && result !== false) {
      stopSeriesListening();
    } else if (isSeriesActive && result !== false) {
      resetSeriesSilenceTimer();
    }
  });

  recognition.addEventListener("end", () => {
    isRecognitionRunning = false;

    if (shouldSkipNextRestart) {
      shouldSkipNextRestart = false;
      return;
    }

    // Перезапускаем прослушивание в режиме серии и в голосовом изменении.
    if (isSeriesActive || editVoiceActive || isSearchActive) {
      clearTimeout(restartTimer);
      restartTimer = setTimeout(startRecognition, 80);
      return;
    }

    // Остальное — останавливаемся, как у главной кнопки.
    startButton.classList.remove("is-listening");
    if (editVoiceStartButton) {
      editVoiceStartButton.classList.remove("is-listening");
    }
    if (searchButton) {
      searchButton.classList.remove("is-listening");
    }
  });

  recognition.addEventListener("error", (event) => {
    isRecognitionRunning = false;

    // В серии и в голосовом изменении молчание не прерывает — продолжаем слушать.
    if ((isSeriesActive || editVoiceActive || isSearchActive) && event.error === "no-speech") {
      return;
    }

    if (isSearchActive) {
      cancelSearch();
    }
    if (editVoiceActive) {
      stopEditVoiceListening();
    }
    startButton.classList.remove("is-listening");
    if (searchButton) {
      searchButton.classList.remove("is-listening");
    }
    if (editVoiceStartButton) {
      editVoiceStartButton.classList.remove("is-listening");
    }

    // Молчание не показываем как ошибку, чтобы надпись не висела.
    if (event.error !== "no-speech") {
      showStatus(getRecognitionErrorMessage());
    }
  });

  recognition.addEventListener("speechstart", () => {
    if (isSeriesActive) {
      resetSeriesSilenceTimer();
    }
    if (editVoiceActive) {
      resetEditVoiceSilenceTimer();
    }
  });
}

function showVoiceUnavailableFallback(message = getVoiceUnavailableMessage()) {
  startButton.classList.remove("is-listening");
  showStatus(message);

  if (manualInput) {
    manualInput.focus();
  }
}

function getVoiceUnavailableMessage() {
  return isIosDevice()
    ? "на iPhone голос может не работать в установленном приложении, напиши вручную"
    : "голос недоступен в этом браузере, напиши вручную";
}

function isIosDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function getRecognitionErrorMessage() {
  if (editingItemId) {
    return "Голос не сработал, нажми сказать еще раз";
  }

  if (isSearchActive) {
    return "Голос не сработал, нажми поиск еще раз";
  }

  return "Голос не сработал, нажми старт еще раз";
}

async function requestNotificationPermission() {
  if (!window.isSecureContext) {
    showNotifyStatus("уведомления работают только по защищенной ссылке https");
    return;
  }

  if (!("Notification" in window)) {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (!standalone && isIosDevice()) {
      showNotifyStatus(
        "на айфоне: открой в Safari, нажми Поделиться → «На экран «Домой»», открой с иконки и снова включи уведомления",
      );
    } else if (!standalone) {
      showNotifyStatus(
        "сначала установи приложение: меню браузера → «Установить приложение», открой с иконки и снова включи",
      );
    } else {
      showNotifyStatus("этот браузер не поддерживает уведомления");
    }
    return;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      showNotifyStatus("уведомления включены");
      scheduleAllNotifications();
      return;
    }

    showNotifyStatus(
      permission === "denied"
        ? "уведомления запрещены в настройках браузера"
        : "уведомления не включены",
    );
  } catch (error) {
    showNotifyStatus("не получилось включить уведомления");
  }
}

function showStatus(message, visibleMs = MESSAGE_VISIBLE_MS) {
  clearTimeout(statusTimer);
  statusText.classList.remove("is-visible");
  statusText.textContent = message;
  announceToScreenReader(message);

  requestAnimationFrame(() => {
    statusText.classList.add("is-visible");
  });

  // Во время записи и поиска сообщение держится до конца сессии.
  if (isSeriesActive || isSearchActive) {
    return;
  }

  statusTimer = setTimeout(() => {
    statusText.classList.remove("is-visible");
  }, visibleMs);
}

function hideStatus() {
  clearTimeout(statusTimer);
  clearTimeout(srStatusTimer);
  statusText.classList.remove("is-visible");
  statusText.textContent = "";
  srStatus.textContent = "";
}

function announceToScreenReader(message) {
  clearTimeout(srStatusTimer);
  srStatus.textContent = message;

  srStatusTimer = setTimeout(() => {
    srStatus.textContent = "";
  }, SHORT_MESSAGE_VISIBLE_MS);
}

function showNotifyStatus(message) {
  if (!notifyStatus) {
    showStatus(message);
    return;
  }

  clearTimeout(notifyStatusTimer);
  notifyStatus.classList.remove("is-visible");
  notifyStatus.textContent = message;

  requestAnimationFrame(() => {
    notifyStatus.classList.add("is-visible");
  });

  notifyStatusTimer = setTimeout(() => {
    notifyStatus.classList.remove("is-visible");
    notifyStatus.textContent = "";
  }, SHORT_MESSAGE_VISIBLE_MS);
}

function speakError(value, reason = "") {
  const now = Date.now();
  const phrase = normalize(value);
  const message = getErrorMessage(reason);

  if (!reason && now - lastSpecificErrorAt < SPECIFIC_ERROR_COOLDOWN_MS) {
    return;
  }

  if (message === lastErrorMessage && now - lastErrorSpokenAt < ERROR_REPEAT_MESSAGE_COOLDOWN_MS) {
    return;
  }

  if (phrase && phrase === lastErrorPhrase && !reason) {
    return;
  }

  if (!reason && now - lastErrorSpokenAt < ERROR_SPEAK_COOLDOWN_MS) {
    return;
  }

  lastErrorSpokenAt = now;
  lastErrorPhrase = phrase;
  lastErrorMessage = message;

  if (reason) {
    lastSpecificErrorAt = now;
    showStatus(message);
  }

  speak(message);
}

function getErrorMessage(reason) {
  if (reason === "invalid-leap-day") {
    return "нет такой даты в этом году";
  }

  if (reason === "invalid-month-day") {
    return "нет такой даты в этом месяце";
  }

  return "не разобрала, повторите";
}

function speak(message) {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "ru-RU";
  utterance.rate = 0.95;

  try {
    window.speechSynthesis.cancel();
  } catch (error) {
    // Some mobile browsers do not like canceling immediately after recognition.
  }

  setTimeout(() => {
    window.speechSynthesis.speak(utterance);
  }, 120);
}

function playSavedSound() {
  if (!unlockAudio()) {
    return;
  }

  if (audioContext.state === "suspended") {
    return;
  }

  playSavedBeep();
}

function unlockAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return false;
  }

  audioContext = audioContext || new AudioContext();

  if (audioContext.state === "suspended" && audioContext.resume) {
    audioContext.resume();
  }

  return true;
}

function playSavedBeep() {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime + 0.05;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(660, now);
  oscillator.frequency.setValueAtTime(880, now + 0.08);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.018, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.15);
}

function playAlarmSound() {
  if (!unlockAudio()) {
    return;
  }

  [0, 0.45, 0.9, 1.35].forEach((offset) => {
    playAlarmBeep(audioContext.currentTime + 0.05 + offset);
  });
}

function playAlarmBeep(startTime) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(760, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.07, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.32);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.34);
}

function clearPhraseSoon() {
  clearTimeout(phraseTimer);

  // В режиме записи фраза в поле держится до остановки.
  if (isSeriesActive) {
    return;
  }

  phraseTimer = setTimeout(() => {
    clearPhraseInput();
  }, MESSAGE_VISIBLE_MS);
}

function showRecognizedPhrase(phrase) {
  phraseInput.value = phrase;
  phraseInput.classList.add("has-value");
}

function clearPhraseInput() {
  phraseInput.value = "";
  phraseInput.classList.remove("has-value");

  if (document.activeElement === phraseInput) {
    phraseInput.blur();
  }
}

function scheduleItemNotifications(item) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  try {
    getNotificationTimes(item).forEach((notificationTime) => {
      scheduleNotification(item, notificationTime);
    });
  } catch (error) {
    // Ignore invalid stored reminders so the interface keeps working.
  }
}

function scheduleAllNotifications() {
  clearNotificationTimers();
  items.forEach(scheduleItemNotifications);
}

function clearNotificationTimers() {
  notificationTimers.forEach((timerId) => clearTimeout(timerId));
  notificationTimers = [];
}

function removeExpiredItems() {
  const activeItems = items.filter((item) => !isExpiredItem(item));

  if (activeItems.length === items.length) {
    return;
  }

  items = activeItems;
  saveItems();
}

// Раз в 20 секунд убираем просроченные карточки и обновляем список —
// независимо от того, разрешены уведомления или нет.
function startExpiryTicker() {
  if (expiryTickerId) {
    clearInterval(expiryTickerId);
  }

  expiryTickerId = setInterval(() => {
    const before = items.length;
    removeExpiredItems();

    if (items.length !== before) {
      renderList();
      scheduleAllNotifications();
    }
  }, 20000);
}

function isExpiredItem(item) {
  const dueDate = parseItemDateTime(item);
  const now = new Date();

  if (item.time) {
    return dueDate < now;
  }

  return dueDate < startOfToday();
}

function getNotificationTimes(item) {
  const dueDate = parseItemDateTime(item);

  if (isAlarmItem(item)) {
    return [dueDate];
  }

  if (item.time) {
    if (isSoonTimedEvent(dueDate)) {
      return [dueDate];
    }

    return getTimedEventNotificationTimes(dueDate);
  }

  const times = [dueDate];

  reminderRules.forEach((reminder) => {
    const notificationTime = new Date(dueDate);
    notificationTime.setDate(notificationTime.getDate() - reminder.days);
    times.push(notificationTime);
  });

  return times;
}

function getTimedEventNotificationTimes(dueDate) {
  const times = [dueDate];
  const eveningBefore = new Date(dueDate);
  eveningBefore.setDate(eveningBefore.getDate() - 1);
  eveningBefore.setHours(20, 0, 0, 0);
  times.push(eveningBefore);

  const beforeEvent = new Date(dueDate);
  const minutesBefore = dueDate.getHours() < 10 ? 30 : 120;
  beforeEvent.setMinutes(beforeEvent.getMinutes() - minutesBefore);
  times.push(beforeEvent);

  return times;
}

function isSoonTimedEvent(dueDate) {
  return dueDate.getTime() - Date.now() < 24 * 60 * 60 * 1000;
}

function scheduleNotification(item, notificationTime) {
  const delay = notificationTime.getTime() - Date.now();

  if (delay <= 0 || delay > MAX_LOCAL_TIMER_MS) {
    return;
  }

  const timerId = setTimeout(() => {
    showReminderNotification(item);

    // Звук — если включён в настройках.
    if (reminderSettings.sound) {
      playReminderSound();
    }

    // Всплывающее окно — если включено и приложение открыто.
    if (reminderSettings.popup &&
        typeof document !== "undefined" &&
        document.visibilityState === "visible") {
      showInAppReminder(item);
    }

    if (notificationTime.getTime() === parseItemDateTime(item).getTime()) {
      removeExpiredItems();
      renderList();
      scheduleAllNotifications();
    }
  }, delay);

  notificationTimers.push(timerId);
}

async function showReminderNotification(item) {
  const title = "напоминание";
  const options = {
    body: `${formatDisplayName(item.name)}: ${formatItemDate(item)}`,
    icon: "./icons/icon-192.png",
    badge: "./icons/icon-192.png",
    vibrate: [300, 150, 300, 150, 300],
    requireInteraction: true,
    tag: item.id,
    renotify: true,
  };

  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;

      if (registration && registration.showNotification) {
        registration.showNotification(title, options);
        return;
      }
    }

    new Notification(title, options);
  } catch (error) {
    // Some mobile browsers reject notifications even after permission.
  }
}

function isAlarmItem(item) {
  return normalize(item.name).includes("будильник");
}

// Звуковой сигнал напоминания: три коротких бипа подряд.
function playReminderSound() {
  playAlarmSound();
  setTimeout(playAlarmSound, 450);
  setTimeout(playAlarmSound, 900);
}

// Заметное всплывающее окно прямо в приложении, когда оно открыто.
function showInAppReminder(item) {
  const text = `Напоминание: ${formatDisplayName(item.name)}`;
  announceToScreenReader(text);

  try {
    let banner = document.querySelector(".reminder-alert");
    if (!banner) {
      banner = document.createElement("div");
      banner.className = "reminder-alert";
      banner.setAttribute("role", "alert");
      banner.style.cssText =
        "position:fixed;left:50%;top:18px;transform:translateX(-50%);" +
        "z-index:99999;max-width:90%;box-sizing:border-box;background:#167348;" +
        "color:#fff;padding:16px 20px;border-radius:16px;" +
        "box-shadow:0 10px 34px rgba(0,0,0,.35);font-size:18px;line-height:1.3;" +
        "text-align:center;display:flex;flex-direction:column;gap:12px;align-items:center;";
      document.body.appendChild(banner);
    }

    banner.innerHTML = "";
    const message = document.createElement("div");
    message.textContent = text;
    banner.appendChild(message);

    // Окно висит подольше, чтобы успеть прочитать.
    clearTimeout(banner._hideTimer);
    banner._hideTimer = setTimeout(() => {
      if (banner && banner.parentNode) banner.remove();
    }, 2600);
  } catch (error) {
    // если не вышло показать окно — хотя бы строкой статуса
  }

  showStatus(text, 20000);
}

function sortByDate(listItems) {
  return [...listItems].sort(compareReminderOrder);
}

function compareReminderOrder(firstItem, secondItem) {
  const dateDifference = parseItemDateTime(firstItem) - parseItemDateTime(secondItem);

  if (dateDifference !== 0) {
    return dateDifference;
  }

  const nameDifference = normalize(firstItem.name).localeCompare(
    normalize(secondItem.name),
    "ru",
  );

  if (nameDifference !== 0) {
    return nameDifference;
  }

  return getPeriodSortRank(firstItem.period) - getPeriodSortRank(secondItem.period);
}

function getPeriodSortRank(period) {
  const ranks = {
    утром: 1,
    "днём": 2,
    вечером: 3,
    ночью: 4,
  };

  return ranks[period] || 0;
}

function formatDate(value, time) {
  const date = parseIsoDate(value);
  const dateText = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  return time ? `${dateText}, ${time}` : dateText;
}

function formatItemDate(item) {
  const dateText = getItemDateText(item);
  const timeText = getItemTimeText(item);

  return timeText ? `${dateText} ${timeText}` : dateText;
}

function formatDateLabel(value, time) {
  const date = parseIsoDate(value);
  const dateText = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()} года`;
  return time ? `${dateText}, ${time}` : dateText;
}

function formatItemDateLabel(item) {
  const dateText = getItemDateLabelText(item);
  const timeText = getItemTimeText(item);

  return timeText ? `${dateText} ${timeText}` : dateText;
}

function getItemDateText(item) {
  if (item.displayDate) {
    return normalizeDisplayDateText(item.displayDate);
  }

  const date = parseIsoDate(item.date);
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function getItemDateLabelText(item) {
  if (item.displayDate) {
    return normalizeDisplayDateText(item.displayDate);
  }

  const date = parseIsoDate(item.date);
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()} года`;
}

function getItemTimeText(item) {
  if (item.time) {
    return item.time;
  }

  return item.period || "";
}

function normalizeDisplayDateText(value) {
  const phrase = normalize(value);
  const monthMatch = new RegExp(`^в\\s+(${monthWordPattern})(\\s+\\d{4}\\s+года)?$`).exec(phrase);

  if (!monthMatch) {
    return value;
  }

  const month = monthMap[monthMatch[1]];
  const yearText = monthMatch[2] || "";
  return `${monthDisplayNames[month]}${yearText}`;
}

function formatDaysLeft(value) {
  const days = getDaysLeft(value);

  if (days < 0) {
    return "просрочено";
  }

  if (days === 0) {
    return "сегодня";
  }

  if (days >= 30) {
    return formatLongDaysLeft(days);
  }

  return `${days} ${getDayWord(days)}`;
}

function formatDaysLeftLabel(value) {
  const daysText = formatDaysLeft(value);

  if (daysText === "сегодня") {
    return "срок сегодня";
  }

  if (daysText === "просрочено") {
    return "срок просрочен";
  }

  const spokenDaysText = formatDaysLeftSpoken(value);
  return `${getRemainingPrefix(spokenDaysText)} ${spokenDaysText}`;
}

function formatDaysLeftVisible(value) {
  const daysText = formatDaysLeft(value);

  if (daysText === "сегодня") {
    return "сегодня";
  }

  if (daysText === "просрочено") {
    return "просрочено";
  }

  return `${getRemainingPrefix(daysText)} ${daysText}`;
}

function getRemainingPrefix(value) {
  return value.startsWith("1 день") || value.startsWith("один ")
    ? "остался"
    : "осталось";
}

function formatDaysLeftSpoken(value) {
  const days = getDaysLeft(value);

  if (days >= 30) {
    return formatLongDaysLeftSpoken(days);
  }

  return `${getNumberWord(days)} ${getDayWord(days)}`;
}

function formatLongDaysLeft(days) {
  const years = Math.floor(days / 365);
  const daysAfterYears = days % 365;
  const months = Math.floor(daysAfterYears / 30);
  const restDays = daysAfterYears % 30;
  const parts = [];

  if (years) {
    parts.push(`${years} ${getYearWord(years)}`);
  }

  if (months) {
    parts.push(`${months} ${getMonthWord(months)}`);
  }

  if (restDays) {
    parts.push(`${restDays} ${getDayWord(restDays)}`);
  }

  return parts.join(" ");
}

function formatLongDaysLeftSpoken(days) {
  const years = Math.floor(days / 365);
  const daysAfterYears = days % 365;
  const months = Math.floor(daysAfterYears / 30);
  const restDays = daysAfterYears % 30;
  const parts = [];

  if (years) {
    parts.push(`${getNumberWord(years)} ${getYearWord(years)}`);
  }

  if (months) {
    parts.push(`${getNumberWord(months)} ${getMonthWord(months)}`);
  }

  if (restDays) {
    parts.push(`${getNumberWord(restDays)} ${getDayWord(restDays)}`);
  }

  return parts.join(" ");
}

function getNumberWord(value) {
  const numberWords = {
    0: "ноль",
    1: "один",
    2: "два",
    3: "три",
    4: "четыре",
    5: "пять",
    6: "шесть",
    7: "семь",
    8: "восемь",
    9: "девять",
    10: "десять",
    11: "одиннадцать",
    12: "двенадцать",
    13: "тринадцать",
    14: "четырнадцать",
    15: "пятнадцать",
    16: "шестнадцать",
    17: "семнадцать",
    18: "восемнадцать",
    19: "девятнадцать",
    20: "двадцать",
    21: "двадцать один",
    22: "двадцать два",
    23: "двадцать три",
    24: "двадцать четыре",
    25: "двадцать пять",
    26: "двадцать шесть",
    27: "двадцать семь",
    28: "двадцать восемь",
    29: "двадцать девять",
    30: "тридцать",
    31: "тридцать один",
  };

  return numberWords[value] || String(value);
}

function getDayWord(value) {
  const lastTwoDigits = value % 100;
  const lastDigit = value % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "дней";
  }

  if (lastDigit === 1) {
    return "день";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "дня";
  }

  return "дней";
}

function getYearWord(value) {
  const lastTwoDigits = value % 100;
  const lastDigit = value % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "лет";
  }

  if (lastDigit === 1) {
    return "год";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "года";
  }

  return "лет";
}

function getMonthWord(value) {
  const lastTwoDigits = value % 100;
  const lastDigit = value % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "месяцев";
  }

  if (lastDigit === 1) {
    return "месяц";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "месяца";
  }

  return "месяцев";
}

function getReminderPlan(value) {
  const daysLeft = getDaysLeft(value);
  return reminderRules
    .filter((reminder) => daysLeft >= reminder.days)
    .map((reminder) => reminder.label);
}

function formatReminderMessage(item) {
  if (isAlarmItem(item)) {
    return "будильник прозвонит в указанное время.";
  }

  if (item.time) {
    if (isSoonTimedEvent(parseItemDateTime(item))) {
      return "напомню в указанное время.";
    }

    return "напомню накануне вечером, заранее и в указанное время.";
  }

  const reminders = getReminderPlan(item.date);

  if (!reminders.length) {
    return getDaysLeft(item.date) === 0
      ? "напомню сегодня."
      : "срок уже прошел.";
  }

  return `напомню ${formatList(reminders)}.`;
}

function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }

  if (values.length === 2) {
    return `${values[0]} и ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")} и ${values[values.length - 1]}`;
}

function getDaysLeft(value) {
  return Math.round((parseIsoDate(value) - startOfToday()) / 86400000);
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function lastDayOfMonth(month, year) {
  return new Date(Number(year), month + 1, 0).getDate();
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createId() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseIsoDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function parseItemDateTime(item) {
  const date = parseIsoDate(item.date);

  if (item.time) {
    const [hour, minute] = item.time.split(":").map(Number);
    date.setHours(hour, minute, 0, 0);
  }

  return date;
}

function loadItems() {
  let storedItems = [];

  try {
    storedItems = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    storedItems = [];
  }

  const itemsWithIds = storedItems
    .filter(isValidStoredItem)
    .map((item) => {
      const migratedItem = migrateStoredItem(item);

      return {
        ...migratedItem,
        id: item.id || migratedItem.id || createId(),
      };
    });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsWithIds));
  return itemsWithIds;
}

function isValidStoredItem(item) {
  return Boolean(
    item &&
    typeof item === "object" &&
    typeof item.name === "string" &&
    typeof item.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(item.date),
  );
}

function migrateStoredItem(item) {
  if (!item.source || !normalize(item.source).includes("следующ")) {
    return item;
  }

  const reparsedItem = parsePhrase(item.source);

  if (!reparsedItem) {
    return item;
  }

  return {
    ...item,
    name: reparsedItem.name,
    date: reparsedItem.date,
    time: reparsedItem.time,
  };
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.warn("Service worker registration failed", error);
    });
  });
}
