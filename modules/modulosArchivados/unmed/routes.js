const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');

router.get('/unmed', auth, checkAcceso('c'), controller.getLista);
router.post('/unmed/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax);
router.post('/unmed/getlistaSelectAjax', auth, checkAcceso('c'), controller.getListaSelectAjax);
router.post('/unmed/alta', auth, checkAcceso('a'), controller.postAlta);
router.post('/unmed/getByIdAjax', auth, checkAcceso('c'), controller.getById);
router.post('/unmed/modificar', auth, checkAcceso('m'), controller.postModificar);
router.post('/unmed/eliminar', auth, checkAcceso('b'), controller.postEliminar);

module.exports = router