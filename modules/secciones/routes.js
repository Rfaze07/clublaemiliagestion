const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');


router.get('/secciones', auth, checkAcceso('c'), controller.getLista);
router.post('/secciones/getListaAjax', auth, checkAcceso('c'), controller.getListaAjax);
router.post('/secciones/getByIdAjax', auth, checkAcceso('c'), controller.getByIdAjax);
router.post('/secciones/alta', auth, checkAcceso('a'), controller.alta);
router.post('/secciones/modificar', auth, checkAcceso('m'), controller.modificar);
router.post('/secciones/eliminar', auth, checkAcceso('b'), controller.eliminar);

router.post('/secciones/subsecciones/getBySeccionIdAjax', auth, checkAcceso('c'), controller.getSubSeccionesBySeccionIdAjax);
router.post('/secciones/subsecciones/alta', auth, checkAcceso('a'), controller.altaSubSeccion);
router.post('/secciones/subsecciones/modificar', auth, checkAcceso('m'), controller.modificarSubSeccion);
router.post('/secciones/subsecciones/eliminar', auth, checkAcceso('b'), controller.eliminarSubSeccion);


module.exports = router;