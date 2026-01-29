const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/tableroControl', auth, checkAcceso('c'), controller.getLista)
router.post('/tableroControl/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/tableroControl/getCargosByProyectosDetalles', auth, checkAcceso('c'), controller.getCargosByProyectosDetallesAjax)
router.post('/tableroControl/postModificarCargo', auth, checkAcceso('m'), controller.postModificarCargoAjax)


module.exports = router