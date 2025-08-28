/**
 * @file index.js
 * 
 * @description
 * 🔐 DSF Security Toolkit
 *
 * Универсальный модуль для защиты API-запросов и ответов:
 * - Подпись и верификация HMAC для GET и POST-запросов
 * - Защита от спуфинга (Origin/Referer)
 * - Хеширование и контроль целостности ответов
 * - Honeypot-ловушки против сканеров, ботов и фейковых скриптов
 * - Встроенные Telegram-уведомления через WatchDog
 * - Утилиты для метаинформации, конвертации Buffer → Hex
 *
 * ✅ Подходит для Express.js API-серверов и прокси
 * ✅ Работает с HMAC-SHA256 и SHA256
 * ✅ Поддерживает строгую и гибкую проверку
 *
 * 📦 Экспортирует:
 * - verifyHmacSignatureGET
 * - verifyHmacSignaturePOST
 * - generateHmacHeadersGET
 * - withHmacHash
 * - verifyResponseHash, verifyResponseFromHeadersWithBody
 * - antiSpoofGuard
 * - applyHoneypotTraps
 * - bufferToHex
 * - extractRequestMeta
 */

// ✅ Верификация запросов
export { verifyHmacSignatureGET } from './verifyHmacSignatureGET.js';
export { verifyHmacSignaturePOST } from './verifyHmacSignaturePOST.js';

// ✅ Генерация заголовков
export { generateHmacHeadersGET } from './generateHmacHeadersGET.js';
export { generateHmacHeadersPOST } from './generateHmacHeadersPOST.js';

// ✅ Ответ с HMAC
export { withHmacHash } from './withHmacHash.js';

// ✅ Проверка ответа
export { verifyResponseHash, verifyResponseFromHeadersWithBody } from './verifyResponseHash.js';

// ✅ Защита от спуфинга
export { antiSpoofGuard } from './antiSpoofGuard.js';

// ✅ Утилиты
export { bufferToHex } from './cryptoUtils.js';
export { extractRequestMeta } from './extractMeta.js';

// ✅ Honeypot ловушки
export { applyHoneypotTraps } from './honeypotTraps.js';