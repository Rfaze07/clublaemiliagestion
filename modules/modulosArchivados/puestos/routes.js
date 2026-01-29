const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');

router.get('/puestos', auth, checkAcceso('c'), controller.getLista);
router.post('/puestos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax);
router.post('/puestos/getListaSelectAjax', auth, controller.getListaSelectAjax);
router.post('/puestos/alta', auth, checkAcceso('a'), controller.postAlta);
router.post('/puestos/getByIdAjax', auth, checkAcceso('c'), controller.getById);
router.post('/puestos/modificar', auth, checkAcceso('m'), controller.postModificar);
router.post('/puestos/eliminar', auth, checkAcceso('b'), controller.postEliminar);

module.exports = router