let startButton = null;
let phraseInput = null;
let statusText = null;
let srStatus = null;
let notifyButton = null;
let notifyStatus = null;
let examplesButton = null;
let examplesPanel = null;
let clearButton = null;
let searchButton = null;
let searchModal = null;
let searchResults = null;
let searchCloseButton = null;
let list = null;

const STORAGE_KEY = "expiry-reminders";
const MESSAGE_VISIBLE_MS = 4000;
const SHORT_MESSAGE_VISIBLE_MS = 2200;
const SINGLE_CLICK_DELAY_MS = 420;
const LONG_PRESS_DELAY_MS = 800;
const ERROR_SPEAK_COOLDOWN_MS = 2500;
const ERROR_REPEAT_MESSAGE_COOLDOWN_MS = 4500;
const SPECIFIC_ERROR_COOLDOWN_MS = 5000;
const MAX_LOCAL_TIMER_MS = 2147483647;
const stopPhrases = ["готово"];
const reminderRules = [
  { days: 30, label: "за месяц" },
  { days: 7, label: "за неделю" },
  { days: 1, label: "за день" },
];
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

let items = [];
let recognition = null;
let statusTimer = null;
let srStatusTimer = null;
let notifyStatusTimer = null;
let phraseTimer = null;
let restartTimer = null;
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
let notificationTimers = [];
let isSeriesActive = false;
let lastErrorSpokenAt = 0;
let lastErrorPhrase = "";
let lastErrorMessage = "";
let lastSpecificErrorAt = 0;
let audioContext = null;
let lastParseError = "";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

function initApp() {
  try {
    assignElements();
    items = loadItems();
    removeExpiredItems();
    if (list) {
      renderList();
    }
    setupSpeech();
    scheduleAllNotifications();

    if (startButton) {
      startButton.addEventListener("click", handleStartClick);
      startButton.addEventListener("pointerdown", handleStartPress);
      startButton.addEventListener("pointerup", clearStartPress);
      startButton.addEventListener("pointerleave", clearStartPress);
      startButton.addEventListener("pointercancel", clearStartPress);
    }

    if (notifyButton) {
      notifyButton.addEventListener("click", requestNotificationPermission);
    }

    if (examplesButton) {
      examplesButton.addEventListener("click", toggleExamples);
    }

    if (clearButton) {
      clearButton.addEventListener("click", () => {
        items = [];
        saveItems();
        renderList();
        showStatus("список очищен", SHORT_MESSAGE_VISIBLE_MS);
      });
    }

    if (searchButton) {
      searchButton.addEventListener("click", startSearchListening);
    }

    if (searchCloseButton) {
      searchCloseButton.addEventListener("click", closeSearchDialog);
    }

    if (searchModal) {
      searchModal.addEventListener("click", (event) => {
        if (event.target === searchModal) {
          closeSearchDialog();
        }
      });
    }

    document.addEventListener("keydown", handleDocumentKeydown);
  } catch (error) {
    console.error("App init failed", error);
  }
}

function assignElements() {
  startButton = document.querySelector(".start-button");
  phraseInput = document.querySelector(".phrase-input");
  statusText = document.querySelector(".status");
  srStatus = document.querySelector(".sr-status");
  notifyButton = document.querySelector(".notify-button");
  notifyStatus = document.querySelector(".notify-status");
  examplesButton = document.querySelector(".examples-button");
  examplesPanel = document.querySelector(".examples-panel");
  clearButton = document.querySelector(".clear-button");
  searchButton = document.querySelector(".search-button");
  searchModal = document.querySelector(".search-modal");
  searchResults = document.querySelector(".search-results");
  searchCloseButton = document.querySelector(".search-close-button");
  list = document.querySelector(".list");
}

function handleStartClick(event) {
  unlockAudio();
  clearTimeout(startClickTimer);

  if (isLongPress) {
    isLongPress = false;
    return;
  }

  startClickTimer = setTimeout(startSingleListening, SINGLE_CLICK_DELAY_MS);
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
    showStatus("скажи или напиши одной фразой: страховка до 15 июля");
    return;
  }

  cancelEditing();
  cancelSearch();
  isSeriesActive = false;
  startButton.classList.add("is-listening");
  showStatus("слушаю.");
  lastErrorPhrase = "";
  restartRecognition();
}

