const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/ordenesTrabajosNovedades', auth, checkAcceso('c'), controller.getLista)
router.post('/ordenesTrabajosNovedades/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/ordenesTrabajosNovedades/getlistaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/ordenesTrabajosNovedades/getListaNovedadesVehiculo', auth, controller.getListaSelectAjax)
router.post('/ordenesTrabajosNovedades/getListaByVehiculo', auth, controller.getListaByVehiculo)
router.post('/ordenesTrabajosNovedades/getListaByVehiculoSinOT', auth, controller.getListaByVehiculoSinOT)
router.post('/ordenesTrabajosNovedades/alta', auth, checkAcceso('a'), controller.postAlta)
//router.post('/ordenesTrabajosNovedades/getByIdAjax', auth, checkAcceso('c'), controller.getById)
//router.post('/ordenesTrabajosNovedades/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/ordenesTrabajosNovedades/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router