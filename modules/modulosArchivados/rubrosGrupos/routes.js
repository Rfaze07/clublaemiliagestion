const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/rubrosGrupos', auth, checkAcceso('c'), controller.getLista)
router.post('/rubrosGrupos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/rubrosGrupos/getListaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/rubrosGrupos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/rubrosGrupos/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/rubrosGrupos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/rubrosGrupos/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router