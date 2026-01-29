const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/ccproveedores', auth, checkAcceso('c'), controller.getLista)
router.post('/ccproveedores/listaAjax', auth, checkAcceso('c'), controller.getListaAjax)

module.exports = router