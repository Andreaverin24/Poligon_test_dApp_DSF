# 📡 Telegram WatchDog Bot for DSF.Finance

> Надёжный Telegram-бот для логирования и оповещений об ошибках в защищённых API и контрактах DSF

---

## 🔍 Возможности

- ✅ Очередь сообщений с контролем скорости (rate-limit safe)
- ✅ Поддержка потоков сообщений в Telegram супергруппе
- ✅ Режим без потоков (если TELEGRAM_THREAD_URL_ERRORS === 'none')
- ✅ Защита от повторной отправки (deduplication через hash + NodeCache)
- ✅ Поддержка QUIET_MODE (для отключения в staging/dev среде)
- ✅ Усечение сообщений до 4096 символов
- ✅ Обработка ошибок Telegram API (429 Too Many Requests и др.)

---

## 📦 Использование

```ts
import { sendMessageToChat, safeSendMessage } from './bots/telegramBotWatchDog.mjs';

await safeSendMessage(
  'error|contract|0xabc123',
  '🚨 Ошибка в контракте 0xabc123: переполнение пула',
  process.env.TELEGRAM_THREAD_CONTRACT_ERRORS
);
```

---

## 🔧 Переменные окружения

| Переменная                    | Назначение                                         |
|-------------------------------|----------------------------------------------------|
| `TELEGRAM_BOT_TOKEN_WD`       | Токен Telegram-бота                                |
| `TELEGRAM_SUPERGROUP_ID`      | ID Telegram-супергруппы                            |
| `TELEGRAM_THREAD_URL_ERRORS`  | ID потока по умолчанию для ошибок                  |
| `TELEGRAM_GLOBAL_RATE`        | Максимум сообщений за 10 сек (по умолчанию — 5)    |
| `QUIET_MODE`                  | Если `true` — отключает любые сообщения в Telegram |

---

## 📜 Методы

| Метод                                     | Описание                                               |
|-------------------------------------------|--------------------------------------------------------|
| `sendMessageToChat(message, threadId)`    | Отправляет сообщение в Telegram в указанный поток      |
| `safeSendMessage(key, message, threadId)` | Предотвращает повторную отправку (по смысловому ключу) |

---

## 🛡 Примеры

### ⚠️ Сообщение об ошибке с защитой от повторов

```ts
await safeSendMessage(
  'proxy|url|timeout',
  '⏳ Превышено время ожидания запроса к API',
  '11666'
);
```

### ✅ Обычная отправка

```ts
await sendMessageToChat('🧪 Проверка Telegram-бота');
```

---

## ⏱ Ограничения

- Сообщения отправляются не чаще, чем 1 раз в 1600 мс
- Глобальный лимит сообщений сбрасывается каждые 10 сек

---

## 🧠 Особенности

- Использует `NodeCache` для защиты от повторов
- `messageQueue` гарантирует последовательную обработку
- Работает даже при нагрузке и ошибках API

---

## 👨‍💻 Автор

**Andrei Averin**  
🛡 CTO @ DSF.Finance  
📬 [andreaverin24@gmail.com](mailto:andreaverin24@gmail.com)  
🔗 [Telegram](https://t.me/andrey_blockchain) | [Twitter](https://twitter.com/andreaverin24)