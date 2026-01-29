const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/categorias', auth, checkAcceso('c'), controller.getLista)
router.post('/categorias/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/categorias/getListaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/categorias/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/categorias/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/categorias/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/categorias/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router