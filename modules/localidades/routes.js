const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/localidades', auth, checkAcceso('c'), controller.getLocalidades)
router.post('/localidades/listaAjax', auth, checkAcceso('c'), controller.getLocalidadesProvincia)
router.post('/localidades/listaSelectAjax', auth, controller.getLocalidadesSelectProvincia)
router.post('/localidades/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/localidades/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router