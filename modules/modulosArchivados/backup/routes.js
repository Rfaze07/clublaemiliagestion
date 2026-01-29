const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.post('/backup/ejecutar', controller.postEjecutar)

module.exports = router