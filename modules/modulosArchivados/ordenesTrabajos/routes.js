const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/ordenesTrabajos', auth, checkAcceso('c'), controller.getLista)
router.post('/ordenesTrabajos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/ordenesTrabajos/getListaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/ordenesTrabajos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/ordenesTrabajos/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/ordenesTrabajos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.get('/ordenesTrabajos/detalles', auth, checkAcceso('a'), controller.postDetalles)
router.post('/ordenesTrabajos/eliminar', auth, checkAcceso('b'), controller.postEliminar)
router.get('/ordenesTrabajos/imprimir', auth, checkAcceso('c'), controller.postImprimir)

// OT - MOVIMIENTOS
router.post('/ordenesTrabajos/getListaMovAjax', auth, checkAcceso('c'), controller.postListaMovimientosAjax)
router.post('/ordenesTrabajos/altaMovimiento', auth, checkAcceso('a'), controller.postAltaMovimiento)
router.post('/ordenesTrabajos/getMovimientoAjax', auth, checkAcceso('c'), controller.postMovimientoAjax)
router.post('/ordenesTrabajos/borrarMovimiento', auth, checkAcceso('a'), controller.postBorrarMovimiento)

// OT - TAREAS
router.post('/ordenesTrabajos/getListaTareasAjax', auth, checkAcceso('c'), controller.postListaTareasAjax)
router.post('/ordenesTrabajos/altaTarea', auth, checkAcceso('a'), controller.postAltaTarea)
router.post('/ordenesTrabajos/updateTareaRealizada', auth, checkAcceso('m'), controller.postUpdateTareaRealizada)
router.post('/ordenesTrabajos/blindar', auth, checkAcceso('m'), controller.postBlindar)
router.post('/ordenesTrabajos/borrarTarea', auth, checkAcceso('a'), controller.postBorrarTarea)

//OT - NOVEDADES
router.post('/ordenesTrabajos/postListaNovedadesAjax', auth, checkAcceso('c'), controller.postListaNovedadesAjax)
router.post('/ordenesTrabajos/postUpdateNovedadAsignaOT', auth, checkAcceso('a'), controller.postUpdateNovedadAsignaOT)
router.post('/ordenesTrabajos/postUpdateNovedadQuitarOT', auth, checkAcceso('m'), controller.postUpdateNovedadQuitarOT)
router.post('/ordenesTrabajos/postUpdateNovedadRealizada', auth, checkAcceso('m'), controller.postUpdateNovedadRealizada)


module.exports = router