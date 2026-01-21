const router = require('express').Router();

router.use('/emotions', require('./emotions.routes'));
router.use('/recommendation', require('./recommendation.routes'));

module.exports = router;
