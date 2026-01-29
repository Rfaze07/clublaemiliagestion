
const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/partidos', auth, checkAcceso('c'), controller.getLista)
router.get('/partidos/planillaDigital', auth, checkAcceso('c'), controller.getPlanillaDigital)
router.post('/partidos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/partidos/getListaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/partidos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/partidos/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/partidos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/partidos/eliminar', auth, checkAcceso('b'), controller.postEliminar)
router.post('/partidos/actualizarEstado', auth, checkAcceso('m'), controller.postActualizarEstado);


// Ruta para registrar estadística individual de jugador

router.post('/partidos/registrarEstadistica', auth, checkAcceso('m'), controller.postRegistrarEstadistica);
router.post('/partidos/deshacerUltimaAccion', auth, checkAcceso('m'), controller.postDeshacerUltimaAccion);
router.post('/partidos/obtenerEstadisticas', auth, checkAcceso('c'), controller.postObtenerEstadisticas);

module.exports = router