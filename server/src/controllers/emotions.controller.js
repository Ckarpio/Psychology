const emotionsRepo = require('../repositories/emotions.repo');

async function getAllEmotions(req, res) {
  const dbResult = emotionsRepo.getAllEmotions();
  res.json(dbResult);
}

module.exports = { getAllEmotions };
