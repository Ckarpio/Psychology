/*
 * =====================================================================
 * picks.repo.js — РЕПОЗИТОРИЙ ДЛЯ РАБОТЫ С ЕЖЕДНЕВНЫМИ ВЫБОРАМИ
 * =====================================================================
 *
 * Этот файл работает с таблицей daily_picks.
 * Таблица daily_picks хранит информацию о том, какой контент
 * был выбран для каждой эмоции в каждый конкретный день.
 *
 * Две функции:
 *   1. getPickedItemId() — проверить, есть ли уже выбор на сегодня
 *   2. savePick()        — сохранить новый выбор
 *
 * Благодаря этой таблице контент "залипает" на весь день:
 * при повторном открытии страницы пользователь видит тот же контент.
 * =====================================================================
 */

// ─── Шаг 1: Подключаем базу данных ─────────────────────────────────
const { getDb } = require('../db');

// ─── Шаг 2: Проверить, есть ли уже выбор на сегодня ────────────────
// getPickedItemId(emotion, date, type) — ищет в daily_picks запись
// для данной комбинации эмоция + дата + тип.
//
// Параметры:
//   emotion — код эмоции ('anger', 'joy', ...)
//   date    — дата в формате 'YYYY-MM-DD'
//   type    — тип контента ('music', 'video', ...)
//
// Возвращает:
//   content_item_id (число) — если запись найдена
//   null                    — если записи нет (контент ещё не выбирали сегодня)
function getPickedItemId(emotion, date, type) {
  const db = getDb();

  // SELECT content_item_id — выбираем только одну колонку (id выбранного контента).
  // FROM daily_picks — из таблицы ежедневных выборов.
  // WHERE — фильтр по трём полям одновременно (AND = "и"):
  //   emotion_code = ?  — совпадает эмоция (первый ?)
  //   AND pick_date = ? — совпадает дата (второй ?)
  //   AND type = ?      — совпадает тип контента (третий ?)
  //
  // .get(emotion, date, type) — подставляет три значения вместо трёх ?
  //   (по порядку: первый ? = emotion, второй ? = date, третий ? = type)
  //
  // Результат: объект { content_item_id: 42 } или undefined (если не нашёл)
  const row = db.prepare(`
    SELECT content_item_id
    FROM daily_picks
    WHERE emotion_code = ? AND pick_date = ? AND type = ?
  `).get(emotion, date, type);

  // Тернарный оператор:
  //   row ? row.content_item_id : null
  //
  // Если row существует (запись найдена) → возвращаем id контента
  // Если row = undefined (не найдена) → возвращаем null
  //
  // Зачем не просто return row? Потому что нам нужен только id (число),
  // а не весь объект. Это удобнее для вызывающего кода.
  return row ? row.content_item_id : null;
}

// ─── Шаг 3: Сохранить новый выбор ──────────────────────────────────
// savePick(emotion, date, type, contentItemId) — записывает в daily_picks
// информацию о том, что для данной эмоции, даты и типа выбран контент с id.
//
// Параметры:
//   emotion       — код эмоции
//   date          — дата
//   type          — тип контента
//   contentItemId — id выбранного материала из таблицы content_items
function savePick(emotion, date, type, contentItemId) {
  const db = getDb();

  // INSERT INTO daily_picks(...) VALUES (?, ?, ?, ?)
  //   — вставляет новую строку в таблицу daily_picks.
  //
  // Перечисляем колонки: (emotion_code, pick_date, type, content_item_id)
  // И значения для них: (?, ?, ?, ?) — четыре параметра.
  //
  // .run(emotion, date, type, contentItemId) — выполняет запрос.
  //
  // Разница между .run(), .get() и .all():
  //   .run()  — выполняет запрос без возврата данных (INSERT, UPDATE, DELETE)
  //   .get()  — выполняет запрос и возвращает ОДНУ строку (SELECT)
  //   .all()  — выполняет запрос и возвращает ВСЕ строки (SELECT)
  //
  // Если в таблице уже есть запись с такой же комбинацией
  // (emotion_code + pick_date + type), INSERT выбросит ошибку,
  // потому что в schema.js мы создали уникальное ограничение.
  // Эту ошибку ловит try/catch в recommendation.service.js
  db.prepare(`
    INSERT INTO daily_picks(emotion_code, pick_date, type, content_item_id)
    VALUES (?, ?, ?, ?)
  `).run(emotion, date, type, contentItemId);
}

// ─── Шаг 4: Экспортируем функции ───────────────────────────────────
module.exports = { getPickedItemId, savePick };