function startSearchListening() {
  unlockAudio();

  if (!recognition) {
    showStatus("голос может быть недоступен в этом браузере");
    return;
  }

  cancelEditing();
  isSearchActive = true;
  isSeriesActive = false;
  startButton.classList.add("is-listening");
  showStatus("назови напоминание");
  lastErrorPhrase = "";
  restartRecognition();
}

function toggleExamples() {
  if (!examplesPanel || !examplesButton) {
    return;
  }

  const isOpen = !examplesPanel.hidden;
  examplesPanel.hidden = isOpen;
  examplesButton.setAttribute("aria-expanded", String(!isOpen));
}

function handleDocumentKeydown(event) {
  if (event.key === "Escape" && searchModal && !searchModal.hidden) {
    closeSearchDialog();
    return;
  }

  if (event.key === "Tab" && searchModal && !searchModal.hidden) {
    keepFocusInsideSearchDialog(event);
  }
}

function handleSearchPhrase(value) {
  const query = normalizeSearchText(value);

  if (!query) {
    showStatus("не нашла такое напоминание");
    return false;
  }

  const matches = findItemsByName(query);
  cancelSearch();

  if (!matches.length) {
    showStatus("не нашла такое напоминание");
    clearPhraseSoon();
    return true;
  }

  showSearchDialog(matches, value);
  clearPhraseSoon();
  return true;
}

function findItemsByName(query) {
  return sortByDate(items).filter((item) => (
    isSearchMatch(normalizeSearchText(item.name), query)
  ));
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
  searchCloseButton.focus();
  showStatus(`найдено: ${matches.length}`);
  announceToScreenReader(`найдено по запросу ${query}: ${matches.length}`);
}

function createSearchResult(item) {
  const result = document.createElement("article");
  const content = document.createElement("div");
  const name = document.createElement("h3");
  const date = document.createElement("p");
  const days = document.createElement("p");
  const actions = document.createElement("div");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  const closeButton = document.createElement("button");

  result.className = "search-result";
  content.className = "search-result-content";
  name.className = "search-result-name";
  date.className = "search-result-date";
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

  name.textContent = formatDisplayName(item.name);
  date.textContent = formatDate(item.date, item.time);
  days.textContent = formatDaysLeftVisible(item.date);
  editButton.textContent = "изменить";
  deleteButton.textContent = "удалить";
  closeButton.textContent = "закрыть";

  editButton.addEventListener("click", () => {
    startEditingItem(item.id);
  });

  deleteButton.addEventListener("click", () => {
    deleteItem(item.id);
    refreshSearchDialog();
  });

  closeButton.addEventListener("click", () => {
    removeSearchResult(item.id);
  });

  content.append(name, date, days);
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

  if (searchResults) {
    searchResults.innerHTML = "";
  }

  currentSearchItemIds = [];
  currentSearchQuery = "";

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

  const matches = sortByDate(items.filter((item) => (
    currentSearchItemIds.includes(item.id)
  )));
  searchResults.innerHTML = "";

  if (!matches.length) {
    closeSearchDialog();
    return;
  }

  currentSearchItemIds = matches.map((item) => item.id);
  matches.forEach((item) => {
    searchResults.append(createSearchResult(item));
  });
  announceToScreenReader(`обновлено: ${matches.length}`);
}

