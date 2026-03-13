const model = require('./model')
const utils = require('../../../utils')
const eventos = require("../../eventos/controller")

exports.getLista = async (req, res) => {
    try {
        const noticias = await model.getNoticias()
        const deportes = await model.getDeportes()
        res.render('web/index/views/index', {
            pagename: "Inicio",
            noticias,
            deportes,
            noticiasJSON: JSON.stringify(noticias)
        })
    }
    catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}