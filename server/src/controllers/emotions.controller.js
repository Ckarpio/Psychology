
const emotionsRepo = require('../repositories/emotions.repo');

async function getAllEmotions(req, res) {
  const dbResult = emotionsRepo.getAllEmotions();
  res.json(dbResult);
}

console.log('getAllEmotions type:', typeof getAllEmotions); 

module.exports = { getAllEmotions }; 