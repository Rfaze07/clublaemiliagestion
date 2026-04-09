const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { auth, checkAcceso } = require('../../../middlewares');


router.get('/', controller.getLista);
router.get('/web', controller.getLista);

router.get('/web/comision-directiva', controller.getComisionDirectiva);
router.get('/web/historia', controller.getHistoria);
router.get('/web/horarios', controller.getHorarios);
router.get('/web/instalaciones', controller.getInstalaciones);


module.exports = router