function keepFocusInsideSearchDialog(event) {
  const focusable = getSearchDialogFocusableElements();

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

function getSearchDialogFocusableElements() {
  if (!searchModal || searchModal.hidden) {
    return [];
  }

  return Array.from(searchModal.querySelectorAll("button"));
}

function handlePhrase(value, options = {}) {
  if (isStopPhrase(value)) {
    clearPhraseInput();
    stopSeriesListening();
    hideStatus();
    return "stopped";
  }

  const parsed = parsePhrase(value);

  if (!parsed || parsed.name === "предмет") {
    if (options.fromSpeech) {
      hideStatus();
      speakError(value, lastParseError);
    } else {
      showStatus("не получилось разобрать срок. пример: молоко до 5 июня");
      clearPhraseSoon();
    }
    return false;
  }

  if (hasDuplicateItem(parsed)) {
    playSavedSound();
    showStatus(isSeriesActive ? "такая запись уже есть. можно сказать еще." : "такая запись уже есть.");
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
      ? `сохранено. ${formatReminderMessage(parsed)} можно сказать еще.`
      : `сохранено. ${formatReminderMessage(parsed)}`,
  );
  clearPhraseSoon();
  scheduleItemNotifications(parsed);
  return true;
}

function handleEditPhrase(value) {
  if (isStopPhrase(value)) {
    finishEditing();
    hideStatus();
    return "stopped";
  }

  const item = items.find((currentItem) => currentItem.id === editingItemId);

  if (!item) {
    finishEditing();
    return false;
  }

  const phrase = normalize(value);

  if (/^(удали|удалить|убери|убрать)(\s|$)/.test(phrase)) {
    deleteItem(item.id);
    finishEditing();
    showStatus("удалено", SHORT_MESSAGE_VISIBLE_MS);
    clearPhraseSoon();
    return "silent";
  }

  const renamedItem = getRenamedItem(item, phrase);

  if (renamedItem) {
    updateItem(renamedItem);
    finishEditing();
    refreshSearchDialog();
    playSavedSound();
    showStatus("изменено.");
    clearPhraseSoon();
    return true;
  }

  const correction = getCorrectedItem(item, value);

  if (!correction) {
    hideStatus();
    speakError(value, lastParseError);
    return false;
  }

  updateItem(correction);
  finishEditing();
  refreshSearchDialog();
  playSavedSound();
  showStatus(`изменено. ${formatReminderMessage(correction)}`);
  clearPhraseSoon();
  return true;
}

function getRenamedItem(item, phrase) {
  const match = phrase.match(/(?:^|\s)(?:измени|изменить)\s+название\s+на\s+(.+)$/);

  if (!match) {
    return null;
  }

  return {
    ...item,
    name: getParsedName(match[1]),
    source: match[1],
  };
}

function getCorrectedItem(item, value) {
  const isCommand = isCorrectionCommand(value);
  const cleanedValue = getCorrectionTarget(value);

  if (!isCommand || !cleanedValue) {
    return null;
  }

  const parsedDate = parsePhrase(`${item.name} ${getCorrectionDateTarget(cleanedValue)}`);

  if (parsedDate && parsedDate.name !== "предмет") {
    return {
      ...item,
      date: parsedDate.date,
      time: parsedDate.time || parseCorrectionTime(cleanedValue) || item.time,
      source: value.trim(),
    };
  }

  const time = parseCorrectionTime(cleanedValue);

  if (time) {
    return {
      ...item,
      time,
      source: value.trim(),
    };
  }

  return {
    ...item,
    name: getParsedName(cleanedValue),
    source: value.trim(),
  };
}

function isCorrectionCommand(value) {
  return /^(измени|изменить)(\s|$)/.test(normalize(value));
}

function getCorrectionTarget(value) {
  return normalize(value)
    .replace(/^(измени|изменить)\s+/, "")
    .replace(/^название\s+на\s+/, "")
    .replace(/^дату\s+на\s+/, "")
    .replace(/^срок\s+на\s+/, "")
    .replace(/^время\s+на\s+/, "")
    .replace(/^на\s+/, "")
    .trim();
}

function getCorrectionDateTarget(value) {
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
  const prefixedTime = parseTime(`на ${phrase}`);

  if (prefixedTime && !/\d{1,2}\s+(январь|январе|января|феврале|февраль|февраля|март|марте|марта|апрель|апреле|апреля|май|мае|мая|июнь|июне|июня|июль|июле|июля|август|августе|августа|сентябрь|сентябре|сентября|октябрь|октябре|октября|ноябрь|ноябре|ноября|декабрь|декабре|декабря)/.test(phrase)) {
    return prefixedTime;
  }

  const match = phrase.match(/(?:^|\s)(\d{1,2})(?::(\d{2})|\s*(?:часа?|часов)(?:\s*(?:и\s*)?(\d{1,2})\s*(?:минут|минуты|минута))?)?\s*(утра|вечера|дня|ночи)?$/);

  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2] || match[3] || 0);
  const dayPart = match[4];

  if (dayPart === "вечера" || dayPart === "дня") {
    if (hour < 12) {
      hour += 12;
    }
  } else if (!dayPart && hour >= 1 && hour <= 11) {
    hour += 12;
  }

  if (dayPart === "ночи" && hour === 12) {
    hour = 0;
  }

  if (hour > 23 || minute > 59) {
    return null;
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function updateItem(updatedItem) {
  items = sortByDate(items.map((item) => (
    item.id === updatedItem.id ? updatedItem : item
  )));
  saveItems();
  renderList();
  scheduleAllNotifications();
}

function finishEditing() {
  editingItemId = null;
  stopSeriesListening();
  renderList();
}

function cancelEditing() {
  if (!editingItemId) {
    return;
  }

  editingItemId = null;
  renderList();
}

function cancelSearch() {
  isSearchActive = false;

  if (searchButton) {
    searchButton.classList.remove("is-listening");
  }

  if (startButton) {
    startButton.classList.remove("is-listening");
  }
}

function startEditingItem(id) {
  if (!recognition) {
    showStatus("голос может быть недоступен в этом браузере");
    return;
  }

  cancelSearch();
  editingItemId = id;
  isSeriesActive = false;
  clearEditButtonFocus(id);
  startButton.classList.add("is-listening");
  showStatus("скажи команду изменения");
  restartRecognition();
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
    (item.time || "") === (newItem.time || "")
  ));
}

