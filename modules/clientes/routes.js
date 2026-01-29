const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/clientes', auth, checkAcceso('c'), controller.getLista)
router.post('/clientes/listaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/clientes/listaActivosAjaxSelect', auth, controller.getListaActivosAjaxSelect)
router.post('/clientes/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/clientes/getModificar', auth, checkAcceso('c'), controller.getModificar)
router.post('/clientes/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/clientes/ver', auth, checkAcceso('c'), controller.postVer)
router.post('/clientes/borrar', auth, checkAcceso('b'), controller.postBorrar)


module.exports = router