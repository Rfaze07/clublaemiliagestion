const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/tiposvehiculos', auth, checkAcceso('c'), controller.getLista)
router.post('/tiposvehiculos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/tiposvehiculos/getlistaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/tiposvehiculos/getTipoSeleccionadoAjax', auth, controller.getTipoSeleccionadoAjax)
router.post('/tiposvehiculos/getTipoSeleccionadoParamAjax', auth, controller.getTipoSeleccionadoParamAjax)
router.post('/tiposvehiculos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/tiposvehiculos/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/tiposvehiculos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/tiposvehiculos/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router