function isStopPhrase(value) {
  const phrase = normalize(value).replace(/[.,!?]+/g, "");

  return stopPhrases.some((stopPhrase) => (
    phrase === stopPhrase ||
    phrase.startsWith(`${stopPhrase} `) ||
    phrase.endsWith(` ${stopPhrase}`)
  ));
}

function startSeriesListening() {
  if (!recognition) {
    showStatus("скажи или напиши одной фразой: страховка до 15 июля");
    return;
  }

  cancelEditing();
  cancelSearch();
  isSeriesActive = true;
  startButton.classList.add("is-listening");
  showStatus("слушаю. можно сказать несколько фраз.");
  lastErrorPhrase = "";
  restartRecognition();
}

function stopSeriesListening() {
  isSeriesActive = false;
  clearTimeout(restartTimer);
  startButton.classList.remove("is-listening");

  try {
    recognition.stop();
  } catch (error) {
    // Recognition may already be stopped by the browser.
  }
}

function startRecognition() {
  try {
    recognition.start();
    isRecognitionRunning = true;
  } catch (error) {
    isRecognitionRunning = false;
    startButton.classList.remove("is-listening");
    showStatus("голос не запустился. обнови страницу и нажми старт еще раз.");
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

  restartTimer = setTimeout(startRecognition, 180);
}

function parsePhrase(value) {
  lastParseError = "";
  const phrase = normalize(value);

  if (!phrase) {
    return null;
  }

  const time = parseTime(phrase);
  const relative = parseRelativeDate(phrase);
  const yearOnly = parseYearOnlyDate(phrase);
  if (yearOnly) {
    return {
      id: createId(),
      name: getParsedName(phrase.slice(0, yearOnly.index)),
      date: toIsoDate(yearOnly.date),
      time: null,
      source: value.trim(),
    };
  }

  const parsedTime = time || getTimeFromRelative(relative);
  const approximate = parseApproximateDate(phrase);
  if (approximate) {
    return {
      id: createId(),
      name: getParsedName(phrase.slice(0, approximate.index)),
      date: toIsoDate(approximate.date),
      time: parsedTime,
      source: value.trim(),
    };
  }

  const weekday = parseWeekdayDate(phrase);
  if (weekday) {
    return {
      id: createId(),
      name: getParsedName(phrase.slice(0, weekday.index)),
      date: toIsoDate(weekday.date),
      time: parsedTime,
      source: value.trim(),
    };
  }

  const exact = parseExactDate(phrase, relative);
  if (exact) {
    const name = getParsedName(phrase.slice(0, exact.index));

    return {
      id: createId(),
      name,
      date: toIsoDate(exact.date),
      time: parsedTime,
      source: value.trim(),
    };
  }

  const named = parseNamedDate(phrase);
  if (named) {
    const name = getParsedName(phrase.slice(0, named.index));

    return {
      id: createId(),
      name,
      date: toIsoDate(named.date),
      time: parsedTime,
      source: value.trim(),
    };
  }

  if (relative) {
    const name = getParsedName(phrase.slice(0, relative.index));

    return {
      id: createId(),
      name,
      date: toIsoDate(relative.date),
      time: parsedTime,
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

  return { date: new Date(year, 0, 1), index: match.index };
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
  const match = phrase.match(/(?:^|\s)(?:до\s+)?(сегодня|завтра|послезавтра)/);

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

  return { date: new Date(new Date().getFullYear() + 1, 0, 1), index: match.index };
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

  let date = new Date(now.getFullYear() + (match[2] ? 1 : 0), month, day);

  if (!match[2] && date < startOfToday()) {
    date = new Date(now.getFullYear() + 1, month, day);
  }

  return { date, index: match.index };
}

function parseNextMonthDate(phrase) {
  const match = phrase.match(/(?:^|\s)в\s+следующ(?:ем|ий)\s+месяц(?:е)?/);

  if (!match) {
    return null;
  }

  const now = new Date();
  return { date: new Date(now.getFullYear(), now.getMonth() + 1, 1), index: match.index };
}

function parseMonthPartDate(phrase) {
  const monthWords = Object.keys(monthMap).join("|");
  const regex = new RegExp(
    `(?:^|\\s)в\\s+(?:(начале|середине|конце)\\s+)?(${monthWords})`,
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

  if (!getPhraseYearHint(phrase) && date < startOfToday()) {
    year += 1;
    date = new Date(year, month, getApproximateMonthDay(match[1], month, year));
  }

  return { date, index: match.index };
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

function parseTime(phrase) {
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
    /(?:^|\s)(?:в|на)\s+(\d{1,2})(?::(\d{2})|\s*(?:часа?|часов)(?:\s*(?:и\s*)?(\d{1,2})\s*(?:минут|минуты|минута))?)?\s*(утра|вечера|дня|ночи)?/,
  );

  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2] || match[3] || 0);
  const dayPart = match[4];

  if (dayPart === "вечера" || dayPart === "дня") {
    if (hour < 12) {
      hour += 12;
    }
  } else if (!dayPart && hour >= 1 && hour <= 11) {
    hour += 12;
  }

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

  if (dayPart === "вечера" || dayPart === "дня") {
    if (hour < 12) {
      hour += 12;
    }
  } else if (!dayPart && hour >= 1 && hour <= 11) {
    hour += 12;
  }

  if (dayPart === "ночи" && hour === 12) {
    hour = 0;
  }

  return `${String(hour).padStart(2, "0")}:00`;
}

function parseExactDate(phrase, relative) {
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

  if (!match[4] && !getRelativeYear(relative) && date < startOfToday()) {
    year += 1;
    date = new Date(year, month, day);
  }

  if (!isValidMonthDay(day, month, year)) {
    setInvalidDateError(day, month);
    return null;
  }

  return { date, index: match.index };
}

function parseSpokenExactDate(phrase, relative) {
  const dayWords = Object.keys(dayWordMap).sort((a, b) => b.length - a.length).join("|");
  const monthWords = Object.keys(monthMap).join("|");
  const regex = new RegExp(
    `(?:^|\\s)(до\\s+)?(${dayWords})\\s+(${monthWords})(?:\\s+((?:\\d{4})|(?:следующего|следующий)\\s+года?))?`,
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

  if (!match[4] && !getRelativeYear(relative) && date < startOfToday()) {
    year += 1;
    date = new Date(year, month, day);
  }

  if (!isValidMonthDay(day, month, year)) {
    setInvalidDateError(day, month);
    return null;
  }

  return { date, index: match.index };
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
      .replace(/через\s+(полгода|пол\s+года|полгоду)/g, "")
      .replace(/через\s+(минуту|час|день|неделю|месяц|год|(\d+)\s*(минуту|минуты|минут|час|часа|часов|день|дня|дней|неделю|недели|недель|месяц|месяца|месяцев|год|года|лет))/g, "")
      .replace(/\bв\s+следующ(?:ем|ий)\s+год(?:у)?/g, "")
      .replace(/\bв\s+(начале|середине|конце)\s+(следующего\s+)?года/g, "")
      .replace(/\bв\s+следующ(?:ем|ий)\s+месяц(?:е)?/g, "")
      .replace(/\bв\s+(?:(начале|середине|конце)\s+)?(январь|январе|января|феврале|февраль|февраля|март|марте|марта|апрель|апреле|апреля|май|мае|мая|июнь|июне|июня|июль|июле|июля|август|августе|августа|сентябрь|сентябре|сентября|октябрь|октябре|октября|ноябрь|ноябре|ноября|декабрь|декабре|декабря)/g, "")
      .replace(/\b(?:в|на)\s+(один|одна|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять|одиннадцать|двенадцать|тринадцать|четырнадцать|пятнадцать|шестнадцать|семнадцать|восемнадцать|девятнадцать|двадцать|двадцать один|двадцать два|двадцать три)(?:\s+час(?:а|ов)?)?\s*(утра|вечера|дня|ночи)?/g, "")
      .replace(/\b(?:в|на)\s+час\s*(утра|вечера|дня|ночи)?/g, "")
      .replace(/\b(?:в|на)\s+\d{1,2}(?::\d{2}|\s*(?:часа?|часов)(?:\s*(?:и\s*)?\d{1,2}\s*(?:минут|минуты|минута))?)?\s*(утра|вечера|дня|ночи)?/g, "")
      .replace(/(?:в\s+)?(?:следующий|следующая|следующее|следующей)?\s*(понедельник|понедельника|вторник|вторника|среду|среда|среды|четверг|четверга|пятницу|пятница|пятницы|субботу|суббота|субботы|воскресенье|воскресенья)/g, "")
      .replace(/[.,!?]+/g, "")
      .trim()
      || "предмет"
  );
}

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function formatDisplayName(value) {
  return value.toLocaleLowerCase("ru-RU");
}

function renderList() {
  list.innerHTML = "";
  list.setAttribute("role", "group");
  list.setAttribute("aria-labelledby", "reminders-list-title");

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "пока ничего нет";
    list.append(empty);
    return;
  }

  sortByDate(items).forEach((item) => {
    const element = document.createElement("li");
    element.className = "item";
    element.setAttribute("role", "none");

    const content = document.createElement("div");
    const actions = document.createElement("div");
    const name = document.createElement("p");
    const date = document.createElement("p");
    const visibleDate = document.createElement("span");
    const screenReaderDate = document.createElement("span");
    const days = document.createElement("div");
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
    screenReaderDate.className = "visually-hidden";
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

    name.textContent = formatDisplayName(item.name);
    visibleDate.textContent = formatDate(item.date, item.time);
    visibleDate.setAttribute("aria-hidden", "true");
    screenReaderDate.textContent = formatDateLabel(item.date, item.time);
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
      deleteItem(item.id);
    });

    days.append(visibleDays, screenReaderDays);
    date.append(visibleDate, screenReaderDate);
    editButton.append(visibleEditText, screenReaderEditText);
    deleteButton.append(visibleDeleteText, screenReaderDeleteText);
    content.append(name, date);
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

function deleteItem(id) {
  items = items.filter((item) => item.id !== id);
  saveItems();
  renderList();
  scheduleAllNotifications();
  showStatus("удалено", SHORT_MESSAGE_VISIBLE_MS);
}

function setupSpeech() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    showStatus(
      "голос может быть недоступен в этом браузере, фразу можно написать",
    );
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "ru-RU";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.addEventListener("result", (event) => {
    const phrase = event.results[0][0].transcript;

    if (isStopPhrase(phrase)) {
      if (isSearchActive) {
        cancelSearch();
        hideStatus();
      } else if (editingItemId) {
        handleEditPhrase(phrase);
      } else {
        handlePhrase(phrase, { fromSpeech: true });
      }
      return;
    }

    const result = isSearchActive
      ? handleSearchPhrase(phrase)
      : editingItemId
        ? handleEditPhrase(phrase)
        : handlePhrase(phrase, { fromSpeech: true });

    if (result !== false && result !== "silent") {
      showRecognizedPhrase(phrase);
      announceToScreenReader(`распознано: ${phrase}`);
    }

    if (!isSeriesActive && result !== false) {
      stopSeriesListening();
    }
  });

  recognition.addEventListener("end", () => {
    isRecognitionRunning = false;

    if (shouldSkipNextRestart) {
      shouldSkipNextRestart = false;
      return;
    }

    if (!isSeriesActive) {
      startButton.classList.remove("is-listening");
      if (searchButton) {
        searchButton.classList.remove("is-listening");
      }
      return;
    }

    clearTimeout(restartTimer);
    restartTimer = setTimeout(startRecognition, 250);
  });

  recognition.addEventListener("error", (event) => {
    isRecognitionRunning = false;

    if (isSeriesActive && event.error === "no-speech") {
      return;
    }

    if (!isSeriesActive) {
      startButton.classList.remove("is-listening");
      if (searchButton) {
        searchButton.classList.remove("is-listening");
      }
    }

    showStatus(getRecognitionErrorMessage());
  });
}

function getRecognitionErrorMessage() {
  if (editingItemId) {
    return "голос не сработал. нажми изменить еще раз";
  }

  if (isSearchActive) {
    return "голос не сработал. нажми поиск еще раз";
  }

  return "голос не сработал. нажми старт еще раз";
}

async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    showNotifyStatus("этот браузер не поддерживает уведомления");
    return;
  }

  const permission = await Notification.requestPermission();
  showNotifyStatus(
    permission === "granted"
      ? "уведомления включены"
      : "уведомления не включены",
  );
}

