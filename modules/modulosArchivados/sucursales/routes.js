const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/sucursales', auth, checkAcceso('c'), controller.getLista)
router.post('/sucursales/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/sucursales/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/sucursales/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/sucursales/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/sucursales/eliminar', auth, checkAcceso('b'), controller.postEliminar)


module.exports = router