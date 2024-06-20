const express = require('express');
const router = express.Router();
const reviewControllers = require('../controllers/reviewControllers');

router.post('/assign-review/:id', reviewControllers.assignReview);
router.post('/create/:id', reviewControllers.createReview);
router.post('/update-review/:id', reviewControllers.updateReview);

module.exports = router;