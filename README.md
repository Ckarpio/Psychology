# Эмоциональный помощник — Backend (Express + SQLite)

Этот проект — простой сервер на **Node.js + Express** с базой данных **SQLite** (файл `app.db`).
Суть проекта: пользователь выбирает эмоцию, а сервер отдаёт **контент на день** по вкладкам:
- **Музыка** (`music`)
- **Видео** (`video`)
- **Картинки** (`image`)
- **Упражнения** (`exercise`)
- **Статьи** (`article`)

Сервер умеет:
1) Отдавать список эмоций.  
2) Отдавать **контент на текущий день** по выбранной эмоции (и фиксировать его на весь день).

---

## 1) Что нужно установить (ПОЭТАПНО)

### Шаг 1. Установить Node.js
1. Скачать и установить **Node.js**.
2. Проверить, что всё работает:
   ```bash
   node -v
   npm -v
   ```
   Если команды показывают версии — отлично.

> Если команды не работают — Node.js не установлен или не добавлен в PATH.

---

### Шаг 2. Скачать/распаковать проект
Если проект в архиве — распаковать.  
Дальше работаем в папке проекта `server` (в той, где лежит `package.json` сервера).

---

### Шаг 3. Установить зависимости
В терминале (PowerShell / CMD / Terminal) перейти в папку `server`:

```bash
cd server
```

Установить библиотеки:

```bash
npm install
```

---

### Шаг 4. Создать базу и заполнить тестовыми данными (seed)
Запустить сидер (он создаст файл `app.db`, таблицы и добавит тестовые эмоции/контент):

```bash
npm run seed
```

Если команды `seed` нет — открыть `package.json` и проверить, что там есть:
```json
"scripts": {
  "seed": "node src/db/seed.js",
  "start": "node src/app.js"
}
```

---

### Шаг 5. Запустить сервер
```bash
npm start
```

Сервер должен запуститься и показать в консоли что-то вроде:
```
API: http://localhost:3000
```

---

## 2) Как проверить, что сервер работает

Открыть браузер и вставить ссылки:

### 2.1 Список эмоций
```
http://localhost:3000/api/emotions
```

### 2.2 Контент на день по эмоции
Например, для гнева (`anger`):
```
http://localhost:3000/api/recommendation?emotion=anger
```

---

## 3) Структура папок (как устроен проект)

Обычно структура выглядит так:

```
server/
  package.json
  src/
    app.js
    db/
      index.js
      schema.js
      seed.js
    routes/
      index.js
      emotions.routes.js
      recommendation.routes.js
    controllers/
      emotions.controller.js
      recommendation.controller.js
    services/
      recommendation.service.js
    repositories/
      emotions.repo.js
      content.repo.js
      picks.repo.js
  app.db (создаётся автоматически после seed или запуска)
```

### Зачем это всё разделено?
Это структура “как в реальных проектах”, но сделана максимально понятной и без лишней сложности.

## Как называется подход
Такой подход называется **слоистая архитектура** (*Layered Architecture*) или **разделение ответственности** (*Separation of Concerns*).

## Краткое описание подхода
Идея в том, что код делится на отдельные слои, и каждый слой отвечает только за свою задачу:

- **routes** знают только “какой URL куда ведёт”  
- **controllers** принимают запрос и формируют ответ  
- **services** содержат основную логику (правила проекта)  
- **repositories** выполняют запросы к базе данных  

Это делает проект понятнее, легче для правок и проще для отладки.


