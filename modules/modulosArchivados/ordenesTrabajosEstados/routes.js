const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


// router.get('/ordenesTrabajosEstados', auth, checkAcceso('c'), controller.getLista)
// router.post('/ordenesTrabajosEstados/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/ordenesTrabajosEstados/getListaSelectAjax', auth, controller.getListaSelectAjax)
// router.post('/ordenesTrabajosEstados/alta', auth, checkAcceso('a'), controller.postAlta)
// router.post('/ordenesTrabajosEstados/getByIdAjax', auth, checkAcceso('c'), controller.getById)
// router.post('/ordenesTrabajosEstados/modificar', auth, checkAcceso('m'), controller.postModificar)
// router.post('/ordenesTrabajosEstados/eliminar', auth, checkAcceso('b'), controller.postEliminar)


module.exports = router