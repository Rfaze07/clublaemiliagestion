const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/repuestos', auth, checkAcceso('c'), controller.getLista)
router.post('/repuestos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/repuestos/getlistaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/repuestos/getVerificoCodigoAjax', auth, checkAcceso('c'), controller.getVerificoCodigoAjax)
router.post('/repuestos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/repuestos/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/repuestos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/repuestos/eliminar', auth, checkAcceso('b'), controller.postEliminar)


module.exports = router