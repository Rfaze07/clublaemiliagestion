const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/web/deportes', controller.getLista);
router.post('/web/deportes/getLista', controller.getListaAjax);

module.exports = router;
