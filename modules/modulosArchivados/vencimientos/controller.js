const model = require('./model');
const utils = require('../../utils')
const eventos = require("../eventos/controller");


exports.getLista = async (req, res) => {
    try {
        res.render('vencimientos/views/index', {
            pagename: "Vencimientos",
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
        if(!data.length) return res.json({ status: false, icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        const validar = await ValidarCampos(req.body)
        if(!validar.status) return res.json(validar)
        

        if(req.body.tipoDocumentacion == 2){
            req.body.empleado = 0
        }else if(req.body.tipoDocumentacion == 3){
            req.body.vehiculo = 0
        }else{
            req.body.empleado = 0
            req.body.vehiculo = 0
        }

        req.body.unica = req.session.user.id
        req.body.fechaVenc = utils.changeDateYMD(req.body.fechaVenc)

        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Vencimientos", acc: "a", registro: req.body.id })
        res.json({ status: true, type: "success", icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
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
        if(!validar.status) return res.json(validar)
        
            
        if(req.body.tipoDocumentacion == 2){
            req.body.empleado = 0
        }else if(req.body.tipoDocumentacion == 3){
            req.body.vehiculo = 0
        }else{
            req.body.empleado = 0
            req.body.vehiculo = 0
        }

        req.body.unica = req.session.user.id
        req.body.fechaVenc = utils.changeDateYMD(req.body.fechaVenc)
        req.body.activo = utils.changeToBoolean(req.body.activo)

        let result = await model.update(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Vencimientos", acc: "m", registro: req.body.id })
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postEliminar = async (req, res) => {
    try {
        let result = await model.delete(req.body.id)
        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Vencimientos", acc: "b", registro: req.body.id })
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

const ValidarCampos = o => {
    return new Promise((resolve, reject) => {
        if(String(o.tipoDocumentacion).trim().length == 0) resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar el tipo de documentación' })
        if(String(o.documentacion).trim().length == 0) resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar la documentación' })
        // if(String(o.descripcion).trim().length == 0) resolve({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la descripción' })
        if(String(o.fechaVenc).trim().length == 0) resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar la fecha de vencimiento' })
        if(o.fechaVenc.length < 10) resolve({ status: false, icon:'error', title: 'Error', text: 'La fecha de vencimiento ingresada no es válida' })

        if(String(o.descripcion).trim().length == 0) o.descripcion = String(o.descripcion).trim()

        resolve({ status: true })
    })
}