const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');


router.get('/choferes', auth, checkAcceso('c'), controller.getChoferes);
router.post('/choferes/localidades', auth, checkAcceso('c'), controller.getLocalidadesByProvincia)
router.post('/choferes/listaAjax', auth, checkAcceso('c'), controller.getListaChoferes);
router.post('/choferes/alta', auth, checkAcceso('a'), controller.postAlta);
router.get('/choferes/modificar/:id', checkAcceso('c'), auth, controller.getChoferById);
router.post('/choferes/update', auth, checkAcceso('m'), controller.update);
router.post('/choferes/borrar', auth, checkAcceso('b'), controller.borrar);


module.exports = router