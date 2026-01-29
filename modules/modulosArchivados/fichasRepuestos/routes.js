const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/fichasRepuestos', auth, checkAcceso('c'), controller.getLista)
router.post('/fichasRepuestos/listaAjax', auth, checkAcceso('c'), controller.getListaAjax)
// router.post('/fichasRepuestos/listaActivosAjaxSelect', auth, controller.getListaActivosAjaxSelect)
router.post('/fichasRepuestos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/fichasRepuestos/getByIdAjax', auth, checkAcceso('c'), controller.getModificar)
router.post('/fichasRepuestos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/fichasRepuestos/ver', auth, checkAcceso('c'), controller.postVer)
router.post('/fichasRepuestos/borrar', auth, checkAcceso('b'), controller.postBorrar)

// 
router.post('/fichasRepuestos/getIdRepuestoAjax', auth, checkAcceso('c'), controller.postFichasRepuestosAjax)

module.exports = router