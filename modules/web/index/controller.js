const model = require('./model')
const utils = require('../../../utils')
const eventos = require("../../eventos/controller")

exports.getLista = async (req, res) => {
    try {
        const noticias = await model.getNoticias()
        const deportes = await model.getDeportes()
        const recuerdosPaneros = await model.getRecuerdosPaneros()
        res.render('web/index/views/index', {
            pagename: "Inicio",
            noticias,
            deportes,
            recuerdosPaneros,
            noticiasJSON: JSON.stringify(noticias),
            recuerdosPanerosJSON: JSON.stringify(recuerdosPaneros)
        })
    }
    catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getComisionDirectiva = async (req, res) => {
    try {
        res.render('web/static/comisionDirectiva', {
            pagename: "Comisión Directiva"
        })
    }
    catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getHistoria = async (req, res) => {
    try {
        res.render('web/static/historia', {
            pagename: "Historia"
        })
    }
    catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getHorarios = async (req, res) => {
    try {
        res.render('web/static/horarios', {
            pagename: "Horarios"
        })
    }
    catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getInstalaciones = async (req, res) => {
    try {
        res.render('web/static/instalaciones', {
            pagename: "Instalaciones"
        })
    }
    catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}
exports.getOlimpiadas = (req, res) => {
    res.render('web/static/olimpiadas')
}