- **routes/** — “карта адресов” (какой URL вызывает какой контроллер)
- **controllers/** — принимает запрос, проверяет параметры, отдаёт ответ
- **services/** — основная логика (как выбирать контент)
- **repositories/** — чистая работа с БД (SQL-запросы)
- **db/** — подключение SQLite и создание таблиц

---

## 4) Эндпоинты (API)

### 4.1 `GET /api/emotions`
**Что делает:** возвращает список всех эмоций из таблицы `emotions`.

**Пример:**
```
GET http://localhost:3000/api/emotions
```

**Ответ (пример):**
```json
[
  {
    "code": "anger",
    "label": "Гнев",
    "effect": "negative",
    "color": "orange",
    "ico": "",
    "description": "..."
  }
]
```

---

### 4.2 `GET /api/recommendation?emotion=CODE`
**Что делает:** возвращает контент **на текущий день** для выбранной эмоции.

**Пример:**
```
GET http://localhost:3000/api/recommendation?emotion=anger
```

**Важно:**  
Если уже был выбор на сегодня — сервер вернёт **точно такой же контент** (он “фиксируется” на день).

**Ответ (пример):**
```json
{
  "date": "2026-01-21",
  "emotion": {
    "code": "anger",
    "label": "Гнев",
    "effect": "negative",
    "color": "orange",
    "ico": "",
    "description": "..."
  },
  "material": {
    "music": [{...}],
    "video": [{...}],
    "images": [{...}],
    "exercises": [{...}],
    "articles": [{...}]
  }
}
```

---

## 5) SQLite — что это и где база хранится

**SQLite** — это база данных, которая хранится одним файлом.  
У нас это файл:

- `backend/app.db`

Это удобно:
- не нужен отдельный сервер базы данных
- легко переносить проект
- идеально для школьного проекта

---

## 6) Схема базы данных (таблицы и поля)

Ниже таблицы из `schema.js`.

---

### 6.1 Таблица `emotions`
**Для чего:** справочник эмоций (название, описание и т.д.)

Поля:
- `code` (TEXT, PK) — уникальный код: `anger`, `sadness`…
- `label` — название на русском: “Гнев”
- `effect` — `negative` или `positive`
- `color` — цвет (используется на фронте)
- `ico` — путь к иконке
- `description` — описание эмоции

---

### 6.2 Таблица `content_items`
**Для чего:** “склад” контента для каждой эмоции и каждой вкладки.

Поля:
- `id` (INTEGER, PK) — авто ID
- `emotion_code` — к какой эмоции относится (например `anger`)
- `type` — тип вкладки: `music | video | image | exercise | article`
- `title` — заголовок карточки
- `subtitle` — подзаголовок (не обязателен)
- `url` — ссылка (например на видео/статью)
- `image_url` — ссылка на картинку превью
- `body` — текст/описание/инструкция
- `is_active` — 1/0 (активен или отключен)
- `created_at` — когда добавили (заполняется автоматически)

**Важно:**  
`created_at` нужен только “для истории”.  
Выбор контента “на день” делается не по `created_at`, а через таблицу `daily_picks`.

---

### 6.3 Таблица `daily_picks`
**Для чего:** “расписание на день” — что показывать сегодня для эмоции и каждой вкладки.

Поля:
- `emotion_code` — эмоция
- `pick_date` — дата `YYYY-MM-DD`
- `type` — вкладка (`music`, `video`, ...)
- `content_item_id` — какой контент выбран

Есть ограничение:
- `UNIQUE (emotion_code, pick_date, type)`

Это значит:
- в один день для эмоции и вкладки может быть только 1 выбранный контент
- поэтому контент “фиксируется на весь день”

---

## 7) Как сервер выбирает контент “на сегодня” (простая логика)

Для каждого типа вкладки (`music`, `video`, `image`, `exercise`, `article`) сервер делает:

1) Смотрит в `daily_picks`: есть ли запись на сегодня?
   - если есть → отдаёт её (контент уже выбран)
2) Если нет:
   - пытается выбрать контент, который **ещё ни разу не выдавался**
   - если такого нет → берёт любой активный (случайный)
3) Записывает выбор в `daily_picks`, чтобы он держался весь день.

---

## 8) Как пополнять контент (ВАЖНО)

Контент пополняется в таблицу `content_items`.  
Есть 2 способа:

### Способ A: через SQLite Browser (проще всего)
1) Открой `app.db` в **DB Browser for SQLite**
2) Вкладка **Browse Data**
3) Таблица `content_items`
4) Нажми **New Record**
5) Заполни поля, например:
   - `emotion_code`: `anger`
   - `type`: `video`
   - `title`: `Как успокоиться за 1 минуту`
   - `url`: `https://...`
   - `image_url`: `https://...`
   - `body`: `Короткое описание`
   - `is_active`: `1`
6) Нажми **Write Changes**

---

### Способ B: через SQL (быстро добавить сразу много)
Вкладка **Execute SQL**:

```sql
INSERT INTO content_items (emotion_code, type, title, subtitle, url, image_url, body, is_active)
VALUES
('anger','video','Видео про гнев','коротко','https://example.com',NULL,'Описание',1),
('anger','exercise','Дыхание 4-4-6',NULL,NULL,NULL,'Вдох 4 → задержка 4 → выдох 6',1);
```

---

## 9) Как назначить конкретный контент на конкретный день (по расписанию)

Если ты хочешь, чтобы **в определённый день** показывался **определённый контент**, ты заполняешь `daily_picks` вручную.

### Шаг 1. Узнай ID контента
```sql
SELECT id, emotion_code, type, title
FROM content_items
WHERE emotion_code = 'anger'
ORDER BY id;
```

### Шаг 2. Назначь его на дату
Например, 2026-01-25 для `anger` во вкладке `video`:

```sql
INSERT INTO daily_picks (emotion_code, pick_date, type, content_item_id)
VALUES ('anger', '2026-01-25', 'video', 12);
```

Если запись уже есть и нужно заменить:

```sql
UPDATE daily_picks
SET content_item_id = 15
WHERE emotion_code = 'anger'
  AND pick_date = '2026-01-25'
  AND type = 'video';
```

> После этого весь день сервер будет отдавать именно этот контент, без случайного выбора.

---

## 10) Какие функции где находятся (чтобы разобраться)

### 10.1 Репозитории (repositories)
Это функции, которые выполняют SQL-запросы.

- `emotions.repo.js`
  - `getAllEmotions()` — получить список эмоций
  - `getEmotionByCode(code)` — получить эмоцию по коду

- `content.repo.js`
  - `getById(id)` — получить контент по ID
  - `getNeverPickedByEmotionAndType(emotion, type)` — найти контент, который ещё не выбирался
  - `getAnyActiveByEmotionAndType(emotion, type)` — взять любой активный (рандом)

- `picks.repo.js`
  - `getPickedItemId(emotion, date, type)` — узнать, что выбрано на день
  - `savePick(emotion, date, type, contentItemId)` — сохранить выбор на день

---

### 10.2 Сервис (services)
Сервис — это основная логика.

- `recommendation.service.js`
  - `getDailyRecommendation(emotion)`
    - берёт эмоцию
    - находит/создаёт выбор на день (по вкладкам)
    - возвращает объект `{date, emotion, material}`

---

### 10.3 Контроллеры (controllers)
Контроллер — связка HTTP → сервис.

- `emotions.controller.js`
  - вызывает `getAllEmotions()` и отдаёт JSON

- `recommendation.controller.js`
  - читает `req.query.emotion`
  - вызывает `getDailyRecommendation(emotion)`
  - отдаёт JSON

---

### 10.4 Роуты (routes)
Роуты связывают URL и контроллер.

- `/api/emotions` → emotions.controller
- `/api/recommendation` → recommendation.controller

---

## 11) Частые проблемы и решения

### Сервер не запускается
- Проверь, что ты в папке `backend`
- Сделай `npm install`
- Запусти `npm start`

### `app.db` нет
- Запусти `npm run seed` (или сервер, если он создаёт БД при старте)

### Контент не выдаётся
- Проверь, что в `content_items` есть записи с `is_active = 1`
- Проверь правильность `emotion_code` и `type`

### Хочу “другой контент сегодня”
По логике проекта контент фиксируется на день.
Если хочешь поменять вручную:
- в таблице `daily_picks` найди запись на сегодня и поменяй `content_item_id`

---

## 12) Мини-шпаргалка: типы вкладок

Используй только эти значения в поле `type`:
- `music`
- `video`
- `image`
- `exercise`
- `article`

