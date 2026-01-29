const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


//Reporte de Stock
router.get('/reportes/reporteStock', auth, checkAcceso('c'), controller.getReporteStock)
router.post('/reportes/reporteStock', auth, checkAcceso('c'), controller.getReporteStockAjax)
//Reporte de Ventas
router.get('/reportes/reporteVentas', auth, checkAcceso('c'), controller.getReporteVentas)
router.post('/reportes/reporteVentas', auth, checkAcceso('c'), controller.getReporteVentasAjax)


module.exports = router