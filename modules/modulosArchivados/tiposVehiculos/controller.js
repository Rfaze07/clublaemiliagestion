const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")


exports.getLista = async (req, res) => {
    try {
        res.render('tiposVehiculos/views/index', {
            pagename: "Tipos de vehículos",
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
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getTipoSeleccionadoAjax = async (req, res) => {
    try {
        const data = await model.getTipoSeleccionadoAjax(req.body.id)
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros de tipos de vehículos cargados" })
        res.json({ status: true, data: data[0] })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getTipoSeleccionadoParamAjax = async (req, res) => {
    try {
        const data = await model.getTipoSeleccionadoChoferAjax()
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros de tipos de vehículos cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        const validacion = await ValidarCampos(req.body)
        if(!validacion.status) return res.json(validacion)

        req.body.asignaChofer = utils.changeToBoolean(req.body.asignaChofer)
        req.body.asignaSemi = utils.changeToBoolean(req.body.asignaSemi)
        req.body.gasoil = utils.changeToBoolean(req.body.gasoil)
        
        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
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
        // if((req.body.descripcion).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripción.' })
        // if((req.body.descripcion).trim().length >= 100) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La descripcion supero la cantidad permitida.' })
        // if((req.body.desc_corta).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripcion corta.' })
        // if((req.body.desc_corta).trim().length >= 5) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La descripcion corta supero la cantidad permitida.' })

        const validacion = await ValidarCampos(req.body)
        if(!validacion.status) return res.json(validacion)
        
        req.body.activo = utils.changeToBoolean(req.body.activo)
        req.body.asignaChofer = utils.changeToBoolean(req.body.asignaChofer)
        req.body.asignaSemi = utils.changeToBoolean(req.body.asignaSemi)
        req.body.gasoil = utils.changeToBoolean(req.body.gasoil)

        let result = await model.update(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({usuario: req.session.user.id, tabla: "Cargos",acc: "m",registro: req.body.id}); 
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postEliminar = async (req, res) => {
    try {

 let vehiculos = await mVehiculos.getAllByTipoVehiculo(req.body.id)
         if(vehiculos.length > 1) return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "El tipo de vehiculo que desea eliminar se encuentra asignado a uno o mas vehiculos. No se puede eliminar." })
        
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
        if(String(o.descripcion).trim().length == 0) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripción' })
        if(String(o.descripcion).trim().length >= 100) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La descripcion superó la cantidad permitida' })
        if(String(o.desc_corta).trim().length == 0) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripcion corta' })
        if(String(o.desc_corta).trim().length >= 5) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La descripcion corta superó la cantidad permitida' })
        if(String(o.ejes).trim().length == 0) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la cantidad de ejes' })
        if(String(o.ejes).trim().length > 2) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La cantidad de ejes superó la cantidad permitida' })
        resolve({ status: true })
    })
}