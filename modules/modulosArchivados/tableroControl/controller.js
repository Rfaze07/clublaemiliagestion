const model = require('./model')
const mCargos = require('../cargos/model')
const eventos = require("../eventos/controller")


exports.getLista = async (req, res) => {
    try {
        res.render('tableroControl/views/index', {
            pagename: "Tablero de control de proyectos",
            permisos: req.session.user.permisos
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        // req.body.desde = utils.changeDateYMD(req.body.desde)
        // req.body.hasta = utils.changeDateYMD(req.body.hasta)

        const data = await model.getAllTableroProyectosAceptados()
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getCargosByProyectosDetallesAjax = async (req, res) => {
    try {
        if(String(req.body.id).trim().length == 0) return res.json({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar un cargo' })
        const data = await mCargos.getAllCargosActivoDistinct(req.body.id)
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postModificarCargoAjax = async (req, res) => {
    try {
        if(String(req.body.id).trim().length == 0) return res.json({ status: false, icon:'error', title: 'Error', text: 'Hubo un error' })
        if(String(req.body.idCargo).trim().length == 0) return res.json({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar un cargo' })
        const data = await model.postModificarCargo(req.body)
        if(data.affectedRows == 0) return res.json({ status: false, icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Proyectos detalles", acc: "m", registro: `${req.body.id}|${req.body.idCargo}` })
        res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}