const router = require("express").Router()
const mw = require("../../middlewares")
const controller = require('./controller')

router.get('/gestion', (req, res, next) => {
    if (req.session.auth)
        return res.redirect('/inicio')
    else
        return next()
}, controller.getLogin)

router.post('/login', controller.postLogin)
router.get("/inicio", mw.auth, controller.getInicio)
router.get('/logout', controller.postLogout)


// ALERTAS
router.post("/alertas", mw.auth, controller.getAlertas)
router.post("/alertas/getInformacionRenovacion", mw.auth, controller.postObtenerInformacion)
router.post("/alertas/accion", mw.auth, controller.postAccion)


module.exports = router