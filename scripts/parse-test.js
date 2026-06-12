// Тестовый стенд для парсера фраз. Загружает script.js в песочнице
// (без браузера) и прогоняет список фраз через parsePhrase.
// Запуск: node scripts/parse-test.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const code = fs.readFileSync(path.resolve(__dirname, "..", "script.js"), "utf8");

const sandbox = {};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.console = console;
sandbox.Date = Date;
sandbox.Math = Math;
sandbox.Intl = Intl;
sandbox.JSON = JSON;
sandbox.RegExp = RegExp;
sandbox.Object = Object;
sandbox.Array = Array;
sandbox.Number = Number;
sandbox.String = String;
sandbox.Boolean = Boolean;
sandbox.parseInt = parseInt;
sandbox.parseFloat = parseFloat;
sandbox.isNaN = isNaN;
sandbox.setTimeout = () => 0;
sandbox.clearTimeout = () => {};
sandbox.setInterval = () => 0;
sandbox.clearInterval = () => {};
sandbox.requestAnimationFrame = () => 0;
sandbox.crypto = require("crypto").webcrypto;
sandbox.URLSearchParams = URLSearchParams;
sandbox.URL = URL;
sandbox.AbortController = AbortController;
sandbox.fetch = () => Promise.reject(new Error("no network in test"));
sandbox.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
sandbox.navigator = { userAgent: "node", language: "ru", platform: "", maxTouchPoints: 0 };
sandbox.location = { search: "", origin: "http://localhost" };
const fakeEl = () => ({
  style: {}, classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
  addEventListener() {}, appendChild() {}, setAttribute() {}, querySelector() { return null; },
  querySelectorAll() { return []; }, focus() {}, textContent: "", hidden: false,
});
sandbox.document = {
  readyState: "loading", // чтобы initApp не запускался
  addEventListener() {},
  querySelector() { return null; },
  querySelectorAll() { return []; },
  getElementById() { return null; },
  createElement() { return fakeEl(); },
  body: fakeEl(),
};

vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: "script.js" });

const parsePhrase = sandbox.parsePhrase;

function show(phrase) {
  let r;
  try {
    r = parsePhrase(phrase, { fromSpeech: true });
  } catch (e) {
    return `❌ ОШИБКА: ${e.message}`;
  }
  if (!r || r.name === "предмет") {
    return "❌ НЕ ПОНЯЛ";
  }
  const when = `${r.date}${r.time ? " " + r.time : ""}${r.period ? " (" + r.period + ")" : ""}`;
  return `✅ имя="${r.name}" · ${when}`;
}

const phrases = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
    // --- уже должно работать (контроль на регрессии) ---
    "молоко завтра",
    "стрижка 1 марта в 5 часов",
    "таблетка через 30 минут",
    "хлеб через неделю",
    "молоко до завтра",
    "встреча в пятницу",
    "оплата до 15 марта",
    "паспорт до марта следующего года",
    "позвонить врачу в субботу",
    // --- пункт 1: «когда» в начале ---
    "завтра молоко",
    "завтра позвонить маме",
    "в пятницу забрать посылку",
    "послезавтра встреча",
    "через неделю оплатить счёт",
    // --- пункт 2: время без дня ---
    "позвонить в 5 часов",
    "таблетка в 8 вечера",
    "совещание в 14:30",
    // --- пункт 3: разговорное время и числа словами ---
    "встреча в полвосьмого",
    "позвонить без пятнадцати пять",
    "таблетка через пятнадцать минут",
    "позвонить через пару дней",
    "разминка в половине девятого",
    "будильник в 7 утра",
    "обед в полдень",
    "забрать торт в половине второго",
    // --- проверка на ЛОЖНЫЕ срабатывания (не должно стать напоминанием с временем) ---
    "купить хлеб на два дня",
    "взять отпуск на неделю",
    "сок без сахара",
    "купить 5 яблок",
    "позвонить mame",
    "купить торт на семь человек",
    "забронировать на пять дней",
    // --- предлог «на» с явным временем — это ДОЛЖНО работать ---
    "запланировать на восемь вечера",
    "созвон в два дня",
  ];

for (const p of phrases) {
  console.log(`${show(p).padEnd(48)}  «${p}»`);
}

// --- Режим изменения (getCorrectedItem) ---
console.log("\n--- изменение существующего напоминания (было: встреча, 20 июня, 14:00) ---");
const baseItem = { id: "x", name: "встреча", date: "2026-06-20", time: "14:00", period: "", source: "" };

function showEdit(phrase) {
  let r;
  try {
    r = sandbox.getCorrectedItem(baseItem, phrase);
  } catch (e) {
    return `❌ ОШИБКА: ${e.message}`;
  }
  if (!r) {
    return "❌ НЕ ПОНЯЛ";
  }
  const when = `${r.date}${r.time ? " " + r.time : ""}${r.period ? " (" + r.period + ")" : ""}`;
  return `✅ имя="${r.name}" · ${when}`;
}

const editPhrases = [
  "измени на 5 минут",
  "изменить время на 5 минут",
  "изменить время на 2 часа",       // должно стать 14:00 (время), НЕ «через 2 часа»
  "изменить время на через 30 минут",
  "изменить время на 9 вечера",
  "изменить время на полвосьмого",
  "изменить дату на завтра",
  "изменить название на покупки",
  "удалить время",
];

for (const p of editPhrases) {
  console.log(`${showEdit(p).padEnd(48)}  «${p}»`);
}
