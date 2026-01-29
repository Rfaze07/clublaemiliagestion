const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth } = require('../../middlewares')

router.post('/tiposDocumentosAfip/listaActivosAjaxSelect', auth, controller.getListaActivosAjax)

module.exports = router