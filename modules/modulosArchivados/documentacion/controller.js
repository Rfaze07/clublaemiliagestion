const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")


exports.getLista = async (req, res) => {
    try {
        res.render('documentacion/views/index', {
            pagename: "Documentación",
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
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getListaSelectAjax = async (req, res) => {
    try {
        const data = await model.getDocumentacionActivoByIdTipoDoc(req.body.id)
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen datos cargados para el tipo de ducumentación seleccionado" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        const validar = await ValidarCampos(req.body)
        if(!validar.status) return res.json(validar)
        
        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Documentacion", acc: "a", registro: req.body.id })
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

        req.body.activo = utils.changeToBoolean(req.body.activo)

        let result = await model.update(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Documentacion", acc: "m", registro: req.body.id })
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postEliminar = async (req, res) => {
    return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "falta" })
    // try {
    //     let result = await model.delete(req.body.id)
    //     if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    //     await eventos.insertarEvento({usuario: req.session.user.id, tabla: "Cargos",acc: "b",registro: req.body.id});            
    //     return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    // } catch (error) {
    //     console.log(error)
    //     return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    // }
}

const ValidarCampos = o => {
    return new Promise((resolve, reject) => {
        if(String(o.tipoDocumentacion).trim().length == 0) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe seleccionar el tipo de documentación' })
        if(String(o.descCorta).trim().length == 0) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripcion corta' })
        if(String(o.descCorta).trim().length > 5) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La descripcion corta superó la cantidad permitida de caracteres (Máx.: 4)' })
        if(String(o.descripcion).trim().length == 0) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripción' })
        if(String(o.observaciones).trim().length > 500) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Las observaciones superaron la cantidad permitida de caracteres (Máx.: 500)' })        
        if(String(o.diasVigencia).trim().length == 0) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la cantidad de días de vigencia' })
        if(String(o.diasVigencia).trim().length > 999) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La cantidad de días de vigencia debe ser menor a 999 días' })
        if(String(o.diasAlarma).trim().length == 0) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la cantidad de días de alarma' })
        if(String(o.diasAlarma).trim().length > 999) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La cantidad de días de alarma debe ser menor a 999 días' })
        resolve({ status: true })
    })
}