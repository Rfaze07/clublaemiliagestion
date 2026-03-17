
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');


router.get('/Solicitudes', auth, checkAcceso('c'), controller.getLista);
router.post('/Solicitudes/getListaAjax', auth, checkAcceso('c'), controller.getListaAjax);
router.post('/Solicitudes/getByIdAjax', auth, checkAcceso('c'), controller.getByIdAjax);


module.exports = router