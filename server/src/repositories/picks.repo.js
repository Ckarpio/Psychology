const { getDb } = require('../db');

function getPickedItemId(emotion, date, type) {
  const db = getDb();
  const row = db.prepare(`
    SELECT content_item_id
    FROM daily_picks
    WHERE emotion_code = ? AND pick_date = ? AND type = ?
  `).get(emotion, date, type);

  return row ? row.content_item_id : null;
}

function savePick(emotion, date, type, contentItemId) {
  const db = getDb();
  db.prepare(`
    INSERT INTO daily_picks(emotion_code, pick_date, type, content_item_id)
    VALUES (?, ?, ?, ?)
  `).run(emotion, date, type, contentItemId);
}

module.exports = { getPickedItemId, savePick };
