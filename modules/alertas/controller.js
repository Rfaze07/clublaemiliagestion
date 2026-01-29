const model = require('./model')
const eventos = require("../eventos/controller")
const mUsuarios = require("../usuarios/model")
const utils = require('../../utils')


exports.getLista = async (req, res) => {
    try {
        res.render('alertas/views/index', {
            pagename: "Alertas",
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
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        const validar = await ValidarCampos(req.body)
        if(!validar.status) return res.json(validar)

        req.body.activoInicio = utils.changeToBoolean(req.body.activoInicio)
        req.body.activoPopup = utils.changeToBoolean(req.body.activoPopup)

        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Sucursales", acc: "a", registro: req.body.id })
        res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getById = async (req, res) => {    
    const data = await model.getById(req.body.id)
    if(!data.length) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "No existen registros cargados" })
    res.json({ status: true, data: data[0] })
}

exports.postModificar = async (req, res) => {
    try {
        const validar = await ValidarCampos(req.body)
        if(!validar.status) return validar

        req.body.activoInicio = utils.changeToBoolean(req.body.activoInicio)
        req.body.activoPopup = utils.changeToBoolean(req.body.activoPopup)
        req.body.activo = utils.changeToBoolean(req.body.activo)

        let result = await model.update(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Sucursales", acc: "m", registro: req.body.id })
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postEliminar = async (req, res) => {
    return res.json({ status: false, icon: "error", title: "Error", text: "falta vinculacion" })
    // try {
    //     let result = await model.delete(req.body.id)
    //     if(result.affectedRows == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    //     await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Cargos", acc: "b", registro: req.body.id })
    //     return res.json({ status: true, icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })
    // } catch (error) {
    //     console.log(error)
    //     return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    // }
}

const ValidarCampos = o => {
    return new Promise(async (resolve, reject) => {
        if(String(o.moduloAlerta).trim().length == 0) resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar el módulo' })
        if(String(o.cargo).trim().length == 0) resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar el cargo' })
        if(String(o.descripcion).trim().length == 0) resolve({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la descripción' })
        if(String(o.descripcion).trim().length > 100) resolve({ status: false, icon:'error', title: 'Error', text: 'La descripción superó la cantidad máxima de caracteres permitidos' })
        resolve({ status: true })
    })
}







/*********************************
        MODULOS - ALETAS
*********************************/

exports.getListaSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllModulosAlarmaActivos()
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}