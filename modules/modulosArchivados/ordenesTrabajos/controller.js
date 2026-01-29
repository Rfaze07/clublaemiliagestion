const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")
const mEmpleado = require("../empleados/model")


exports.getLista = async (req, res) => {
    try {
        res.render('ordenesTrabajos/views/lista', {
            pagename: "Órdenes de trabajos",
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
        return res.json({ status: false, con:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getListaSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllbyActivo(1)
        if(!data.length) return res.json({ status: false, icon:"warning", title: "Alerta", text: "No existen rubros cargados" })
        return res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        const validaciones = await ValidarCampos(req.body)
        if(!validaciones.status) return res.json(validaciones)

        req.body.usuario = req.session.user.id

        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "OT", acc: "a", registro: resInsert.insertId })
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
        const validaciones = await ValidarCampos(req.body)
        if(!validaciones.status) return res.json(validaciones)

        req.body.usuario = req.session.user.id

        let result = await model.update(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "OT", acc: "m", registro: req.body.id })
        return res.json({ status: true, icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postDetalles = async (req, res) => {
    try {
        if(req.query.id == undefined) return res.redirect('/inicio')

        const orden = await model.getById(req.query.id)
        if(orden.length == 0) return res.redirect('/inicio')

        res.render('ordenesTrabajos/views/detalles', {
            pagename: `Detalles de la OT - Nº ${orden[0].nroOT}`, 
            permisos: req.session.user.permisos,
            orden: orden[0]
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.postEliminar = async (req, res) => {
    try {

        let movimientos = await model.getMovimientosByIdOT(req.body.id)
        if(movimientos.length > 0) return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "La Orden de Trabajo que desea eliminar tiene Movimientos asignados. No se puede eliminar." })
        
        let tareas = await model.getTareasByIdOT(req.body.id)
        if(tareas.length > 0) return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "La Orden de Trabajo que desea eliminar tiene Tareas asignadas. No se puede eliminar." })
        
        let novedades = await model.getNovedadesByIdOT(req.body.id)
        if(novedades.length > 0) return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "La Orden de Trabajo que desea eliminar tiene Novedades asignadas. No se puede eliminar." })

        
        let result = await model.delete(req.body.id)
        if(result.affectedRows == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Rubros", acc: "b", registro: req.body.id })            
        return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

const ValidarCampos = o => {
    return new Promise(async (resolve, reject) => {
        if(String(o.fecha).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la fecha' })
        if(String(o.tipoOT).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el tipo de órden de trabajo' })
        if(o.tipoOT != 5 && o.tipoOT != 6){
            if(String(o.tipoVehiculo).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el tipo de vehículo' })
            if(String(o.vehiculo).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el vehículo' })
        }else if(o.tipoOT == 5){
            if(String(o.empleado).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el empleado' })
            o.tipoVehiculo = null
            o.vehiculo = null
        }else if(o.tipoOT == 6){
            o.tipoVehiculo = null
            o.vehiculo = null
        }
        if(String(o.estadoOT).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el estado de órden de trabajo' })
        if(String(o.puesto).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el puesto' })
        if(String(o.empleado).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el responsable' })

        o.fecha = utils.changeDateYMD(o.fecha)
        o.activo = utils.changeToBoolean(o.activo)

        const empleado = await mEmpleado.getById(o.empleado)
        o.idEmpleado = o.empleado
        o.responsable = `(${empleado[0].nro_legajo}) - ${empleado[0].apellido}, ${empleado[0].nombre}`

        return resolve({ status: true })
    })
}

exports.postImprimir = async (req, res) => {
    try {
        if(req.query.id == undefined) return res.redirect('/inicio')

        const orden = await model.getById(req.query.id)
        if(orden.length == 0) return res.redirect('/inicio')

        const movimientos = await model.getMovimientosByIdOT(req.query.id)
        const tareas = await model.getTareasByIdOT(req.query.id)
        const novedades = await model.getNovedadesByIdOT(req.query.id)

        orden[0].impreso = req.session.user.nombre

        res.render('ordenesTrabajos/views/imprimir', {
            pagename: "Impresión O.T.", orden: orden[0], movimientos, tareas, novedades
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.postBlindar = async (req, res) => {
    try {
        const result = await model.updateBlindarById(req.body.id)
        if(result.affectedRows == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud, comuniquese con lo programadores' })
    }
}





// =============  MOVIMIENTOS  =========================================

exports.postListaMovimientosAjax = async (req, res) => {
    try {
        if(req.body.id == undefined) return res.json({ status: false, error: true })
        const ordenTrabajo = await model.getById(req.body.id)
        if(ordenTrabajo.length == 0) return res.json({ status: false, error: true })
        
        const movimientos = await model.getMovimientosByIdOT(req.body.id)
        if(movimientos.length == 0) return res.json({ status: false, text: 'Sin movimientos registrados.' })
        return res.json({ status: true, movimientos })

    } catch (error) {
        console.log(error)
        return res.redirect('/inicio')
    }
}

exports.postAltaMovimiento = async (req, res) => {
    try {
        const validaciones = await ValidarCamposMovimientos(req.body)
        if(!validaciones.status) return res.json(validaciones)

        const result = await model.insertMovimiento(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud (1)' })
        return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}


exports.postModificarMovimiento = async (req, res) => {
    try {
        const validaciones = await ValidarCamposMovimientos(req.body)
        if(!validaciones.status) return res.json(validaciones)



        const result = await model.updateMovimiento(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud (1)' })
        return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postBorrarMovimiento = async (req, res) => {
    try {
        const result = await model.deleteMovimientoById(req.body.id)
        if(result.affectedRows == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postMovimientoAjax = async (req, res) => {
    try {
        const data = await model.getMovimientoById(req.body.id)
        if(data.affectedRows == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        return res.json({ status: true, data: data[0] })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

const ValidarCamposMovimientos = o => {
    return new Promise(async (resolve, reject) => {
        if(String(o.idOrdenTrabajo).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error, comuniquese con los programadores' })
        if(isNaN(o.idOrdenTrabajo)) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error, comuniquese con los programadores' })
        if(String(o.repuesto).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el repuesto' })
        
        
        const ot = await model.getById(o.idOrdenTrabajo)
        if(o.esNeumatico == 1){
            if(String(o.ubicacion).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la ubicación' })
            o.vehiculo = ot[0].id
        }else{
            o.ubicacion = null
            o.vehiculo = null
        }
        
        if(o.esFicha == 1){
            if(String(o.ficha).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la ficha' })
            o.vehiculo = ot[0].id
        }else{
            o.ficha = null
            o.vehiculo = null
        }



        if(String(o.cantidad).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la cantidad' })
        if(isNaN(o.cantidad)) return resolve({ status: false, icon: 'error', title: 'Error', text: 'La cantidad debe ser numérica' })
        if(String(o.kmsIni).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar los kilómetros iniciales' })
        if(String(o.deposito).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el depósito' })
        if(String(o.imputacion).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la imputación' })
        
        o.tipoMovimiento = 1
        o.fecha = ot[0].fecha
        return resolve({ status: true })
    })
}




// =============  TAREAS  =========================================

exports.postListaTareasAjax = async (req, res) => {
    try {
        if(req.body.id == undefined) return res.json({ status: false, error: true })
        const ordenTrabajo = await model.getById(req.body.id)
        if(ordenTrabajo.length == 0) return res.json({ status: false, error: true })
        
        const tareas = await model.getTareasByIdOT(req.body.id)
        if(tareas.length == 0) return res.json({ status: false, text: 'Sin tareas registradas.' })
        return res.json({ status: true, tareas })

    } catch (error) {
        console.log(error)
        return res.redirect('/inicio')
    }
}

exports.postAltaTarea = async (req, res) => {
    try {
        const validaciones = await ValidarCamposTareas(req.body)
        if(!validaciones.status) return res.json(validaciones)

        const result = await model.insertTarea(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud (1)' })
        return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

const ValidarCamposTareas = o => {
    return new Promise(async (resolve, reject) => {
        if(String(o.idTarea).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la tarea' })
        if(String(o.tarea).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el la tarea o ingresar la descripción' })
        if(String(o.imputacion).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la imputación' })
        
        o.realizado = utils.convertChbBoolean(o.realizado)

        return resolve({ status: true })
    })
}

exports.postUpdateTareaRealizada = async (req, res) => {
    try {
        req.body.estado = utils.convertChbBoolean(req.body.estado)
        const result = await model.updateRealizadoById(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud, comuniquese con lo programadores' })
    }
}

exports.postBorrarTarea = async (req, res) => {
    try {
        const result = await model.deleteTareaById(req.body.id)
        if(result.affectedRows == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}


// =============  NOVEDADES  =========================================

exports.postListaNovedadesAjax = async (req, res) => {
        try {
        if(req.body.id == undefined) return res.json({ status: false, error: true })
        const ordenTrabajo = await model.getById(req.body.id)
        if(ordenTrabajo.length == 0) return res.json({ status: false, error: true })
        
        const novedades = await model.getNovedadesByIdOT(req.body.id)
        if(novedades.length == 0) return res.json({ status: false, text: 'Sin novedades registradas.' })
        return res.json({ status: true, novedades })

    } catch (error) {
        console.log(error)
        return res.redirect('/inicio')
    }
}

exports.postUpdateNovedadAsignaOT = async(req, res) =>{
    try {

        console.log(req.body.estado)

        if (req.body.estado == 1){
            req.body.estado = 'Realizado'
        }else{
            req.body.estado = 'Pendiente'
        }


        const result = await model.updateNovedadAsignaOT(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud, comuniquese con lo programadores' })
    }
}


const ValidarCamposNovedad = o => {
    return new Promise(async (resolve, reject) => {
        if(String(o.idTarea).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la tarea' })
        if(String(o.tarea).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el la tarea o ingresar la descripción' })
        if(String(o.imputacion).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la imputación' })
        
        o.realizado = utils.convertChbBoolean(o.realizado)

        return resolve({ status: true })
    })
}

exports.postUpdateNovedadRealizada = async (req, res) => {
    try {
        console.log(req.body.estado)
        if (req.body.estado == 'true'){
            req.body.estado = 'Realizado'
        }else{
            req.body.estado = 'Pendiente'
        }
        const result = await model.updateNovedadRealizado(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud, comuniquese con lo programadores' })
    }
}

exports.postUpdateNovedadQuitarOT = async (req, res) =>{
     try {   
        
        const result = await model.updateNovedadQuitaOT(req.body.id)
        if(result.affectedRows == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud, comuniquese con lo programadores' })
    }
}