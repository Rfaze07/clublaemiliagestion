const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/ordenesTrabajosTareas', auth, checkAcceso('c'), controller.getLista)
router.post('/ordenesTrabajosTareas/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/ordenesTrabajosTareas/getlistaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/ordenesTrabajosTareas/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/ordenesTrabajosTareas/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/ordenesTrabajosTareas/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/ordenesTrabajosTareas/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router