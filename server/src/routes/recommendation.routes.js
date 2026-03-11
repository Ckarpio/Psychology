const router = require('express').Router();
const { getRecommendation } = require('../controllers/recommendation.controller');

router.get('/', getRecommendation);

module.exports = router;
// В routes.js должен быть такой маршрут:
router.get('/recommendations/:emotionCode', async (req, res) => {
    
});