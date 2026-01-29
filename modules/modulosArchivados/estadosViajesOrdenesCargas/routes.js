const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/estadosViajesOrdenesCargas', auth, checkAcceso('c'), controller.getLista)
router.post('/estadosViajesOrdenesCargas/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/estadosViajesOrdenesCargas/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/estadosViajesOrdenesCargas/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/estadosViajesOrdenesCargas/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/estadosViajesOrdenesCargas/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router