const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


/**********************************************
*             COMPROBANTES COMPRAS            *
**********************************************/

router.get('/comprobantesCompras', auth, checkAcceso('c'), controller.getListaCompras)
router.post('/comprobantesCompras/getlistaAjax', auth, checkAcceso('c'), controller.getListaComprasAjax)
router.get('/comprobantesCompras/alta/:id', auth, checkAcceso('a'), controller.getAltaCompras)
router.post('/comprobantesCompras/alta', auth, checkAcceso('a'), controller.postAltaCompras)
router.get('/comprobantesCompras/altaItems/:id', auth, checkAcceso('a'), controller.getAltaItemsCompras)
router.post('/comprobantesCompras/altaItems', auth, checkAcceso('a'), controller.postAltaItemsCompras)
router.post('/comprobantesCompras/getlistaItemsAjax', auth, checkAcceso('c'), controller.getListaComprasItemsAjax)
router.post('/comprobantesCompras/getByIdAjax', auth, checkAcceso('c'), controller.getComprasById)
router.post('/comprobantesCompras/ver', auth, checkAcceso('c'), controller.getVer)
router.post('/comprobantesCompras/modificar', auth, checkAcceso('m'), controller.postModificarCompras)
router.post('/comprobantesCompras/eliminar', auth, checkAcceso('b'), controller.postEliminarCompras)
router.post('/comprobantesCompras/blindar', auth, checkAcceso('m'), controller.postBlindarCompras)
router.post('/comprobantesCompras/desblindar', auth, checkAcceso('m'), controller.postDesblindarCompras)



/**********************************************
*           COMPROBANTES VENTAS               *
**********************************************/
// router.get('/comprobantesVentas', auth, checkAcceso('c'), controller.getListaVentas)
// router.post('/comprobantesVentas/getlistaAjax', auth, checkAcceso('c'), controller.getListaVentasAjax)
// router.get('/comprobantesVentas/alta/:id', auth, checkAcceso('a'), controller.getAltaVentas)
// router.post('/comprobantesVentas/alta', auth, checkAcceso('a'), controller.postAltaVentas)
// router.get('/comprobantesVentas/altaItems/:id', auth, checkAcceso('a'), controller.getAltaItemsVentas)
// router.post('/comprobantesVentas/getListaTareasAjax', auth, checkAcceso('c'), controller.getListaTareasIdProyectoAjax)
// router.post('/comprobantesVentas/getTareaAjax', auth, checkAcceso('c'), controller.getTareaIdProyectoAjax)
// router.post('/comprobantesVentas/altaItems', auth, checkAcceso('a'), controller.postAltaItemsVentas)
// router.post('/comprobantesVentas/getlistaItemsAjax', auth, checkAcceso('c'), controller.getListaVentasItemsAjax)
// router.post('/comprobantesVentas/eliminarItem', auth, checkAcceso('b'), controller.postEliminarItemVentas)
// router.post('/comprobantesVentas/facturar', auth, checkAcceso('a'), controller.postFacturar)
// router.post('/comprobantesVentas/imprimir', auth, checkAcceso('c'), controller.postImprimir)
// router.get('/comprobantesVentas/imprimir', auth, checkAcceso('c'), controller.getImprimir)
// router.post("/comprobantesVentas/getTipoComprobanteAjax", auth, controller.postTipoCompSelectAjax)


module.exports = router