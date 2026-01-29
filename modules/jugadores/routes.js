const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/jugadores', auth, checkAcceso('c'), controller.getLista)
router.post('/jugadores/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/jugadores/getListaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/jugadores/getByEquipoAjax', auth, checkAcceso('c'), controller.getByEquipo)
router.post('/jugadores/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/jugadores/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/jugadores/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/jugadores/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router