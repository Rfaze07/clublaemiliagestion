const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');


router.get('/cotizaciones', auth, checkAcceso('c'), controller.getLista)
router.post('/cotizaciones/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.get('/cotizaciones/alta/:id', auth, checkAcceso('a'), controller.getAlta)
router.post('/cotizaciones/alta', auth, checkAcceso('a'), controller.postAlta)
router.get('/cotizaciones/altaItems/:id', auth, checkAcceso('a'), controller.getAltaItems)
router.post('/cotizaciones/getlistaItemsAjax', auth, checkAcceso('a'), controller.getListaItemsAjax)
router.post('/cotizaciones/altaItems', auth, checkAcceso('a'), controller.postAltaItems)
router.post('/cotizaciones/getItemAjax', auth, checkAcceso('c'), controller.getItemByIdAjax)
router.post('/cotizaciones/postModificarItem', auth, checkAcceso('m'), controller.postModificarItemAjax)
router.post('/cotizaciones/cerrar', auth, checkAcceso('a'), controller.postCerrarCotizacion)
router.post('/cotizaciones/ver', auth, checkAcceso('c'), controller.getVer)
router.post('/cotizaciones/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/cotizaciones/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/cotizaciones/eliminar', auth, checkAcceso('b'), controller.postEliminar)
router.post('/cotizaciones/actualizarEstado', auth, checkAcceso('m'), controller.postActualizarEstado)
router.post('/cotizaciones/convertir', auth, checkAcceso('m'), controller.postConvertir)


module.exports = router