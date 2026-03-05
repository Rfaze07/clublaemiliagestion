
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');


router.get('/quejas', auth, checkAcceso('c'), controller.getLista);
router.post('/quejas/getListaAjax', auth, checkAcceso('c'), controller.getListaAjax);
router.post('/quejas/getByIdAjax', auth, checkAcceso('c'), controller.getByIdAjax);
router.post('/quejas/updateEstado', auth, checkAcceso('c'), controller.updateEstado);


module.exports = router