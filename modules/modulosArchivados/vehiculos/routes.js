const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/vehiculos', auth, checkAcceso('c'), controller.getLista)
router.post('/vehiculos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/vehiculos/getNroInternoAjax', auth, checkAcceso('c'), controller.getNroInternoAjax)
router.post('/vehiculos/getlistaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/vehiculos/getlistaCamionesSelectAjax', auth, controller.getListaCamionesSelectAjax)
router.post('/vehiculos/getListaCamChofSelectAjax', auth, controller.getListaCamChofSelectAjax)
router.post('/vehiculos/getlistaSemisSelectAjax', auth, controller.getListaSemisSelectAjax)
router.post('/vehiculos/getAllVehiculosByTipoSelectAjax', auth, controller.getAllVehiculosByTipoSelectAjax)
router.post('/vehiculos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/vehiculos/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/vehiculos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/vehiculos/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router