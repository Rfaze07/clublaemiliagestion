const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/combustiblesVales', auth, checkAcceso('c'), controller.getLista)
router.post('/combustiblesVales/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/combustiblesVales/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/combustiblesVales/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router