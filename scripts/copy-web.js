// Копирует веб-файлы приложения (тот же код, что и PWA) в папку www,
// из которой Capacitor собирает нативное приложение.
// Запуск: npm run build:web
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const www = path.join(root, "www");

// Что именно копируем (только файлы самого приложения, без node_modules и android).
const FILES = [
  "index.html",
  "script.js",
  "service-worker.js",
  "manifest.webmanifest",
];
const DIRS = ["fonts", "styles", "icons"];

// Очищаем www и создаём заново.
fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(www, { recursive: true });

for (const file of FILES) {
  const src = path.join(root, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(www, file));
  } else {
    console.warn("Пропущен (не найден):", file);
  }
}

for (const dir of DIRS) {
  const src = path.join(root, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(www, dir), { recursive: true });
  } else {
    console.warn("Пропущена папка (не найдена):", dir);
  }
}

console.log("Готово: веб-файлы скопированы в www/");
