const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.post('/tiposInasistencias/getlistaSelectAjax', auth, controller.getListaSelectAjax)

module.exports = router