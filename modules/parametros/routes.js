const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');


router.get('/parametros', auth, checkAcceso('c'), controller.getLista);
router.post('/parametros/getListaAjax', auth, checkAcceso('c'), controller.getListaAjax);
router.post('/parametros/getByIdAjax', auth, checkAcceso('c'), controller.getByIdAjax);
router.post('/parametros/modificar', auth, checkAcceso('m'), controller.modificar);


module.exports = router;
