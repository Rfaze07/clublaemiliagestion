const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');

router.get('/mediospagos', auth, checkAcceso('c'), controller.getLista);
router.post('/mediospagos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax);
router.post('/mediospagos/getListaActivosAjaxSelect', auth, controller.getListaActivosAjaxSelect);  
router.post('/mediospagos/alta', auth, checkAcceso('a'), controller.postAlta);
router.post('/mediospagos/getByIdAjax', auth, checkAcceso('c'), controller.getById);
router.post('/mediospagos/modificar', auth, checkAcceso('m'), controller.postModificar);
router.post('/mediospagos/eliminar', auth, checkAcceso('b'), controller.postEliminar);

module.exports = router