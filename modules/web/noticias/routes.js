const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../../middlewares');


router.get('/web/noticias', controller.getLista);
router.post('/web/noticias/getLista', controller.getListaAjax);


module.exports = router