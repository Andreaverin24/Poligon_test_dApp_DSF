# 🛡️ DSF Security Toolkit

> Модуль безопасности для Web3-приложений  
> Поддерживает TypeScript и JavaScript, работает на сервере (Node.js) и клиенте (browser).

---

## 📦 Установка

```bash
npm install @dsf/security-toolkit
```

---

## 🧩 Состав модуля

| Подмодуль        | Назначение                                        |
|------------------|---------------------------------------------------|
| `client/`        | Web Crypto API: HMAC-подпись и проверка на фронте |
| `server/`        | Node.js: защита API, HMAC, спуфинг, ловушки       |
| `bot/`           | Telegram-бот для логирования и алертов            |

---

## 🛠️ Пример импорта (универсально для TS и JS)

```ts
// TypeScript / ES6
import { client, server, bot } from '@dsf/security-toolkit';

const headers = await client.generateHmacHeadersPOST({ value: 42 }, 'mySecret');

app.use(server.antiSpoofGuard);
app.get('/api/data', (req, res) => {
  server.withHmacHash(req, res, { secure: true });
});
```

---

## 📡 Telegram Bot

```ts
await bot.safeSendMessage('api|error', '❌ Ошибка API');
```

---

## ✅ Совместимость

- ✔️ Node.js >= 16
- ✔️ ES Modules (`.ts`, `.mjs`, `.js`)
- ✔️ TypeScript & JavaScript

---

## 👨‍💻 Автор

**Andrei Averin**  
CTO @ DSF.Finance  
📬 andreaverin24@gmail.com  
📡 [t.me/andrey_blockchain](https://t.me/andrey_blockchain)