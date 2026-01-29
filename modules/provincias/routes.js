const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/provincias', auth, checkAcceso('c'), controller.getProvincias)
router.get('/provincias/listaAjax', auth, checkAcceso('c'), controller.getListaProvincias)
router.post('/provincias/listaSelectAjax', auth, controller.getListaSelectProvincias)


module.exports = router