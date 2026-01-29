const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../../middlewares');


router.get('/', controller.getLista);
router.get('/web', controller.getLista);

module.exports = router