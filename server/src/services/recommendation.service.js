const emotionsRepo = require('../repositories/emotions.repo');
const picksRepo = require('../repositories/picks.repo');
const contentRepo = require('../repositories/content.repo');

function todayKey() {
  return new Intl.DateTimeFormat('en-CA').format(new Date());
}

const CONTENT_TYPES = ['music', 'video', 'image', 'exercise', 'article'];

const RESPONSE_KEYS = {
  music: 'music',
  video: 'video',
  image: 'images',
  exercise: 'exercises',
  article: 'articles',
};

function pickForType(emotion, date, type) {
  // 1) Уже выбрано на этот день и тип?
  const pickedId = picksRepo.getPickedItemId(emotion, date, type);
  if (pickedId) return contentRepo.getById(pickedId);

  // 2) Выбираем контент: сначала который ещё ни разу не выдавался
  let next = contentRepo.getNeverPickedByEmotionType(emotion, type);
  if (!next) next = contentRepo.getAnyActiveByEmotionType(emotion, type);
  if (!next) return null;

  // 3) Пытаемся записать выбор
  try {
    picksRepo.savePick(emotion, date, type, next.id);
    return next;
  } catch (e) {
    // если не получилось записать (скорее всего уже записали) — читаем что записано
    const id = picksRepo.getPickedItemId(emotion, date, type);
    return id ? contentRepo.getById(id) : next;
  }
}

function getDailyRecommendation(emotion) {
  const emo = emotionsRepo.getEmotionByCode(emotion);
  if (!emo) {
    const err = new Error('Неизвестный код эмоции');
    err.code = 'NOT_FOUND';
    throw err;
  }

  const date = todayKey();

  const material = {
    music: [],
    video: [],
    images: [],
    exercises: [],
    articles: [],
  };

  for (const type of CONTENT_TYPES) {
    const item = pickForType(emotion, date, type);
    if (item) {
      material[RESPONSE_KEYS[type]].push(item);
    }
  }

  return { date, emotion: emo, material };
}

module.exports = { getDailyRecommendation };
