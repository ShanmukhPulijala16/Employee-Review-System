const express = require('express');
const router = express.Router();

router.use('/', require('./users'));
router.use('/review',  require('./reviews'));

module.exports = router;