const router = require("express").Router()
const mw = require("../../middlewares")
const controller = require('./controller')
const menu = require("./../../menu")

router.get('/configRutas', mw.auth, mw.checkDev, controller.getMenuSettings)
router.post('/guardarItemMenu', mw.auth, mw.checkDev, controller.guardarItemMenu)
router.get('/getMenu', mw.auth, mw.checkDev, menu.getMenues)
router.get('/getItemMenuByID/:id', mw.auth, mw.checkDev, controller.getItem)
router.delete('/itemMenu/:id',mw.auth, mw.checkDev,controller.borrarItemMenu);
router.get('/configModulos',mw.auth, mw.checkDev, controller.getListaModulos);
router.post('/configModulos',mw.auth, mw.checkDev, controller.guardarModulos);
router.delete('/modulo/:id',mw.auth, mw.checkDev, controller.borrarModulo);
router.get('/modulo/:id',mw.auth,mw.checkDev,controller.getModuloById)

module.exports = router