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
  "измени на 5 минут",                 // сдвиг вперёд: 14:05
  "изменить время на 5 минут позже",   // 14:05
  "изменить время на 5 минут раньше",  // 13:55
  "изменить время на полчаса позже",   // 14:30
  "изменить время на 3 часа",          // установка времени: 15:00 (НЕ сдвиг)
  "изменить время на 2 часа позже",    // сдвиг: 16:00
  "изменить время на через 30 минут",  // через = от сейчас
  "изменить время на 9 вечера",        // 21:00
  "изменить время на полвосьмого",     // 19:30
  "изменить дату на завтра",
  "изменить название на покупки",
  "удалить время",
];

for (const p of editPhrases) {
  console.log(`${showEdit(p).padEnd(48)}  «${p}»`);
}

// --- Расписание уведомлений (getNotificationTimes) ---
console.log("\n--- расписание уведомлений ---");
const pad2 = (n) => String(n).padStart(2, "0");
const fmtDT = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
function showNotif(label, item) {
  const times = sandbox.getNotificationTimes(item).slice().sort((a, b) => a - b);
  console.log(`\n${label}: «${item.name}» (${item.date}${item.time ? " " + item.time : " без времени"})`);
  times.forEach((t) => console.log("   • " + fmtDT(t)));
}
const nowT = new Date();
const plus = (ms) => new Date(nowT.getTime() + ms);
const H = 3600 * 1000;
const D = 24 * H;
const soonD = plus(3 * H);
showNotif("Событие <24ч", { id: "1", name: "созвон", date: sandbox.toIsoDate(soonD), time: pad2(soonD.getHours()) + ":" + pad2(soonD.getMinutes()), period: "" });
const farD = plus(5 * D); farD.setHours(17, 0, 0, 0);
showNotif("Событие >24ч (17:00)", { id: "2", name: "стрижка", date: sandbox.toIsoDate(farD), time: "17:00", period: "" });
const earlyD = plus(5 * D); earlyD.setHours(7, 0, 0, 0);
showNotif("Событие >24ч раннее (07:00)", { id: "3", name: "поезд", date: sandbox.toIsoDate(earlyD), time: "07:00", period: "" });
showNotif("Без времени (через 10 дней)", { id: "4", name: "паспорт", date: sandbox.toIsoDate(plus(10 * D)), time: null, period: "" });
