const { getDb, initDb } = require('./index');

function seedEmotions(db) {
  const emotions = [
    // negative
    { code:'anger', label:'Гнев', effect:'negative', color:'orange', ico:'', description:'Гнев — это энергия. Он показывает, что границы были нарушены. Важно выражать его конструктивно.' },
    { code:'sadness', label:'Грусть', effect:'negative', color:'blue', ico:'', description:'Грусть помогает проживать потери и изменения. Это нормально — чувствовать её.' },
    { code:'apathy', label:'Апатия', effect:'negative', color:'slate', ico:'', description:'Апатия — сигнал о перегрузке или выгорании. Тело просит отдыха и восстановления.' },
    { code:'loneliness', label:'Одиночество', effect:'negative', color:'indigo', ico:'', description:'Одиночество говорит о важности связи с другими. Есть способы справиться.' },
    { code:'anxiety', label:'Тревога', effect:'negative', color:'teal', ico:'', description:'Тревога — реакция на неопределенность. Она временна, и есть инструменты, чтобы облегчить состояние.' },
    { code:'fear', label:'Страх', effect:'negative', color:'violet', ico:'', description:'Страх — защитная эмоция. Можно научиться снижать его интенсивность.' },
    { code:'stress', label:'Стресс', effect:'negative', color:'purple', ico:'', description:'Стресс — сигнал, что организму нужна поддержка. Маленькие шаги реально помогают.' },
    { code:'panic', label:'Паника', effect:'negative', color:'rose', ico:'', description:'Паника — интенсивная волна страха. Она проходит, даже если кажется иначе.' },

    // positive
    { code:'joy', label:'Радость', effect:'positive', color:'yellow', ico:'', description:'Радость важно замечать и закреплять — это укрепляет устойчивость.' },
    { code:'love', label:'Любовь', effect:'positive', color:'pink', ico:'', description:'Любовь — про связь, заботу и принятие.' },
    { code:'inspiration', label:'Вдохновение', effect:'positive', color:'cyan', ico:'', description:'Вдохновение — искра для творчества и мотивации.' },
    { code:'calmness', label:'Спокойствие', effect:'positive', color:'lime', ico:'', description:'Спокойствие помогает яснее думать и лучше справляться со стрессом.' },
    { code:'gratitude', label:'Благодарность', effect:'positive', color:'green', ico:'', description:'Благодарность помогает видеть хорошее и укрепляет связи с другими.' },
    { code:'confidence', label:'Уверенность', effect:'positive', color:'emerald', ico:'', description:'Уверенность — вера в свои силы. Её можно развивать через практику.' },
  ];

  const stmt = db.prepare(`
    INSERT INTO emotions(code,label,effect,color,ico,description)
    VALUES (@code,@label,@effect,@color,@ico,@description)
    ON CONFLICT(code) DO UPDATE SET
      label=excluded.label,
      effect=excluded.effect,
      color=excluded.color,
      ico=excluded.ico,
      description=excluded.description
  `);

  const tx = db.transaction(() => emotions.forEach(e => stmt.run(e)));
  tx();

  return emotions;
}

function seedContent(db, emotions) {

  const imageDemo = {
    love: {
      title: 'Связь сердец',
      subtitle: 'Визуализация любви и тепла',
      image_url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400'
    }
  };

  const items = [];

  for (const e of emotions) {
    // MUSIC
    items.push({
      emotion_code: e.code,
      type: 'music',
      title: `Плейлист: ${e.label}`,
      subtitle: 'Спокойная музыка на 10–15 минут',
      url: 'https://example.com/music',
      image_url: null,
      body: 'Включи музыку и попробуй 2 минуты просто слушать, не делая ничего.'
    });

    // VIDEO
    items.push({
      emotion_code: e.code,
      type: 'video',
      title: `Видео: ${e.label}`,
      subtitle: 'Короткое видео-поддержка',
      url: 'https://example.com/video',
      image_url: null,
      body: 'Подойдёт любой короткий ролик с дыханием/релаксацией/мотивацией.'
    });

    // IMAGE
    const img = imageDemo[e.code];
    items.push({
      emotion_code: e.code,
      type: 'image',
      title: img ? img.title : `Картинка: ${e.label}`,
      subtitle: img ? img.subtitle : 'Найди 3 детали на изображении и опиши их',
      url: null,
      image_url: img ? img.image_url : 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60',
      body: 'Сфокусируй внимание на деталях — это помогает “заземлиться”.'
    });

    // EXERCISE
    items.push({
      emotion_code: e.code,
      type: 'exercise',
      title: 'Дыхание 4-4-6',
      subtitle: 'Быстрое упражнение на 1 минуту',
      url: null,
      image_url: null,
      body: 'Вдох 4 сек → задержка 4 → выдох 6. Повтори 5 раз.'
    });

    // ARTICLE
    items.push({
      emotion_code: e.code,
      type: 'article',
      title: `Как справляться: ${e.label}`,
      subtitle: 'Короткие советы',
      url: 'https://example.com/article',
      image_url: null,
      body: `${e.description}\n\nИдея на сегодня: выбери один маленький шаг, который поможет тебе почувствовать себя чуть лучше.`
    });
  }

  const stmt = db.prepare(`
    INSERT INTO content_items(emotion_code, type, title, subtitle, url, image_url, body, is_active)
    VALUES (@emotion_code, @type, @title, @subtitle, @url, @image_url, @body, 1)
    ON CONFLICT(emotion_code, type, title) DO UPDATE SET
      subtitle=excluded.subtitle,
      url=excluded.url,
      image_url=excluded.image_url,
      body=excluded.body,
      is_active=1
  `);

  const tx = db.transaction(() => items.forEach(i => stmt.run(i)));
  tx();
}

function main() {
  initDb();
  const db = getDb();

  const emotions = seedEmotions(db);
  seedContent(db, emotions);

  const emoCount = db.prepare(`SELECT COUNT(*) AS c FROM emotions`).get().c;
  const contentCount = db.prepare(`SELECT COUNT(*) AS c FROM content_items`).get().c;

  console.log(`Seed done. emotions=${emoCount}, content_items=${contentCount}`);
}

main();
