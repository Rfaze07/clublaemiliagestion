const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAdmin } = require('../../middlewares')

router.get('/usuarios', auth, checkAdmin,  controller.getLista)
router.get('/usuarios/alta', auth, checkAdmin, controller.getAlta)
router.post('/usuarios/alta', auth, checkAdmin, controller.postAlta)
router.post('/usuarios/lista/borrar', auth, checkAdmin, controller.borrar)
router.get('/usuarios/modificar/:unica', auth, checkAdmin, controller.getModificar)
router.post('/usuarios/modificar', auth, checkAdmin, controller.postModificar)
router.get('/usuarios/accesos/lista/:id', auth, checkAdmin, controller.getAccesos)
router.post("/usuarios/updateacceso/:id_usuario/:id_menu/:acceso_short/:value", auth, checkAdmin, controller.updateAcceso)
router.post("/usuarios/getaccesos", auth, checkAdmin, controller.getAccesosByUsuario)
router.get('/changePass', auth, controller.getPass)
router.post('/changePass', auth, controller.postPass)
router.post('/restartPass', auth, checkAdmin, controller.restartPass)
router.post('/usuarios/generoUserPass', auth, checkAdmin, controller.postGeneroUserPass)
router.post('/mercadopago', controller.mercadopago)


module.exports = router