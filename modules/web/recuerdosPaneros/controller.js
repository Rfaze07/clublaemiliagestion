const model = require('./model')
const utils = require('../../../utils')
const eventos = require("../../eventos/controller")

exports.getLista = async (req, res) => {
    try {
        const recuerdos = await model.getAll()
        res.render('web/recuerdosPaneros/views/index', {
            pagename: "Recuerdos",
            recuerdos,
            recuerdosJSON: JSON.stringify(recuerdos)
        })
    }
    catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        let data = await model.getAll()
        if(!data.length) return res.json({ status: false, icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    }
    catch (error) {
        console.log(error)
        return res.json({ status: false, con:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}