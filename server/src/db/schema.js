module.exports.SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS emotions (
  code TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  effect TEXT NOT NULL,
  color TEXT,
  ico TEXT,
  description TEXT
);

-- Контент для вкладок: music | video | image | exercise | article
CREATE TABLE IF NOT EXISTS content_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  emotion_code TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  url TEXT,
  image_url TEXT,
  body TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (emotion_code) REFERENCES emotions(code)
);

-- Не даём плодить дубли: (emotion_code + type + title)
CREATE UNIQUE INDEX IF NOT EXISTS uq_content_unique
ON content_items(emotion_code, type, title);


-- Выбор контента на день по эмоции И по типу (чтобы были вкладки)
CREATE TABLE IF NOT EXISTS daily_picks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  emotion_code TEXT NOT NULL,
  pick_date TEXT NOT NULL,       -- YYYY-MM-DD
  type TEXT NOT NULL,            -- music | video | image | exercise | article
  content_item_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (emotion_code) REFERENCES emotions(code),
  FOREIGN KEY (content_item_id) REFERENCES content_items(id)
);

CREATE INDEX IF NOT EXISTS idx_picks_emotion_date_type
ON daily_picks(emotion_code, pick_date, type);
`;
