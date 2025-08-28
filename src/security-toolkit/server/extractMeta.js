/**
 * @file extractMeta.js
 * 
 * @description
 * 🔍 Утилита для извлечения базовой информации о входящем запросе:
 * - Origin и Referer
 * - IP-адрес клиента
 * - User-Agent
 * - Доп. источник (x-source)
 *
 * Используется в антиспуфинге и системах логирования.
 *
 * 📦 Пример использования:
 * const { origin, referer, ip, userAgent, source } = extractRequestMeta(req);
 */

/**
 * Извлекает метаинформацию о запросе
 * @param {import('express').Request} req - HTTP-запрос Express
 * @returns {{
 *   origin: string,
 *   referer: string,
 *   ip: string,
 *   userAgent: string,
 *   source: string
 * }}
 */
export function extractRequestMeta(req) {
    return {
        origin: req.headers.origin ?? 'unknown',
        referer: req.headers.referer ?? 'unknown',
        ip: req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? 'unknown',
        userAgent: req.headers['user-agent'] ?? 'unknown',
        source: req.headers['x-source'] ?? 'unknown',
    };
}
