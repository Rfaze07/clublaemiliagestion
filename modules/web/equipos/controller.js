const model = require('./model')
const utils = require('../../../utils')
const eventos = require("../../eventos/controller")

exports.getLista = async (req, res) => {
    try {
        res.render('web/equipos/views/index', {
            pagename: "Equipos",
        })
    }
    catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        let equipos = await model.getAll()
        for(let i=0; i<equipos.length; i++){
            let jugadores = await model.getJugadoresByEquipo(equipos[i].id)
            equipos[i].jugadores = jugadores
        }
        let data = equipos
        if(!data.length) return res.json({ status: false, icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    }
    catch (error) {
        console.log(error)
        return res.json({ status: false, con:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}