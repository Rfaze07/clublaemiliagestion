const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');


router.get('/empleados', auth, checkAcceso('c'), controller.getLista)
router.post('/empleados/listaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/empleados/listaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/empleados/listaChoferesSelectAjax', auth, controller.getChoferesSelectAjax)
router.post('/empleados/listaEmpleadosSelectAjax', auth, controller.getEmpleadosSelectAjax)
router.post('/empleados/listaEmpleadosPuestoSelectAjax', auth, controller.getEmpleadosPuestoSelectAjax)
router.post('/empleados/getLastNroLegajo', auth, checkAcceso('c'), controller.getLastNroLegajoAjax)
router.post('/empleados/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/empleados/getModificar', auth, checkAcceso('c'), controller.getModificar)
router.post('/empleados/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/empleados/ver', auth, checkAcceso('c'), controller.postVer)
router.post('/empleados/borrar', auth, checkAcceso('b'), controller.postBorrar)

module.exports = router