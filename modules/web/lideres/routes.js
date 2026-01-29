const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../../middlewares');
 
router.get('/web/lideres', controller.getLista);/*aca*/ 
router.post('/web/lideres/getLista', controller.getListaAjax);


module.exports = router