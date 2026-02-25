/*
 * =====================================================================
 * seed.js — ЗАПОЛНЕНИЕ БАЗЫ ДАННЫХ ТЕСТОВЫМИ ДАННЫМИ
 * =====================================================================
 *
 * Этот файл запускается командой "npm run seed" (из терминала).
 * Его задача — заполнить пустую базу данных начальными данными:
 *   - 14 эмоций (8 негативных + 6 позитивных)
 *   - 70 материалов (по 5 на каждую эмоцию: музыка, видео, картинка,
 *     упражнение, статья)
 *
 * "Seed" в переводе — "семена". Мы как бы "засеиваем" базу данных.
 *
 * Этот файл можно запускать повторно — он не создаст дубликатов,
 * а обновит существующие записи (благодаря ON CONFLICT ... DO UPDATE).
 * =====================================================================
 */

// ─── Шаг 1: Подключаем функции для работы с базой ──────────────────
// getDb — получить подключение к базе данных
// initDb — создать подключение и таблицы (если ещё не созданы)
const { getDb, initDb } = require('./index');

// ─── Шаг 2: Функция для заполнения таблицы emotions ─────────────────
// Принимает объект db (подключение к базе данных)
function seedEmotions(db) {

  // Создаём массив объектов — каждый объект это одна эмоция.
  // Каждый объект содержит поля, которые соответствуют колонкам в таблице emotions:
  //   code        — уникальный код (на английском)
  //   label       — название (на русском)
  //   effect      — тип: "negative" (негативная) или "positive" (позитивная)
  //   color       — цвет для интерфейса
  //   ico         — иконка (пока пустая строка)
  //   description — описание эмоции на русском языке
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

  // ─── Подготавливаем SQL-запрос ──────────────────────────────────
  // db.prepare() — подготавливает SQL-запрос для многоразового использования.
  //
  // Зачем подготавливать? Если нам нужно вставить 14 записей,
  // эффективнее подготовить запрос один раз и вызывать его 14 раз,
  // чем каждый раз создавать новый запрос.
  //
  // INSERT INTO emotions(...) VALUES (...) — вставляет новую строку в таблицу.
  //
  // @code, @label и т.д. — это ИМЕНОВАННЫЕ ПАРАМЕТРЫ.
  // Они будут заменены на реальные значения из объекта, который мы передадим.
  // Например, когда мы передадим { code: 'anger', label: 'Гнев', ... },
  // @code заменится на 'anger', @label на 'Гнев' и т.д.
  //
  // ON CONFLICT(code) DO UPDATE SET ... — если запись с таким code уже есть,
  // НЕ выдаёт ошибку, а ОБНОВЛЯЕТ существующую запись новыми данными.
  // excluded.label — это значение, которое мы пытались вставить.
  // Это позволяет безопасно запускать seed повторно.
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

  // ─── Выполняем запрос в транзакции ──────────────────────────────
  // db.transaction() — создаёт транзакцию.
  //
  // Транзакция — это группа операций, которые выполняются "всё или ничего":
  //   - Если все 14 вставок прошли успешно — все данные сохранятся
  //   - Если хотя бы одна вставка упала с ошибкой — ВСЕ отменятся
  // Это защищает от ситуации, когда половина данных вставилась, а половина нет.
  //
  // Также транзакция работает БЫСТРЕЕ: без неё SQLite создаёт отдельную
  // транзакцию для каждой вставки (14 транзакций). С ней — одна транзакция на все 14.
  //
  // emotions.forEach(e => stmt.run(e)) — проходим по каждой эмоции в массиве
  // и выполняем подготовленный запрос, передавая объект эмоции.
  // stmt.run(e) — подставляет значения из объекта e в @code, @label и т.д.
  const tx = db.transaction(() => emotions.forEach(e => stmt.run(e)));

  // tx() — запускаем транзакцию. Все 14 вставок выполнятся за один раз.
  tx();

  // Возвращаем массив эмоций — он понадобится в seedContent(),
  // чтобы создать контент для каждой эмоции.
  return emotions;
}

