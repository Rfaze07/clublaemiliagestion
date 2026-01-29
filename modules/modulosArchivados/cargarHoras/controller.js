const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")


exports.getLista = async (req, res) => {
    try {
        res.render('cargarHoras/views/index', {
            pagename: "Carga de horas",
            permisos: req.session.user.permisos
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        console.log(req.body)

        if(String(req.body.desde).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe seleccionar la fecha desde' })
        if(String(req.body.hasta).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe seleccionar la fecha hasta' })

        req.body.desde = utils.changeDateYMD(req.body.desde)
        req.body.hasta = utils.changeDateYMD(req.body.hasta)

        const data = await model.getAllListaByRangoFechas(req.body, req.session.user.id)
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getListaEstadosActivosAjaxSelect = async (req, res) => {
    try {
        let data = await model.getAllEstadosActivos()
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen estados de horas activos" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        if(String(req.body.cliente).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe seleccionar el cliente' })
        if(String(req.body.fecha).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe seleccionar la fecha' })
        if(String(req.body.horas).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar las horas' })
        if(String(req.body.horas).trim() == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar las horas' })
        if(String(req.body.proyecto).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe seleccionar el proyecto' })
        if(String(req.body.tarea).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe seleccionar la tarea' })
        if(String(req.body.descripcion).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descipción del trabajo realizado' })

        req.body.fecha = utils.changeDateYMD(req.body.fecha)

        let resInsert = await model.insert(req.body, req.session.user.id)
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
        if((req.body.descripcion).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripción.' })
        if((req.body.descripcion).trim().length >= 100) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La descripcion supero la cantidad permitida.' })
        if((req.body.desc_corta).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripcion corta.' })
        if((req.body.desc_corta).trim().length >= 5) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La descripcion corta supero la cantidad permitida.' })
        req.body.activo = utils.changeToBoolean(req.body.activo)

        let result = await model.update(req.body)

        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({usuario: req.session.user.id, tabla: "Cargos",acc: "m",registro: req.body.id}); 
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

// exports.postEliminar = async (req, res) => {
//     try {
//         let result = await model.delete(req.body.id)
//         if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
//         await eventos.insertarEvento({usuario: req.session.user.id, tabla: "Cargos",acc: "b",registro: req.body.id});            
//         return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

//     } catch (error) {
//         console.log(error)
//         return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
//     }
// }