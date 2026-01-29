const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")


exports.getLista = async (req, res) => {
    try {
        res.render('conceptos/views/index', {
            pagename: "Conceptos",
            permisos: req.session.user.permisos
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        const data = req.body.activo == 't' ? await model.getAll() : await model.getAllbyActivo(req.body.activo)
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen conceptos registrados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        if((req.body.descripcion).trim().length == 0) return res.json({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la descripción' })
        if((req.body.descripcion).trim().length >= 100) return res.json({ status: false, icon:'error', title: 'Error', text: 'La descripcion superó la cantidad permitida' })
        if((req.body.descCorta).trim().length == 0) return res.json({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la descripción corta' })
        if((req.body.descCorta).trim().length >= 5) return res.json({ status: false, icon:'error', title: 'Error', text: 'La descripción corta superó la cantidad permitida' })
        if((req.body.tipo).trim().length == 0) return res.json({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar el tipo de movimiento' })

        req.body.editable = utils.changeToBoolean(req.body.editable)
        req.body.activoFlujo = utils.changeToBoolean(req.body.activoFlujo)

        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "conceptos", acc: "a", registro: req.body.id })
        res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getById = async (req, res) => {    
    try {
        const data = await model.getById(req.body.id)
        if(!data.length) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "No existen registros cargados" })
        res.json({ status: true, data: data[0] })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postModificar = async (req, res) => {
    try {
        if((req.body.descripcion).trim().length == 0) return res.json({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la descripción' })
        if((req.body.descripcion).trim().length >= 100) return res.json({ status: false, icon:'error', title: 'Error', text: 'La descripcion superó la cantidad permitida' })
        if((req.body.descCorta).trim().length == 0) return res.json({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la descripción corta' })
        if((req.body.descCorta).trim().length >= 5) return res.json({ status: false, icon:'error', title: 'Error', text: 'La descripción corta superó la cantidad permitida' })
        if((req.body.tipo).trim().length == 0) return res.json({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar el tipo de movimiento' })

        req.body.editable = utils.changeToBoolean(req.body.editable)
        req.body.activoFlujo = utils.changeToBoolean(req.body.activoFlujo)
        req.body.activo = utils.changeToBoolean(req.body.activo)

        let result = await model.update(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "conceptos", acc: "m", registro: req.body.id })
        return res.json({ status: true, icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postEliminar = async (req, res) => {
    try {
        let result = await model.delete(req.body.id)

        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({usuario: req.session.user.id, tabla: "conceptos",acc: "b",registro: req.body.id});            
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}