const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/rubros', auth, checkAcceso('c'), controller.getLista)
router.post('/rubros/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/rubros/getListaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/rubros/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/rubros/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/rubros/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/rubros/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router