const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/cargarHoras', auth, checkAcceso('c'), controller.getLista)
router.post('/cargarHoras/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/cargarHoras/listaEstadosActivosAjaxSelect', auth, controller.getListaEstadosActivosAjaxSelect)
router.post('/cargarHoras/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/cargarHoras/getByIdAjax', auth, checkAcceso('c'), controller.getById)
// router.post('/cargarHoras/modificar', auth, checkAcceso('m'), controller.postModificar)
// router.post('/cargarHoras/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router