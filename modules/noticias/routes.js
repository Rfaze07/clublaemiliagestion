const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');
const upload = require('../multer/controller');

router.get('/noticias', auth, checkAcceso('c'), controller.getLista);
router.post('/noticias/getListaAjax', auth, checkAcceso('c'), controller.getListaAjax);
router.post('/noticias/getByIdAjax', auth, checkAcceso('c'), controller.getByIdAjax);
router.post('/noticias/alta', auth, checkAcceso('a'), upload.single('imagen'), controller.alta);
router.post('/noticias/modificar', auth, checkAcceso('m'), upload.single('imagen'), controller.modificar);
router.post('/noticias/eliminar', auth, checkAcceso('b'), controller.eliminar);



module.exports = router