function showStatus(message, visibleMs = MESSAGE_VISIBLE_MS) {
  clearTimeout(statusTimer);
  statusText.classList.remove("is-visible");
  statusText.textContent = message;
  announceToScreenReader(message);

  requestAnimationFrame(() => {
    statusText.classList.add("is-visible");
  });

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
  const now = audioContext.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(660, now);
  oscillator.frequency.setValueAtTime(880, now + 0.08);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.2);
}

function playAlarmSound() {
  if (!unlockAudio()) {
    return;
  }

  [0, 0.45, 0.9, 1.35].forEach((offset) => {
    playAlarmBeep(audioContext.currentTime + offset);
  });
}

function playAlarmBeep(startTime) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(760, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.32);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.34);
}

function clearPhraseSoon() {
  clearTimeout(phraseTimer);

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
    new Notification("напоминание", {
      body: `${formatDisplayName(item.name)}: ${formatDate(item.date, item.time)}`,
    });

    if (isAlarmItem(item)) {
      playAlarmSound();
    }

    if (notificationTime.getTime() === parseItemDateTime(item).getTime()) {
      removeExpiredItems();
      renderList();
      scheduleAllNotifications();
    }
  }, delay);

  notificationTimers.push(timerId);
}

function isAlarmItem(item) {
  return normalize(item.name).includes("будильник");
}

function sortByDate(listItems) {
  return [...listItems].sort(
    (a, b) => parseItemDateTime(a) - parseItemDateTime(b),
  );
}

function formatDate(value, time) {
  const date = parseIsoDate(value);
  const dateText = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  return time ? `${dateText}, ${time}` : dateText;
}

function formatDateLabel(value, time) {
  const date = parseIsoDate(value);
  const dateText = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()} года`;
  return time ? `${dateText}, ${time}` : dateText;
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
