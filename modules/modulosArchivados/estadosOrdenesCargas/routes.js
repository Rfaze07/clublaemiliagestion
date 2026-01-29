const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/estadosOrdenesCargas', auth, checkAcceso('c'), controller.getLista)
router.post('/estadosOrdenesCargas/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/estadosOrdenesCargas/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/estadosOrdenesCargas/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/estadosOrdenesCargas/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/estadosOrdenesCargas/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router