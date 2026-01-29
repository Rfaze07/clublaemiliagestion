const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


// router.get('/tiposMovimientos', auth, checkAcceso('c'), controller.getLista)
// router.post('/tiposMovimientos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/tiposMovimientos/getListaSelectAjax', auth, controller.getListaSelectAjax)
// router.post('/tiposMovimientos/alta', auth, checkAcceso('a'), controller.postAlta)
// router.post('/tiposMovimientos/getByIdAjax', auth, checkAcceso('c'), controller.getById)
// router.post('/tiposMovimientos/modificar', auth, checkAcceso('m'), controller.postModificar)
// router.post('/tiposMovimientos/eliminar', auth, checkAcceso('b'), controller.postEliminar)


module.exports = router