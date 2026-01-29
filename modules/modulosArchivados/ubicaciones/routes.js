const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


// router.get('/ubicaciones', auth, checkAcceso('c'), controller.getLista)
// router.post('/ubicaciones/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/ubicaciones/getListaSelectAjax', auth, controller.getListaSelectAjax)
// router.post('/ubicaciones/alta', auth, checkAcceso('a'), controller.postAlta)
// router.post('/ubicaciones/getByIdAjax', auth, checkAcceso('c'), controller.getById)
// router.post('/ubicaciones/modificar', auth, checkAcceso('m'), controller.postModificar)
// router.post('/ubicaciones/eliminar', auth, checkAcceso('b'), controller.postEliminar)


module.exports = router