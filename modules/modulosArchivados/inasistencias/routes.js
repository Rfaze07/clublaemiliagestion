const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/inasistencias', auth, checkAcceso('c'), controller.getLista)
router.post('/inasistencias/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/inasistencias/getCargarPara', auth, checkAcceso('c'), controller.getCargarParaAjax)
router.post('/inasistencias/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/inasistencias/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/inasistencias/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/inasistencias/eliminar', auth, checkAcceso('b'), controller.postEliminar)
router.post('/inasistencias/getPuesto', auth, controller.getPuestoAjax)

// CERTIFICADOS
router.post('/inasistencias/altaCertificado', auth, checkAcceso('a'), controller.postAltaCertificado)
router.post('/inasistencias/modificarCertificado', auth, checkAcceso('m'), controller.postModificarCertificado)
router.post('/inasistencias/eliminarCertificado', auth, checkAcceso('b'), controller.postEliminarCertificado)


module.exports = router