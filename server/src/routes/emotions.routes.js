
const router = require('express').Router();
const { getAllEmotions } = require('../controllers/emotions.controller');

router.get('/', getAllEmotions);

module.exports = router;