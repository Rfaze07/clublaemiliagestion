const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../middlewares');


//Esto checkea el módulo que tenga la ruta base "/ejemplo" y busca si el usuario tiene el permiso 'c'
router.get('/ejemplo', auth, checkAcceso('c'),  controller.getEjemplo);

//Otra ruta válida seria
router.get('/ejemplo/probando', auth, checkAcceso('m'), controller.getEjemplo);


module.exports = router