const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/equipos', auth, checkAcceso('c'), controller.getLista)
router.post('/equipos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/equipos/getListaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/equipos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/equipos/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/equipos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/equipos/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router