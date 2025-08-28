/**
 * @file index.ts
 * 
 * @description 
 * Точка входа для клиентских криптографических и верификационных утилит.
 *
 * Экспортирует:
 * 🔐 `cryptoUtils` — преобразование бинарных данных (SHA-256, HMAC) в hex-строки
 * 🔐 `generateHmacHeaders` — создание безопасных HMAC-заголовков для POST-запросов
 * 🔐 `generateHmacQueryHeaders` — HMAC-защита для GET/QUERY-запросов
 * 🔐 `verifyResponseHash` — верификация целостности ответа по хешу (SHA-256 / HMAC-SHA256)
 */

// ✅ Утилиты
export * from './cryptoUtils';

// ✅ Генерация заголовков
export * from './generateHmacHeadersPOST';
export * from './generateHmacHeadersGET';

// ✅ Проверка ответа
export * from './verifyResponseHash';