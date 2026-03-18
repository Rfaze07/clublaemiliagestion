const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.get('/web/Pagos', controller.getLista)
router.get('/web/Pagos/listaAjax', controller.getListaAjax)

module.exports = router