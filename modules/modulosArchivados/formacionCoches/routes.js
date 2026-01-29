const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/formacionCoches', auth, checkAcceso('c'), controller.getLista)
router.post('/formacionCoches/getComponentesVehiculo', auth, checkAcceso('a'), controller.getComponentesVehiculo)

module.exports = router