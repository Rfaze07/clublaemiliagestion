const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/documentacion', auth, checkAcceso('c'), controller.getLista)
router.post('/documentacion/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/documentacion/getlistaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/documentacion/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/documentacion/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/documentacion/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/documentacion/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router