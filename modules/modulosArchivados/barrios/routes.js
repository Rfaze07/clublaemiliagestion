const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');




router.get('/barrios', auth, checkAcceso('c'), controller.getBarrios);
router.post('/barrios/listaAjax', auth, checkAcceso('c'), controller.getListaBarrios);
router.post('/barrios/alta', auth, checkAcceso('a'), controller.postAlta);
router.post('/barrios/localidades', auth, checkAcceso('c'), controller.getLocalidadesByProvincia)
router.get('/barrios/modificar/:id', auth, checkAcceso('c'), controller.getBarrioById);
router.post('/barrios/update', auth, checkAcceso('m'), controller.update);
router.post('/barrios/borrar', auth, checkAcceso('b'), controller.borrar);




module.exports = router