// ─── Шаг 3: Функция для заполнения таблицы content_items ────────────
// Принимает db (подключение) и emotions (массив эмоций из seedEmotions)
function seedContent(db, emotions) {

  // Специальная картинка для эмоции "любовь" — в качестве примера,
  // что контент можно настроить индивидуально для каждой эмоции.
  const imageDemo = {
    love: {
      title: 'Связь сердец',
      subtitle: 'Визуализация любви и тепла',
      image_url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400'
    }
  };

  // Пустой массив, куда мы будем складывать все материалы
  const items = [];

  // ─── Цикл по всем эмоциям ──────────────────────────────────────
  // for...of — проходим по каждой эмоции.
  // Для каждой эмоции создаём 5 материалов (по одному на каждый тип).
  for (const e of emotions) {

    // MUSIC — музыкальный материал
    // items.push({...}) — добавляем новый объект в конец массива items.
    items.push({
      emotion_code: e.code,       // привязываем к текущей эмоции
      type: 'music',              // тип: музыка
      title: `Плейлист: ${e.label}`,  // шаблонная строка с названием эмоции
      subtitle: 'Спокойная музыка на 10–15 минут',
      url: 'https://example.com/music',  // ссылка-заглушка (пока не настоящая)
      image_url: null,            // null означает "нет значения"
      body: 'Включи музыку и попробуй 2 минуты просто слушать, не делая ничего.'
    });

    // VIDEO — видео-материал
    items.push({
      emotion_code: e.code,
      type: 'video',
      title: `Видео: ${e.label}`,
      subtitle: 'Короткое видео-поддержка',
      url: 'https://example.com/video',
      image_url: null,
      body: 'Подойдёт любой короткий ролик с дыханием/релаксацией/мотивацией.'
    });

    // IMAGE — картинка
    // Проверяем: есть ли для этой эмоции специальная картинка в imageDemo?
    const img = imageDemo[e.code];  // img будет undefined если эмоции нет в imageDemo
    items.push({
      emotion_code: e.code,
      type: 'image',
      // Тернарный оператор: условие ? значение_если_да : значение_если_нет
      // Если img существует — используем его данные, иначе — данные по умолчанию.
      title: img ? img.title : `Картинка: ${e.label}`,
      subtitle: img ? img.subtitle : 'Найди 3 детали на изображении и опиши их',
      url: null,
      image_url: img ? img.image_url : 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60',
      body: 'Сфокусируй внимание на деталях — это помогает "заземлиться".'
    });

    // EXERCISE — упражнение
    items.push({
      emotion_code: e.code,
      type: 'exercise',
      title: 'Дыхание 4-4-6',
      subtitle: 'Быстрое упражнение на 1 минуту',
      url: null,
      image_url: null,
      body: 'Вдох 4 сек → задержка 4 → выдох 6. Повтори 5 раз.'
    });

    // ARTICLE — статья
    items.push({
      emotion_code: e.code,
      type: 'article',
      title: `Как справляться: ${e.label}`,
      subtitle: 'Короткие советы',
      url: 'https://example.com/article',
      image_url: null,
      // В body используем описание эмоции + добавляем совет.
      // \n\n — два переноса строки (пустая строка между абзацами).
      body: `${e.description}\n\nИдея на сегодня: выбери один маленький шаг, который поможет тебе почувствовать себя чуть лучше.`
    });
  }

  // ─── Подготавливаем SQL-запрос для вставки контента ──────────────
  // Аналогично seedEmotions, но для таблицы content_items.
  //
  // ON CONFLICT(emotion_code, type, title) — если уже есть запись
  // с такой же эмоцией, типом и заголовком (уникальный индекс из schema.js),
  // обновляем остальные поля вместо ошибки.
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

  // Выполняем все вставки в одной транзакции (быстро и безопасно).
  const tx = db.transaction(() => items.forEach(i => stmt.run(i)));
  tx();
}

// ─── Шаг 4: Главная функция ────────────────────────────────────────
// main() — собирает всё вместе и запускает заполнение.
function main() {
  // Инициализируем базу данных (создаём таблицы если их нет)
  initDb();

  // Получаем подключение к базе
  const db = getDb();

  // Заполняем таблицу emotions и получаем массив эмоций обратно
  const emotions = seedEmotions(db);

  // Заполняем таблицу content_items (используем массив эмоций)
  seedContent(db, emotions);

  // ─── Проверяем результат ──────────────────────────────────────
  // db.prepare(`SELECT COUNT(*) AS c FROM emotions`).get()
  //   — выполняет SQL-запрос, который считает количество строк в таблице.
  //
  // COUNT(*) — SQL-функция "посчитай все строки".
  // AS c — даёт результату имя "c" (сокращение от count).
  // .get() — возвращает одну строку результата в виде объекта { c: 14 }.
  // .c — берём значение поля "c" из этого объекта.
  const emoCount = db.prepare(`SELECT COUNT(*) AS c FROM emotions`).get().c;
  const contentCount = db.prepare(`SELECT COUNT(*) AS c FROM content_items`).get().c;

  // Выводим в консоль сколько записей создано, чтобы убедиться что всё ОК.
  console.log(`Seed done. emotions=${emoCount}, content_items=${contentCount}`);
}

// ─── Шаг 5: Запускаем ──────────────────────────────────────────────
// Вызываем main() — это единственная строка, которая реально выполняется
// при запуске файла через "npm run seed" (node src/db/seed.js).
// Всё остальное выше — это определения функций, которые ждут вызова.
main();
