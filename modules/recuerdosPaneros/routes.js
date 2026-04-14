const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');
const upload = require('../multer/controller');

router.get('/recuerdosPaneros', auth, checkAcceso('c'), controller.getLista);
router.post('/recuerdosPaneros/getListaAjax', auth, checkAcceso('c'), controller.getListaAjax);
router.post('/recuerdosPaneros/getByIdAjax', auth, checkAcceso('c'), controller.getByIdAjax);
router.post('/recuerdosPaneros/alta', auth, checkAcceso('a'), upload.single('imagen'), controller.alta);
router.post('/recuerdosPaneros/modificar', auth, checkAcceso('m'), upload.single('imagen'), controller.modificar);
router.post('/recuerdosPaneros/eliminar', auth, checkAcceso('b'), controller.eliminar);



module.exports = router