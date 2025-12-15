CREATE TABLE IF NOT EXISTS Emotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK(type IN ('positive', 'negative', 'neutral')),
    color TEXT,
    emoji TEXT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS Materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    media_path TEXT,
    duration INTEGER,
    content_type TEXT NOT NULL CHECK(content_type IN ('article', 'audio', 'video', 'exercise')),
    emotion_type TEXT,
    tags TEXT
);

CREATE TABLE IF NOT EXISTS EmotionLogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d', 'now')),
    emotion_id INTEGER NOT NULL,
    notes TEXT,
    intensity INTEGER CHECK(intensity BETWEEN 1 AND 5),
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (emotion_id) REFERENCES Emotions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS UserSettings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    theme TEXT DEFAULT 'light' CHECK(theme IN ('light', 'dark')),
    notifications_enabled INTEGER DEFAULT 1,
    language TEXT DEFAULT 'ru',
    daily_reminder_time TEXT DEFAULT '20:00'
);

CREATE INDEX IF NOT EXISTS idx_emotion_logs_date ON EmotionLogs(date);
CREATE INDEX IF NOT EXISTS idx_emotion_logs_emotion_id ON EmotionLogs(emotion_id);
CREATE INDEX IF NOT EXISTS idx_materials_category ON Materials(category);
CREATE INDEX IF NOT EXISTS idx_materials_content_type ON Materials(content_type);

INSERT OR IGNORE INTO Emotions (name, type, color, emoji, description) VALUES
('Радость', 'positive', '#FFD700', '😊', 'Чувство счастья и удовольствия'),
('Спокойствие', 'positive', '#87CEEB', '😌', 'Состояние умиротворения'),
('Уверенность', 'positive', '#32CD32', '💪', 'Вера в свои силы'),
('Вдохновение', 'positive', '#FF69B4', '✨', 'Прилив творческой энергии'),
('Благодарность', 'positive', '#FFA500', '🙏', 'Чувство признательности'),
('Тревога', 'negative', '#FF6B6B', '😰', 'Беспокойство и нервное напряжение'),
('Грусть', 'negative', '#6495ED', '😔', 'Чувство печали и тоски'),
('Гнев', 'negative', '#DC143C', '😠', 'Сильное раздражение и злость'),
('Стресс', 'negative', '#8B4513', '🥵', 'Состояние психического напряжения'),
('Усталость', 'negative', '#696969', '😴', 'Физическое или mental истощение'),
('Разочарование', 'negative', '#8A2BE2', '😞', 'Чувство несбывшихся ожиданий'),
('Нейтральное', 'neutral', '#808080', '😐', 'Обычное, спокойное состояние'),
('Любопытство', 'neutral', '#20B2AA', '🤔', 'Интерес к чему-либо новому'),
('Ожидание', 'neutral', '#FFD700', '⏳', 'Состояние в предвкушении события');

INSERT OR IGNORE INTO Materials (category, title, description, content_type, emotion_type, tags) VALUES
('meditation', 'Дыхание 4-7-8', 'Техника успокаивающего дыхания для снижения тревоги', 'exercise', 'negative', 'тревога,дыхание,релаксация'),
('music', 'Успокаивающие звуки природы', 'Расслабляющие звуки леса и дождя', 'audio', 'negative', 'релаксация,природа,сон'),
('article', 'Как справиться с тревогой', 'Практические советы по управлению тревожными мыслями', 'article', 'negative', 'тревога,советы,психология'),
('music', 'Поднимающие настроение песни', 'Энергичная музыка для улучшения настроения', 'audio', 'negative', 'грусть,музыка,энергия'),
('exercise', 'Техника благодарности', 'Упражнение для фокусировки на позитивных аспектах жизни', 'exercise', 'negative', 'грусть,благодарность,позитив'),
('video', 'Мотивирующая история', 'Вдохновляющая история преодоления трудностей', 'video', 'negative', 'грусть,мотивация,история'),
('meditation', 'Медитация для успокоения', 'Направленная медитация для управления гневом', 'audio', 'negative', 'гнев,медитация,спокойствие'),
('exercise', 'Физическая разрядка', 'Упражнения для снятия напряжения', 'exercise', 'negative', 'гнев,спорт,напряжение'),
('article', 'Конструктивное выражение гнева', 'Как выражать гнев без вреда для отношений', 'article', 'negative', 'гнев,общение,отношения'),
('music', 'Утренняя энергия', 'Бодрящая музыка для начала дня', 'audio', 'positive', 'утро,энергия,бодрость'),
('exercise', 'Дневник успехов', 'Техника ведения дневника достижений', 'exercise', 'positive', 'успех,мотивация,достижения'),
('video', 'Практика осознанности', 'Упражнения для развития осознанности', 'video', 'positive', 'осознанность,медитация,фокус');