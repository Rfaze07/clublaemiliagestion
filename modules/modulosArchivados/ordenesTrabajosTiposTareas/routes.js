const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/ordenesTrabajosTiposTareas', auth, checkAcceso('c'), controller.getLista)
router.post('/ordenesTrabajosTiposTareas/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/ordenesTrabajosTiposTareas/getlistaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/ordenesTrabajosTiposTareas/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/ordenesTrabajosTiposTareas/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/ordenesTrabajosTiposTareas/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/ordenesTrabajosTiposTareas/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router