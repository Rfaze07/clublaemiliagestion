const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")

exports.getLista = async (req, res) => {
    try {
        res.render('quejas/views/index', {
            pagename: "Quejas",
            permisos: req.session.user.permisos
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
    } catch (error) {
        console.log(error)
        return res.json({ status: false, con:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getByIdAjax = async (req, res) => {
    try {
        let id = req.body.id
        let data = await model.getById(id)
        return res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: 'error', text: 'Error del servidor' })
    }
}
exports.updateEstado = async (req, res) => {
    try {

        const { id, leida } = req.body

        await model.update({
            id,
            leida
        })

        return res.json({
            status: true
        })

    } catch (error) {

        console.log(error)

        return res.json({
            status: false,
            text: "Error al actualizar estado"
        })
    }
}
