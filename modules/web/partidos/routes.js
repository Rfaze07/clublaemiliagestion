const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../../middlewares');


router.get('/web/partidos', controller.getLista);
router.post('/web/partidos/getLista', controller.getListaAjax);
router.get('/web/partidos/detalle', controller.getListaDetalles);
router.get('/web/detallePartidos', controller.getListaDetalles); // Alias para la ruta solicitada
router.post('/web/partidos/getListaDetallesAjax', controller.getListaDetallesAjax);

module.exports = router