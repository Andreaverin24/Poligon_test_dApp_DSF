# 🛡️ DSF Security Toolkit

> Защищённый модуль HMAC-аутентификации для Node.js / Express API  
> Используется в проектах DSF.Finance для верификации подлинности, целостности и защиты от атак.

---

## 🔍 Возможности

- ✅ Подпись и верификация HMAC для `GET` и `POST` запросов
- ✅ Проверка целостности тела и ответа (SHA256 / HMAC-SHA256)
- ✅ Защита от спуфинга по `Origin` / `Referer`
- ✅ Telegram-уведомления при ошибках и попытках взлома
- ✅ Удобные утилиты для интеграции с Express
- ✅ Honeypot Traps: ловушки для ботов и сканеров

---

## 📦 Установка

```bash
npm install @dsf/security-toolkit
```

---

## 📂 Структура

| Модуль                     | Назначение                                            |
|----------------------------|-------------------------------------------------------|
| `generateHmacHeadersGET`   | Формирует `x-wallet`, `x-timestamp`, `x-signature`    |
| `generateHmacHeadersPOST`  | Формирует `x-timestamp`, `x-body-hash`, `x-signature` |
| `verifyHmacSignatureGET`   | Проверяет подлинность GET-запроса                     |
| `verifyHmacSignaturePOST`  | Проверяет POST-запрос (целостность + подпись)         |
| `withHmacHash`             | Оборачивает JSON-ответ с хешем                        |
| `verifyResponseHash`       | Проверка хеша тела (по алгоритму)                     |
| `antiSpoofGuard`           | Middleware для защиты от подмены Origin               |
| `extractRequestMeta`       | Извлекает данные: IP, UA, referer, origin             |
| `applyHoneypotTraps`       | 	Включает фейковые endpoint'ы и ловушки для ботов     |
---

## 🛠️ Пример использования

### ✅ Мспользование ловушки (Honeypot)

```js
import express from 'express';
import { applyHoneypotTraps } from '@dsf/security-toolkit';

const allowedRoutes = new Set([
  '/api/data',
  '/api/status',
  '/api/login'
]);

applyHoneypotTraps(app, allowedRoutes);
```

### ✅ Проверка, не подменён ли запрос (antiSpoof)

```js
import express from 'express';
import { antiSpoofGuard } from '@dsf/security-toolkit';

const app = express();

app.use('/api', antiSpoofGuard);
```

### ✅ Генерация HMAC-заголовков (GET)

```js
import { generateHmacHeadersGET } from '@dsf/security-toolkit';

const headers = generateHmacHeadersGET('0xWallet...', 'super-secret');
```

### ✅ Проверка запроса (GET)

```js
import { verifyHmacSignatureGET } from '@dsf/security-toolkit';

app.get('/api/protected', (req, res) => {
  if (!verifyHmacSignatureGET(req, process.env.HMAC_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  res.json({ secure: true });
});
```

### ✅ Обёртка ответа с хешем

```js
import { withHmacHash } from '@dsf/security-toolkit';

app.get('/api/data', (req, res) => {
  const data = { message: 'Secure response' };
  withHmacHash(req, res, data, process.env.HMAC_SECRET);
});
```

---

## ⚙️ Переменные окружения

| Название         | Назначение                      |
|------------------|---------------------------------|
| `HMAC_SECRET`    | Секрет для HMAC-подписи         |
| `ALLOWED_ORIGINS`| Допустимые домены через запятую |
| `TELEGRAM_TOKEN` | Токен WatchDog-бота (опц.)      |
| `TELEGRAM_CHAT`  | ID чата для логов               |

---

## 🧪 Проверка ответа

```js
import { verifyResponseHash } from '@dsf/security-toolkit';

const valid = verifyResponseHash(responseText, response.headers['x-response-hash']);
```

---

## 🔒 Алгоритмы

- HMAC подпись: `HMAC_SHA256(timestamp + hash, sharedSecret)`
- Проверка дрифта времени: `±5 минут` для GET, `±30 сек` для POST
- Хеши: `SHA256` по телу или `HMAC_SHA256` при наличии секрета

---

## 📡 Telegram интеграция

Встроенные уведомления через `safeSendMessage()`  
Отправляют сообщения о:

- Отсутствии заголовков
- Недопустимом времени
- Неверной подписи
- Попытке подмены запроса

## 👨‍💻 Автор

**Andrei Averin**  
🛡 CTO @ DSF.Finance  
📬 [andreaverin24@gmail.com](mailto:andreaverin24@gmail.com)  
🔗 [Telegram](https://t.me/andrey_blockchain) | [Twitter](https://twitter.com/andreaverin24)

---

## 🛠 TODO

- [ ] Добавить unit-тесты
- [ ] Возможность настраивать окно времени (`maxDrift`)
- [ ] Поддержка ECDSA (по флагу)
- [ ] WebSocket HMAC протокол (в разработке)