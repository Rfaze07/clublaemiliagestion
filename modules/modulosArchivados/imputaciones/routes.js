const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


// router.get('/imputaciones', auth, checkAcceso('c'), controller.getLista)
// router.post('/imputaciones/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/imputaciones/getListaSelectAjax', auth, controller.getListaSelectAjax)
// router.post('/imputaciones/alta', auth, checkAcceso('a'), controller.postAlta)
// router.post('/imputaciones/getByIdAjax', auth, checkAcceso('c'), controller.getById)
// router.post('/imputaciones/modificar', auth, checkAcceso('m'), controller.postModificar)
// router.post('/imputaciones/eliminar', auth, checkAcceso('b'), controller.postEliminar)


module.exports = router