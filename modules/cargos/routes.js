const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso, checkAdmin } = require('../../middlewares')

router.get('/cargos', auth, checkAcceso('c'), controller.getLista)
router.post('/cargos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/cargos/getlistaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/cargos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/cargos/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/cargos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/cargos/eliminar', auth, checkAcceso('b'), controller.postEliminar)

// PERMISOS/ACCESOS
router.get('/cargos/accesos/lista/:id', auth, checkAdmin, controller.getAccesos)
router.post("/cargos/updateacceso/:id_cargo/:id_menu/:acceso_short/:value", auth, checkAdmin, controller.updateAcceso)
// router.post("/cargos/getaccesos", auth, checkAdmin, cUsuarios.getAccesosByUsuario)

module.exports = router