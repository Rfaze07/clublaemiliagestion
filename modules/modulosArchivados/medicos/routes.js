const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/medicos', auth, checkAcceso('c'), controller.getLista)
router.post('/medicos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/medicos/getlistaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/medicos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/medicos/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/medicos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/medicos/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router