const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/vencimientos', auth, checkAcceso('c'), controller.getLista)
router.post('/vencimientos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/vencimientos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/vencimientos/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/vencimientos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/vencimientos/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router