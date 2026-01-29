const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');

router.get('/marcas', auth, checkAcceso('c'), controller.getLista);
router.post('/marcas/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax);
router.post('/marcas/getlistaSelectAjax', auth, controller.getListaSelectAjax);
router.post('/marcas/alta', auth, checkAcceso('a'), controller.postAlta);
router.post('/marcas/getByIdAjax', auth, checkAcceso('c'), controller.getById);
router.post('/marcas/modificar', auth, checkAcceso('m'), controller.postModificar);
router.post('/marcas/eliminar', auth, checkAcceso('b'), controller.postEliminar);

module.exports = router