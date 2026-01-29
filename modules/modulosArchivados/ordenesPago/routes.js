const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso, checkAdmin } = require('../../middlewares')

router.get('/ordenespagos', auth, checkAcceso('c'), controller.getLista)
router.post('/ordenespagos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/ordenespagos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/ordenespagos/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/ordenespagos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/ordenespagos/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router