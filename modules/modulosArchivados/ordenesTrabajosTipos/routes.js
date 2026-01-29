const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/ordenesTrabajosTipos', auth, checkAcceso('c'), controller.getLista)
router.post('/ordenesTrabajosTipos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/ordenesTrabajosTipos/getListaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/ordenesTrabajosTipos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/ordenesTrabajosTipos/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/ordenesTrabajosTipos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/ordenesTrabajosTipos/eliminar', auth, checkAcceso('b'), controller.postEliminar)


module.exports = router