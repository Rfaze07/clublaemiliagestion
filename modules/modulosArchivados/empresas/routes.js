const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/empresas', auth, checkAcceso('c'), controller.getEmpresas)
router.get('/empresas/listaAjax', auth, checkAcceso('c'), controller.getListaEmpresas)
router.post('/empresas/listaActivosAjaxSelect', auth, controller.getListaActivosAjax)
// router.post('/empresas/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/empresas/getEmpresa', auth, checkAcceso('c'), controller.getEmpresasById)
router.post('/empresas/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/empresas/eliminarImagen', auth, checkAcceso('b'), controller.postEliminarImagen)
// router.post('/empresas/borrar', auth,checkAcceso('b'),  controller.borrar)


module.exports = router