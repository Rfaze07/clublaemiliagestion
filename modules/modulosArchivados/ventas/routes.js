const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/ventas', auth, checkAcceso('c'), controller.getLista)
router.post('/ventas/alta', auth, checkAcceso('c'), controller.postAlta)
router.get('/ventas/imprimir/:id', auth, checkAcceso('c'), controller.getImprimir)




module.exports = router