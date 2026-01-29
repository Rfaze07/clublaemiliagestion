const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/proyectos', auth, checkAcceso('c'), controller.getLista)
router.post('/proyectos/listaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/proyectos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/proyectos/getModificar', auth, checkAcceso('c'), controller.getModificar)
router.post('/proyectos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/proyectos/ver', auth, checkAcceso('c'), controller.postVer)
router.post('/proyectos/borrar', auth, checkAcceso('b'), controller.postBorrar)
router.get('/proyectos/altaItems/:id', auth, checkAcceso('a'), controller.getAltaItems)
router.post('/proyectos/getlistaItemsAjax', auth, checkAcceso('a'), controller.getListaItemsAjax)
router.post('/proyectos/altaItems', auth, checkAcceso('a'), controller.postAltaItems)
router.post('/proyectos/getItemAjax', auth, checkAcceso('c'), controller.getItemByIdAjax)
router.post('/proyectos/postModificarItem', auth, checkAcceso('m'), controller.postModificarItemAjax)
router.post('/proyectos/cerrar', auth, checkAcceso('m'), controller.postCerrarProyecto)
router.post('/proyectos/actualizarEstado', auth, checkAcceso('m'), controller.postActualizarEstado)


router.post('/proyectos/getProyectoAceptadosSelect', auth, controller.getProyectosAceptados)
router.post('/proyectos/getByCliente', auth, checkAcceso('c'), controller.getProyectosCliente)
router.post('/proyectos/getProyectoByCliente', auth, checkAcceso('c'), controller.getProyectosCompletoCliente)
router.post('/proyectos/getProyectoByClienteSelect', auth, controller.getProyectosCompletoCliente)
router.post('/proyectos/getTareasProyectoByCliente', auth, checkAcceso('c'), controller.getTareasProyectosCompletoCliente)
router.post('/proyectos/getTareasProyectoByClienteSelect', auth, controller.getTareasProyectosCompletoCliente)

module.exports = router