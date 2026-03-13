const model = require('./model')
const eventos = require("../eventos/controller")


exports.getLista = async (req, res) => {
    try {
        res.render('parametros/views/index', {
            pagename: "Parámetros",
            permisos: req.session.user.permisos
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        let data = await model.getAll()
        if (!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getByIdAjax = async (req, res) => {
    try {
        let id = req.body.id
        let data = await model.getById(id)
        if (!data.length) return res.json({ status: false, icon: "error", title: "Error", text: "No se encontró el registro" })
        return res.json({ status: true, data: data[0] })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.modificar = async (req, res) => {
    try {
        if (req.body.valor === undefined || req.body.valor === null) {
            return res.json({ status: false, icon: 'error', title: 'Error', text: 'El valor es obligatorio' })
        }

        let result = await model.update(req.body)
        if (result.affectedRows == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Parámetros", acc: "m", registro: req.body.id })
        return res.json({ status: true, icon: "success", title: "Éxito", text: "Parámetro modificado correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}
