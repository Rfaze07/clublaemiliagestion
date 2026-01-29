const model = require('./model')
const utils = require('../../../utils')
const eventos = require("../../eventos/controller")

exports.getLista = async (req, res) => {
    try {
        res.render('web/lideres/views/index', {/*aca*/
            pagename: "Lideres de estadisticas",
        })
    }
    catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        let goleadores = await model.getMayoresGoleadores()
        let asistidores = await model.getMayoresAsistidores()
        let reboteadores = await model.getMayoresReboteadores()
        let pegadores = await model.getMayoresPegadores()
        let data = {
            goleadores,
            asistidores,
            reboteadores,
            pegadores
        }
        res.json({ status: true, data })
    }
    catch (error) {
        console.log(error)
        return res.json({ status: false, con:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}