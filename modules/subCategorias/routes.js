const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');

router.get('/subCategorias', auth, checkAcceso('c'), controller.getLista);
router.post('/subCategorias/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax);
router.post('/subCategorias/getListaSelectAjax', auth, controller.getListaSelectAjax);
router.post('/subCategorias/alta', auth, checkAcceso('a'), controller.postAlta);
router.post('/subCategorias/getByIdAjax', auth, checkAcceso('c'), controller.getById);
router.post('/subCategorias/modificar', auth, checkAcceso('m'), controller.postModificar);
router.post('/subCategorias/eliminar', auth, checkAcceso('b'), controller.postEliminar);

module.exports = router;
 