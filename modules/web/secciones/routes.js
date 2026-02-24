const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.get('/web/secciones/:id', controller.getDetalle)

module.exports = router
