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
    SELECT *
    FROM content_items
    WHERE emotion_code = ?
      AND type = ?
      AND is_active = 1
      AND id NOT IN (
        SELECT content_item_id
        FROM daily_picks
        WHERE emotion_code = ? AND type = ?
      )
    ORDER BY RANDOM()
    LIMIT 1
  `).get(emotion, type, emotion, type);
}

module.exports = {
  getById,
  getAnyActiveByEmotionType,
  getNeverPickedByEmotionType,
};
