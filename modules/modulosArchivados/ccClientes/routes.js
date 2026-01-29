const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/ccclientes', auth, checkAcceso('c'), controller.getLista)
router.post('/ccclientes/listaAjax', auth, checkAcceso('c'), controller.getListaAjax)

module.exports = router