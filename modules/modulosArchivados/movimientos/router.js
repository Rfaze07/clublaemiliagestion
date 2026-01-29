const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/movimientos', auth, checkAcceso('c'), controller.getLista)
router.post('/movimientos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/movimientos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/movimientos/baja', auth, checkAcceso('b'), controller.postDelete)
router.get('/movimientos/altaItems/:id', auth, checkAcceso('c'), controller.getAltaItems)
router.post('/movimientos/blindar', auth, checkAcceso('m'), controller.postBlindar)
router.post('/movimientos/desblindar', auth, checkAcceso('m'), controller.postDesblindar)

router.post('/movimientos/getListaProductosAjax', auth, checkAcceso('c'), controller.getListaProductosAjax)
router.post('/movimientos/altaProductos', auth, checkAcceso('a'), controller.postAltaProductos)
router.post('/movimientos/eliminarDetalle', auth, checkAcceso('b'), controller.postEliminarDetalle)

module.exports = router