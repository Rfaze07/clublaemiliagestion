const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/conceptos', auth, checkAcceso('c'), controller.getLista)
router.post('/conceptos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/conceptos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/conceptos/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/conceptos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/conceptos/eliminar', auth, checkAcceso('b'), controller.postEliminar)


module.exports = router