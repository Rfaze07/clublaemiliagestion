const model = require('./model')
const utils = require('../../../utils')
const eventos = require("../../eventos/controller")
const mPartidos = require("../../partidos/model")

exports.getLista = async (req, res) => {
    try {
        res.render('web/partidos/views/index', { 
            pagename: "Partidos",
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

exports.getListaDetalles = async (req, res) => {
    try {
        
        res.render('web/partidos/views/detallePartidos', { 
            pagename: "Detalle de Partidos",
            idPartido: req.query.id
        })
    }
    catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaDetallesAjax = async (req, res) => {
    try {
        let partido = await model.getById(req.body.idPartido)
        let estadisticas = await model.getEstadisticasPorPartido(req.body.idPartido)
        let periodo = await model.getPeriodoActual(req.body.idPartido)
        let estadisticasA = []
        let estadisticasB = []

        for (let estadistica of estadisticas) {
            if(estadistica.equipo === partido[0].equipoA) {
                estadisticasA.push(estadistica)
            }
            else if(estadistica.equipo === partido[0].equipoB) {
                estadisticasB.push(estadistica)
            }
        }

        console.log(estadisticasA);





        //if(!data.length) return res.json({ status: false, icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, partido, estadisticasA, estadisticasB, periodo })
    }
    catch (error) {
        console.log(error)
        return res.json({ status: false, con:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

