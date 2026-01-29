const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


// ORDENES DE PAGOS
router.get('/ordenesPagos', auth, checkAcceso('c'), controller.getLista)
router.post('/ordenesPagos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/ordenesPagos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/ordenesPagos/getByIdAjax', auth, checkAcceso('c'), controller.getOrdePagoById)
router.post('/ordenesPagos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/ordenesPagos/ver', auth, checkAcceso('c'), controller.postVer)
router.post('/ordenesPagos/imprimir', auth, checkAcceso('c'), controller.postImprimir)
router.get('/ordenesPagos/imprimir', auth, checkAcceso('c'), controller.getImprimir)
router.post('/ordenesPagos/eliminar', auth, checkAcceso('b'), controller.postEliminar)


// ORDENES DE PAGOS - DETALLE
router.get('/ordenesPagos/detalles/:id', auth, checkAcceso('c'), controller.getAltaItems)
// router.post('/ordenesPagos/detalles', auth, checkAcceso('a'), controller.postAltaItems)
router.post('/ordenesPagos/blindar', auth, checkAcceso('m'), controller.postBlindar)
router.post('/ordenesPagos/desblindar', auth, checkAcceso('m'), controller.postDesblindar)

// ORDENES DE PAGOS - COMPROBANTES
router.post('/ordenesPagos/comprobantesListaAjax', auth, checkAcceso('c'), controller.getComprobantesListaAjax)
router.post('/ordenesPagos/getComprobantesTitulo', auth, checkAcceso('c'), controller.getComprobanteById)
router.post('/ordenesPagos/altaComprobantes', auth, checkAcceso('a'), controller.postAltaComprobantes)
router.post('/ordenesPagos/eliminarComprobante', auth, checkAcceso('b'), controller.postEliminarComprobante)

// ORDENES DE PAGOS - MEDIOS DE PAGOS
router.post('/ordenesPagos/mediosPagosListaAjax', auth, checkAcceso('c'), controller.getMediosPagosListaAjax)
router.post('/ordenesPagos/altaMediosPagos', auth, checkAcceso('a'), controller.postAltaMediosPagos)
router.post('/ordenesPagos/eliminarMediosPagos', auth, checkAcceso('b'), controller.postEliminarMedioPago)
router.post('/ordenesPagos/totalesAjax', auth, checkAcceso('c'), controller.getTotalesByIdOrdenPago)


module.exports = router