const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/ordenesCargas', auth, checkAcceso('c'), controller.getLista)
router.post('/ordenesCargas/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/ordenesCargas/getlistaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/ordenesCargas/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/ordenesCargas/obtenerEstados', auth, checkAcceso('c'), controller.postObtenerEstadosDisponibles)
router.post('/ordenesCargas/actualizarChofer', auth, checkAcceso('m'), controller.postModificarChofer)
router.post('/ordenesCargas/actualizarEstado', auth, checkAcceso('m'), controller.postModificarEstado)
router.post('/ordenesCargas/eliminar', auth, checkAcceso('b'), controller.postEliminar)

// PASO 1 - Orden carga
// router.post('/ordenesCargas/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/ordenesCargas/alta1', auth, checkAcceso('a'), controller.postAlta1)
router.post('/ordenesCargas/modificar1', auth, checkAcceso('m'), controller.postModificar1)
// PASO 2 - Productos
router.post('/ordenesCargas/getListaProductosAjax', auth, checkAcceso('c'), controller.getListaProductosAjax)
router.post('/ordenesCargas/alta2', auth, checkAcceso('a'), controller.postAlta2)
router.post('/ordenesCargas/getModificar2Ajax', auth, checkAcceso('c'), controller.getModificar2)
router.post('/ordenesCargas/modificar2', auth, checkAcceso('m'), controller.postModificar2)
// PASO 3 - REPARTOS
router.post('/ordenesCargas/getListaRepartosAjax', auth, checkAcceso('c'), controller.getListaRepartosAjax)
router.post('/ordenesCargas/ultimoOrden3', auth, checkAcceso('c'), controller.postUltimoOrden3)
router.post('/ordenesCargas/alta3', auth, checkAcceso('a'), controller.postAlta3)
router.post('/ordenesCargas/getModificar3Ajax', auth, checkAcceso('c'), controller.getModificar3)
router.post('/ordenesCargas/modificar3', auth, checkAcceso('m'), controller.postModificar3)
router.post('/ordenesCargas/eliminar3', auth, checkAcceso('m'), controller.postEliminar3)


module.exports = router