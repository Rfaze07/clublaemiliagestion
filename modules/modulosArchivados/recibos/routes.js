const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


// RECIBOS
router.get('/recibos', auth, checkAcceso('c'), controller.getLista)
router.post('/recibos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/recibos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/recibos/getByIdAjax', auth, checkAcceso('c'), controller.getReciboById)
router.post('/recibos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/recibos/ver', auth, checkAcceso('c'), controller.postVer)
router.post('/recibos/imprimir', auth, checkAcceso('c'), controller.postImprimir)
router.get('/recibos/imprimir', auth, checkAcceso('c'), controller.getImprimir)
router.post('/recibos/eliminar', auth, checkAcceso('b'), controller.postEliminar)
router.post('/recibos/getNumeracionEmpresa', auth, checkAcceso('c'), controller.getPuntoVentaEmpresaAjax)

// RECIBOS - DETALLE
router.get('/recibos/detalles/:id', auth, checkAcceso('c'), controller.getAltaItems)
// router.post('/recibos/detalles', auth, checkAcceso('a'), controller.postAltaItems)
router.post('/recibos/blindar', auth, checkAcceso('m'), controller.postBlindar)
router.post('/recibos/desblindar', auth, checkAcceso('m'), controller.postDesblindar)

// RECIBOS - COMPROBANTES
router.post('/recibos/comprobantesListaAjax', auth, checkAcceso('c'), controller.getComprobantesListaAjax)
router.post('/recibos/getComprobantesTitulo', auth, checkAcceso('c'), controller.getComprobanteById)
router.post('/recibos/altaComprobantes', auth, checkAcceso('a'), controller.postAltaComprobantes)
router.post('/recibos/eliminarComprobante', auth, checkAcceso('b'), controller.postEliminarComprobante)

// RECIBOS - MEDIOS DE PAGOS
router.post('/recibos/mediosPagosListaAjax', auth, checkAcceso('c'), controller.getMediosPagosListaAjax)
router.post('/recibos/altaMediosPagos', auth, checkAcceso('a'), controller.postAltaMediosPagos)
router.post('/recibos/eliminarMediosPagos', auth, checkAcceso('b'), controller.postEliminarMedioPago)
router.post('/recibos/totalesAjax', auth, checkAcceso('c'), controller.getTotalesByIdOrdenPago)


module.exports = router