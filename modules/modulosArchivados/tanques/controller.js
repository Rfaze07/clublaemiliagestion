const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")


exports.getLista = async (req, res) => {
    try {
        res.render('tanques/views/index', {
            pagename: "Tanques",
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
        return res.json({ status: false, type: "error",icon:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getListaSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllbyActivo(1)
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen tanques cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        const validacion = await ValidarCampos(req.body)
        if(!validacion.status) return res.json(validacion)

        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Tanques", acc: "a", registro: resInsert.insertId })
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
        const validacion = await ValidarCampos(req.body)
        if(!validacion.status) return res.json(validacion)

        let result = await model.update(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Tanques", acc: "m", registro: req.body.id })
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postEliminar = async (req, res) => {
    try {
            const tanque = await model.puedoEliminarByTanque(req.body.id)
            if(tanque[0].puedoEliminar == 0) return res.json({ status: false, icon: "error", title: "Error", text: "El tanque seleccionado no se puede eliminar ya que se utiliza en vales de combustible" })
    
            let result = await model.delete(req.body.id)
            if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
            await eventos.insertarEvento({usuario: req.session.user.id, tabla: "Cargos",acc: "b",registro: req.body.id});            
            return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })
    
        } catch (error) {
            console.log(error)
            return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        }
}

const ValidarCampos = o => {
    return new Promise((resolve, reject) => {
        if(String(o.desc_corta).trim().length == 0) return res.json({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la descripción corta' })
        if(String(o.desc_corta).trim().length > 4) return res.json({ status: false, icon:'error', title: 'Error', text: 'La descripción corta supero la cantidad permitida. (Máx.: 4)' })
        if(String(o.descripcion).trim().length == 0) return res.json({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la descripción' })
        if(String(o.descripcion).trim().length > 100) return res.json({ status: false, icon:'error', title: 'Error', text: 'La descripción superó la cantidad permitida. (Máx.: 100)' })
        if(String(o.capacidad).trim().length == 0) return res.json({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la la capacidad del tanque' })
        if(isNaN(o.capacidad)) return res.json({ status: false, icon:'error', title: 'Error', text: 'La capacidad del tanque debe ser numérico' })
        
        o.desc_corta = o.desc_corta.toUpperCase()
        o.activo = utils.changeToBoolean(o.activo)

        return resolve({ status: true })
    })
}
