const recommendationService = require('../services/recommendation.service');

async function getRecommendation(req, res) {
  const emotion = String(req.query.emotion || '').trim();

  if (!emotion) 
    return res.status(400).json({ error: 'Параметр emotion является обязательным' });

  try {
    const result = recommendationService.getDailyRecommendation(emotion);
    return res.json(result);
  } catch (e) {
    if (e.code === 'NOT_FOUND') 
        return res.status(404).json({ error: e.message });
    console.log('Error: ', e.message)
    return res.status(500).json({ error: 'Внутренняя ошибка' });
  }
}

module.exports = { getRecommendation };