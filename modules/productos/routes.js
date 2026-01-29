const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')
const upload = require('../multer/controller');

// Middleware de log para diagnóstico de subida de imagen
function logRequest(req, res, next) {
	console.log('--- LOG antes de multer ---');
	console.log('body:', req.body);
	console.log('file:', req.file);
	console.log('headers:', req.headers['content-type']);
	next();
}

router.get('/productos', auth, checkAcceso('c'), controller.getLista)
router.post('/productos/getlistaAjax', auth, checkAcceso('c'), controller.getListaAjax)
router.post('/productos/getListaSelectAjax', auth, controller.getListaSelectAjax)
router.post('/productos/alta', auth, checkAcceso('a'), controller.postAlta)
router.post('/productos/getByIdAjax', auth, checkAcceso('c'), controller.getById)
router.post('/productos/modificar', auth, checkAcceso('m'), controller.postModificar)
router.post('/productos/eliminar', auth, checkAcceso('b'), controller.postEliminar)
router.post('/productos/subirImagen', logRequest, upload.single('imagen'), controller.subirImagen);
// Esta ruta debe ir después de express.urlencoded/json en app.js



router.post('/productos/getColoresByProductoIdAjax', auth, checkAcceso('c'), controller.getColoresByProductoIdAjax)
router.post('/productos/getColorByIdAjax', auth, checkAcceso('c'), controller.getColorByIdAjax)
router.post('/productos/altaColor', auth, checkAcceso('a'), controller.postAltaColor)
router.post('/productos/modificarColor', auth, checkAcceso('m'), controller.postModificarColor)
router.post('/productos/eliminarColor', auth, checkAcceso('b'), controller.postEliminarColor)


module.exports = router
