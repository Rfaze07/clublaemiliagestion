const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Mostrar formulario
router.get('/socios', controller.getInscripcion);

// Procesar formulario
router.post('/socios', controller.postInscripcion);

module.exports = router;