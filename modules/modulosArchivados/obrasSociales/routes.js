const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')

router.get('/obrasSociales', auth, checkAcceso('c'), controller.getLista)
router.post('/obrasSociales/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/obrasSociales/getListaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/obrasSociales/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/obrasSociales/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/obrasSociales/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/obrasSociales/eliminar', auth, checkAcceso('b'), controller.postEliminar)

module.exports = router