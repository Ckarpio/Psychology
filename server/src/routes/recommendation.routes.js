/*
 * =====================================================================
 * recommendation.routes.js — МАРШРУТ ДЛЯ РЕКОМЕНДАЦИЙ
 * =====================================================================
 *
 * Этот файл описывает маршрут для получения рекомендации по эмоции.
 *
 * Итоговый URL: GET /api/recommendation?emotion=anger
 *   /api            — добавляется в app.js
 *   /recommendation — добавляется в routes/index.js
 *   /               — описано здесь
 *   ?emotion=anger  — query-параметр (передаётся в URL после знака ?)
 *
 * Query-параметры — это способ передать данные через URL.
 * Например: /api/recommendation?emotion=anger&lang=ru
 * Здесь emotion=anger и lang=ru — это два параметра.
 * В коде они доступны через req.query.emotion и req.query.lang
 * =====================================================================
 */

// ─── Шаг 1: Создаём роутер ─────────────────────────────────────────
const router = require('express').Router();

// ─── Шаг 2: Подключаем контроллер ───────────────────────────────────
const { getRecommendation } = require('../controllers/recommendation.controller');

// ─── Шаг 3: Описываем маршрут ───────────────────────────────────────
// GET-запрос на '/' → вызываем функцию getRecommendation
router.get('/', getRecommendation);

// ─── Шаг 4: Экспортируем ───────────────────────────────────────────
module.exports = router;
