const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');


router.get('/deportes', auth, checkAcceso('c'), controller.getLista);
router.post('/deportes/getListaAjax', auth, checkAcceso('c'), controller.getListaAjax);
router.post('/deportes/getByIdAjax', auth, checkAcceso('c'), controller.getByIdAjax);
router.post('/deportes/alta', auth, checkAcceso('a'), controller.alta);
router.post('/deportes/modificar', auth, checkAcceso('m'), controller.modificar);
router.post('/deportes/eliminar', auth, checkAcceso('b'), controller.eliminar);



module.exports = router