const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth } = require('../../middlewares')

router.post('/condicionesNeumaticos/listaActivosAjaxSelect', auth, controller.getListaActivosAjaxSelect)

module.exports = router