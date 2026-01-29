const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { auth, checkAcceso } = require('../../middlewares')


router.get('/compras', auth, checkAcceso('c'), controller.getLista)
router.post('/compras/alta', auth, checkAcceso('c'), controller.postAlta)



module.exports = router