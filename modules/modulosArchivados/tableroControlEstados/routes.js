const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/tableroControlEstados', auth, checkAcceso('c'), controller.getLista)
router.post('/tableroControlEstados/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/tableroControlEstados/getVerAjax', auth, checkAcceso('c'), controller.getVerAjax)

module.exports = router