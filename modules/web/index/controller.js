const model = require('./model')
const utils = require('../../../utils')
const eventos = require("../../eventos/controller")

exports.getLista = async (req, res) => {
    try {
        const noticias = await model.getNoticias()
        res.render('web/index/views/index', {
            pagename: "Inicio",
            noticias,
            noticiasJSON: JSON.stringify(noticias)
        })
    }
    catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}