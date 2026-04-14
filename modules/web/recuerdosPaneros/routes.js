const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../../middlewares');


router.get('/web/recuerdosPaneros', controller.getLista);
router.post('/web/recuerdosPaneros/getLista', controller.getListaAjax);


module.exports = router