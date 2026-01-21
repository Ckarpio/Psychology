const { getDb } = require('../db');

function getAllEmotions() {
  const db = getDb();
  return db.prepare(`
    SELECT code,label,effect,color,ico,description
    FROM emotions
    ORDER BY effect, label
  `).all();
}

function getEmotionByCode(code) {
  const db = getDb();
  return db.prepare(`
    SELECT code,label,effect,color,ico,description
    FROM emotions
    WHERE code = ?
  `).get(code);
}

module.exports = { getAllEmotions, getEmotionByCode };
