const router = require('express').Router();
const { getRecommendation } = require('../controllers/recommendation.controller');

router.get('/', getRecommendation);

