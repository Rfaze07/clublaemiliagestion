const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get("/puntosVenta", auth, checkAcceso("c"), controller.getLista)
router.post("/puntosVenta/lista", auth, checkAcceso("c"), controller.getListaAjax)
router.post("/puntosVenta/alta", auth, checkAcceso("a"), controller.postAlta)
router.post("/puntosVenta/modificar", auth, checkAcceso("m"), controller.postModificar)
router.get("/puntosVenta/:id", auth, checkAcceso("c"), controller.getById)
router.post("/puntosVenta/eliminar", auth, checkAcceso("b"), controller.postEliminar)
router.post("/puntosVenta/activo", auth, checkAcceso("m"), controller.postActivo)
router.get("/puntosVenta/presupuesto/:empresa", auth, controller.getPuntoDeVentaP)
router.post("/puntosVenta/getAllAjax", auth, controller.postListaSelectAjax)
router.post("/puntosVenta/getPuntoVentaAjax", auth, controller.postPuntoVentaSelectAjax)

module.exports = router