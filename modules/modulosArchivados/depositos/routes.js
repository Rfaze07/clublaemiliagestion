const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');

router.get('/depositos', auth, checkAcceso('c'), controller.getLista);
router.post('/depositos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax);
router.post('/depositos/getListaSelectAjax', auth, controller.getListaSelectAjax);
router.post('/depositos/alta', auth, checkAcceso('a'), controller.postAlta);
router.post('/depositos/getByIdAjax', auth, checkAcceso('c'), controller.getById);
router.post('/depositos/modificar', auth, checkAcceso('m'), controller.postModificar);
router.post('/depositos/eliminar', auth, checkAcceso('b'), controller.postEliminar);

module.exports = router