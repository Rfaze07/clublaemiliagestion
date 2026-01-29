const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/alertas', auth, checkAcceso('c'), controller.getLista)
router.post('/alertas/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/alertas/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/alertas/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/alertas/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/alertas/eliminar', auth, checkAcceso('b'), controller.postEliminar)



/*********************************
        MODULOS - ALETAS
*********************************/

router.post('/modulosAlertas/getlistaSelectAjax', auth, controller.getListaSelectAjax)


module.exports = router