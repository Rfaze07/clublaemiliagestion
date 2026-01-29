const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth } = require('../../middlewares')

router.post("/tipos_comprobantes/lista", auth, controller.getLista)

module.exports = router