/**
 * @file security/index.ts
 * 
 * @description
 * 🛡️ Универсальный модуль безопасности DSF (клиент, сервер, Telegram-бот)
 * Поддержка TypeScript и JavaScript.
 */

// 🔐 Клиентские функции (browser-safe: Web Crypto API)
export * as client from './client';

// 🛡️ Серверные функции (Node.js / Express.js)
export * as server from './server';

// 📡 Telegram WatchDog Bot
export * as bot from './bot/telegramBotWatchDog.mjs';