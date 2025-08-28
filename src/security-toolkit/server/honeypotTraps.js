/**
 * @file Honeypot Traps for DSF.Finance
 * @description Ловушки и приманки для отслеживания подозрительных запросов.
 * Включает ответы-обманки, задержки, фейковые endpoint'ы и детект ботов по User-Agent.
 */

import { sendMessageToChatWD } from '../bot/telegramBotWatchDog.mjs';
import { extractRequestMeta } from './extractMeta.js';
import crypto from 'crypto';

// 📌 Список URL-ловушек, часто проверяемых сканерами, ботами или злоумышленниками
const honeypotPaths = [
    '/admin', '/admin-login', '/config.json', '/.env', '/.git', '/.DS_Store',
    '/phpmyadmin', '/api/keys', '/internal/metrics', '/v1/users',
    '/v2/token/refresh', '/graphql', '/api/login',
    '/admin.php', '/dashboard', '/panel', '/api/private',
    '/server-status', '/nginx_status', '/.well-known/security.txt'
];

// 🧠 Запоминаем, кто уже был залогирован, чтобы не спамить Telegram каждые 5 секунд
const loggedIPs = new Map();

/**
 * 🎭 Лёгкий фейковый JSON-ответ (используется в light-режиме)
 */
function generateRandomFakeData() {
    return {
      status: ['ok', 'failed', 'unauthorized'][Math.floor(Math.random() * 3)],
      data: Math.random() > 0.5
        ? Array.from({ length: Math.floor(Math.random() * 5) }, () => ({
            id: Math.random().toString(36).substring(2),
            value: Math.floor(Math.random() * 1000),
        }))
        : null,
      message: [
        'Endpoint moved',
        'Try again',
        'Unauthorized access',
        'Invalid session'
      ][Math.floor(Math.random() * 4)]
    };
  }

/**
 * 🧱 Генератор "тяжёлых" фейковых данных — создаёт массив мусора
 */
function generateFakePayload(size = 300) {
    return Array.from({ length: size }, (_, i) => ({
        id: i,
        hash: crypto.randomBytes(16).toString('hex'),
        junk: Math.random().toString(36).slice(2).repeat(3),
    }));
}

/**
 * 📦 Универсальный генератор ответа ловушки
 * @param {'light'|'heavy'} mode — режим ловушки
 */
export function generateTrapResponse(mode = 'light') {
    return mode === 'heavy'
    ? {
        status: 'fake',
        data: generateFakePayload(),
        message: 'Access denied or endpoint deprecated'
      }
    : generateRandomFakeData();
}

/**
 * ⏳ Promise-обёртка для задержки ответа
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 🤖 Проверяет, является ли User-Agent подозрительным (бот/скрипт)
 * @param {string} ua — User-Agent строки запроса
 * @returns {boolean}
 */
function isBotUA(ua = '') {
    return /(curl|python|axios|wget|httpclient|node|go|postman|insomnia|java|libwww)/i.test(ua);
}

/**
 * 🛡 Применить honeypot-ловушки к Express приложению
 * @param {import('express').Express} app
 * @param {Set<string>} [allowedRoutes] - допустимые пути
 */
export function applyHoneypotTraps(app, allowedRoutes = new Set()) {
    console.log('[HoneyPot] traps initialized.');
    
    // 📄 robots.txt с приманками
    app.get('/robots.txt', (req, res) => {
        res.type('text/plain').send(`User-agent: *\nDisallow: /.env\nDisallow: /admin\nDisallow: /config.json`);
    });
  
    /**
     * 🤖 Детект ботов
     */
    app.use(async (req, res, next) => {
        const ua = req.headers['user-agent'] || '';
        if (isBotUA(ua)) {
            const { origin, referer } = extractRequestMeta(req);
            const msg = `
🤖 [Honeypot Bot Detected]
🔐 IP: ${req.ip}
🌐 Origin: ${origin}
📩 Referer: ${referer}
🧠 UA: ${ua}
🕒 ${new Date().toISOString()}
            `;
            await sendMessageToChatWD(msg);
            await delay(1500);
            return res.status(403).json({ error: 'Forbidden bot detected' });
        }
        next();
    });

    // Фейковые system файлы
    app.get('/.env', (req, res) => res.send('DB_PASSWORD=none\nAPI_KEY=none'));
    app.get('/.git', (req, res) => res.send('git repo: private'));
    app.get('/.DS_Store', (req, res) => res.send(''));
    
    // GraphQL ловушка
    app.post('/graphql', async (req, res) => {
        await delay(1500);
        const msg = `🧬 Попытка GraphQL запроса от ${req.ip}`;
        await sendMessageToChatWD(msg);
        return res.status(400).json({ errors: [{ message: 'Malformed query' }] });
    });

    // Ловушка логина
    app.post('/api/login', (req, res) => {
        const msg = `🚨 Попытка фейкового логина с IP ${req.ip}`;
        sendMessageToChatWD(msg);
        res.status(403).json({ error: 'invalid credentials' });
    });

    /**
     * 🪤 Фейковые endpoint'ы ловушки
     */
    for (const trapPath of honeypotPaths) {
        app.all(trapPath, async (req, res) => {
            const { origin, referer, userAgent } = extractRequestMeta(req);
            const logHash = `${req.ip}-${trapPath}`;
            const now = Date.now();
            const last = loggedIPs.get(logHash);

            if (!last || now - last > 60_000) {
                const msg = `
🚨 [Honeypot Trap] Попытка доступа\n
📍 URL: \`${trapPath}\`\n
🔐 IP: ${req.ip}\n
🌐 Origin: ${origin}\n
📩 Referer: ${referer}\n
🧠 UA: ${userAgent}\n
🕒 ${new Date().toISOString()}
            `;
                await sendMessageToChatWD(msg);
                loggedIPs.set(logHash, now);
            }

            // ⏳ Симулируем нагрузку и задержку
            await delay(1000 + Math.random() * 3000);
            const statusCodes = [401, 403, 404, 418];
            const status = statusCodes[Math.floor(Math.random() * statusCodes.length)];
    
            // 🎭 Возвращаем фейковый JSON
            return res.status(status).json(generateTrapResponse('heavy'));
        });
    }

    app.use(async (req, res, next) => {
        const originalUrl = req.originalUrl.split('?')[0];
        if (!allowedRoutes.has(originalUrl)) {
            const fakeResponse = generateRandomFakeData();
            const statuses = [200, 400, 401, 403, 404, 418, 503];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
            const { address = '—', apikey = '—' } = req.query;
            const { origin, referer, userAgent } = extractRequestMeta(req);
            const msg = `
    🕵️‍♂️ [Honeypot Alert] Попытка доступа к запрещённому API
    
    📍 URL: \`${req.originalUrl}\`
    🔐 IP: ${req.ip}
    🔑 API Key: \`${apikey}\`
    👛 Wallet: \`${address}\`
    🌐 Origin: ${origin}
    📩 Referer: ${referer}
    🧠 UA: ${userAgent}
    ⏰ Время: ${new Date().toISOString()}
    `;
            await sendMessageToChatWD(msg, process.env.TELEGRAM_THREAD_APP_ERRORS);
            return res.status(randomStatus).json(fakeResponse);
        }
        next();
    });
}