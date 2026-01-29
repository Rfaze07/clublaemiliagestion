const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');

router.get('/enfermedades', auth, checkAcceso('c'), controller.getLista);
router.post('/enfermedades/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax);
router.post('/enfermedades/getlistaSelectAjax', auth, controller.getListaSelectAjax);
router.post('/enfermedades/alta', auth, checkAcceso('a'), controller.postAlta);
router.post('/enfermedades/getByIdAjax', auth, checkAcceso('c'), controller.getById);
router.post('/enfermedades/modificar', auth, checkAcceso('m'), controller.postModificar);
router.post('/enfermedades/eliminar', auth, checkAcceso('b'), controller.postEliminar);

module.exports = router