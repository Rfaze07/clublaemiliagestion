const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth } = require('../../middlewares')

router.post('/alicuotasIVA/listaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/alicuotasIVA/getByIdAjax', auth, controller.getByIdAjax)

module.exports = router