const { getDb } = require('../db');

function getById(id) {
  const db = getDb();
  return db.prepare(`SELECT * FROM content_items WHERE id = ?`).get(id);
}

function getAnyActiveByEmotionType(emotion, type) {
  const db = getDb();
  return db.prepare(`
    SELECT *
    FROM content_items
    WHERE emotion_code = ?
      AND type = ?
      AND is_active = 1
    ORDER BY RANDOM()
    LIMIT 1
  `).get(emotion, type);
}

function getNeverPickedByEmotionType(emotion, type) {
  const db = getDb();
  return db.prepare(`
    SELECT ci.*
    FROM content_items ci
    LEFT JOIN daily_picks dp 
      ON ci.id = dp.content_item_id 
      AND dp.emotion_code = ? 
      AND dp.type = ?
    WHERE ci.emotion_code = ?
      AND ci.type = ?
      AND ci.is_active = 1
      AND dp.content_item_id IS NULL
    ORDER BY RANDOM()
    LIMIT 1
  `).get(emotion, type, emotion, type);
}

module.exports = {
  getById,
  getAnyActiveByEmotionType,
  getNeverPickedByEmotionType,
};
