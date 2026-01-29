const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/proveedores', auth, checkAcceso('c'), controller.getLista)
router.post('/proveedores/listaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/proveedores/getlistaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/proveedores/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/proveedores/getModificar', auth, checkAcceso('c'), controller.getModificar)
router.post('/proveedores/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/proveedores/ver', auth, checkAcceso('c'), controller.postVer)
router.post('/proveedores/borrar', auth, checkAcceso('b'), controller.postBorrar)


module.exports = router