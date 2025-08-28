/**
 * @file security/index.js
 * 
 * @description
 * 🛡️ Универсальный модуль безопасности DSF (клиент, сервер, Telegram-бот)
 * Поддержка TypeScript и JavaScript.
 */

module.exports = {
  server: require('./server'),                   // 🛡️ Серверные функции (Node.js / Express.js)
  bot: require('./bot/telegramBotWatchDog.mjs'), // 📡 Telegram WatchDog Bot
};