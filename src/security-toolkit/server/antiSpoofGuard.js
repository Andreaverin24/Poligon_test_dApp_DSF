/**
 * @file antiSpoofGuard.js
 * 
 * @description
 * 🛡️ Middleware-защита от spoofing-атак по Origin и Referer.
 *
 * Используется для:
 * - Блокировки запросов с поддельных источников
 * - Telegram-уведомлений о подозрительной активности
 * - Журналирования информации о подозрительных запросах
 *
 * 🔒 Проверяет:
 * ✅ Origin должен быть в списке `ALLOWED_ORIGINS`
 * ✅ Referer должен начинаться с одного из допустимых доменов
 */

import { sendMessageToChat } from '../utils/bots/telegramBotWatchDog.mjs';
import { extractRequestMeta } from './extractMeta.js';

// Список разрешённых Origin'ов из ENV
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

/**
 * Express middleware для защиты от spoofing-запросов
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
export function antiSpoofGuard(req, res, next) {
    const { origin, referer, ip, userAgent, source } = extractRequestMeta(req);

    const isOriginAllowed = allowedOrigins.includes(origin);
    const isRefererAllowed = allowedOrigins.some((domain) => referer?.startsWith(domain));
    const isSpoofAttempt = !isOriginAllowed || !isRefererAllowed;

    if (ip && userAgent) {
        console.log(`🕵️ IP: ${ip}, UA: ${userAgent}, Origin: ${origin}, Referer: ${referer}, Source: ${source}`);
    }

    if (isSpoofAttempt) {
        const warningMsg = `
🚨 Возможная попытка спуфинга:
❌ Origin: ${origin}
❌ Referer: ${referer}
❌ x-source: ${source}
🕵️ IP: ${ip}
UA: ${userAgent}
        `;
        console.warn(warningMsg);
        sendMessageToChat(`[WatchDogBot] ${warningMsg}`);
        return res.status(403).json({ error: 'Forbidden: spoof attempt detected' });
    }

    next();
}