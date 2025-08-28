# 🔐 DSF Security Toolkit — Client (Browser)

> Web Crypto HMAC-защита для фронтенда  
> Используется в проектах DSF.Finance для подписи и верификации HTTP-запросов (GET/POST) с помощью Web Crypto API.

---

## 🧩 Возможности

- ✅ Подпись GET и POST запросов через HMAC-SHA256
- ✅ Проверка целостности тела ответа по заголовку `x-response-hash`
- ✅ Использует безопасный встроенный Web Crypto API
- ✅ Не требует внешних зависимостей

---

## 📂 Модули

| Модуль                     | Назначение                                            |
|----------------------------|-------------------------------------------------------|
| `generateHmacHeadersGET`   | Формирует `x-wallet`, `x-timestamp`, `x-signature`    |
| `generateHmacHeadersPOST`  | Формирует `x-timestamp`, `x-body-hash`, `x-signature` |
| `verifyResponseHash`       | Проверка тела ответа по хешу                          |
| `verifyResponseFromHeaders`| Проверка fetch-ответа (заголовки + тело)              |
| `bufferToHex`              | Преобразование ArrayBuffer → hex                      |

---

## 🛠️ Примеры

### 🔐 Подпись GET-запроса

```ts
const headers = await generateHmacHeadersGET('0xYourWallet', 'shared-secret');
await fetch('/api/secure-endpoint', { headers });
```

### 🔐 Подпись POST-запроса

```ts
const body = { data: 42 };
const headers = await generateHmacHeadersPOST(body, 'shared-secret');
await fetch('/api/submit', {
  method: 'POST',
  headers: {
    ...headers,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
});
```

### ✅ Проверка ответа от сервера

```ts
const response = await fetch('/api/data');
const valid = await verifyResponseFromHeaders(response);

if (!valid) {
  console.warn('Ответ подделан или повреждён');
}
```

---

## ⚙️ Переменные (опционально)

| Переменная          | Назначение                      |
|---------------------|---------------------------------|
| `HMAC_SECRET`       | Секрет для HMAC-подписи         |

---

## 🔒 Алгоритмы

- Подпись: `HMAC_SHA256(timestamp + hash, secret)`
- Хеш тела: `SHA-256` или `HMAC-SHA256`, в зависимости от алгоритма
- Проверка в реальном времени с использованием `crypto.subtle`

---

## 👨‍💻 Автор

**Andrei Averin**  
🛡 CTO @ DSF.Finance  
📬 [andreaverin24@gmail.com](mailto:andreaverin24@gmail.com)  
🔗 [Telegram](https://t.me/andrey_blockchain) | [Twitter](https://twitter.com/andreaverin24)
