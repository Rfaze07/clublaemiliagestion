const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../../middlewares');

router.get('/web/equipos', controller.getLista);
router.post('/web/equipos/getLista', controller.getListaAjax);

module.exports = router