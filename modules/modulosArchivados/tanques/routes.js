const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/tanques', auth, checkAcceso('c'), controller.getLista)
router.post('/tanques/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/tanques/getListaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/tanques/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/tanques/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/tanques/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/tanques/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router