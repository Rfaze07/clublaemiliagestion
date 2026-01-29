const model = require('./model')
const eventos = require("../eventos/controller")
const utils = require('../../utils')


exports.getLista = async (req, res) => {
    try {
        res.render('medicos/views/index', {
            pagename: "Médicos",
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

exports.getListaSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllbyActivo(1)
        if(!data.length) return res.json({ status: false, icon:"warning", title: "Alerta", text: "No existen médicos cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        const validacion = await ValidarCampos(req.body)
        if(!validacion.status) return res.json(validacion)

        const matricula = await model.getByMatriculaExiste(req.body.matricula)
        if(matricula[0].existe > 0) return res.json({ status: false, icon: "error", title: "Error", text: "La matrícula ingresada ya existe" })
        
        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Medicos", acc: "m", registro: req.body.id })
        res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getById = async (req, res) => {    
    const data = await model.getById(req.body.id)
    if(!data.length) return res.json({ status: false, icon:'error', title: "Error", text: "No existen registros cargados" })
    res.json({ status: true, data: data[0] })
}

exports.postModificar = async (req, res) => {
    try {
        const validacion = await ValidarCampos(req.body)
        if(!validacion.status) return res.json(validacion)

        req.body.activo = utils.changeToBoolean(req.body.activo)

        let result = await model.update(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Medicos", acc: "m", registro: req.body.id })
        return res.json({ status: true, icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postEliminar = async (req, res) => {
    try {
        const puedoEliminar = await model.getPuedoEliminar(req.body.id)
        if(puedoEliminar.length > 0) return res.json({ status: false, icon: "error", title: "Error", text: "El médico seleccionado no se puede eliminar" })

        let result = await model.delete(req.body.id)
        if(result.affectedRows == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Medicos", acc: "b", registro: req.body.id})            
        return res.json({ status: true, icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

const ValidarCampos = o => {
    return new Promise(async (resolve, reject) => {
        // if((o.matricula).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la matrícula' })
        if((o.matricula).trim().length > 20) return resolve({ status: false, icon:'error', title: 'Error', text: 'La matrícula superó la cantidad permitida. (Máx: 20)' })
        if((o.nombre).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar el nombre' })
        if((o.nombre).trim().length > 100) return resolve({ status: false, icon:'error', title: 'Error', text: 'La nombre superó la cantidad permitida. (Máx: 100)' })
        if((o.apellido).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar el apellido' })
        if((o.apellido).trim().length > 100) return resolve({ status: false, icon:'error', title: 'Error', text: 'El apellido superó la cantidad permitida. (Máx: 100)' })
        resolve({ status: true })
    })
}