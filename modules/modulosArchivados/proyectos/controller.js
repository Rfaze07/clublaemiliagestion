const model = require('./model')
const mProvincias = require('../provincias/model')
const mClientes = require('../clientes/model')
const utils = require('../../public/js/utils')
const eventos = require("../eventos/controller")

exports.getLista = async (req, res) => {
    try {
        const clientes = await mClientes.getAllActivos()
        const provincias = await mProvincias.getProvincias()

        res.render('proyectos/views/lista', {
            pagename: "Proyectos",
            permisos: req.session.user.permisos,
            provincias, clientes
        })
    } catch (error) {
        console.error(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        if(!req.body.activo) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error" })

        const data = req.body.activo == 't' ? await model.getAll() : await model.getAllbyActivo(req.body.activo)
        if (!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req,res) => {
    try {

        
        if(String(req.body.descripcion).trim().length == 0)  return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar una descripcion' })
        
        if(String(req.body.localidad).trim().length == 0){
            req.body.localidad = 1;
        }
        
        if(!req.body.cliente) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar un cliente' })
        
        req.body.fecha = utils.changeDateYMD(req.body.fecha)

        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.getModificar = async (req,res) => {
    try {
        const data = await model.getById(req.body.id)
        if(!data.length) return res.json({ status: false, icon: "error", icon:'error', title: "Error", text: "Hubo un error, comuniquese con los programadores." })
        res.json({ status: true, data: data[0] })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postModificar = async (req,res) => {
    try {
        const validacion = await ValidarCampos(req.body)
        if(!validacion.status) return res.json(validacion)

        req.body.activo = utils.convertChbBoolean(req.body.activo)

        let resInsert = await model.update(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postVer = async (req,res) => {
    try {
        const titulo = await model.getProyectoTituloById(req.body.id)
        if(titulo.length != 1) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        const detalles = await model.getProyectoItemsById(req.body.id)
        const total = await model.getTotalProyectoByIdTitulo(req.body.id)
        res.json({ titulo: titulo[0], detalles, total: total[0].total })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postBorrar = async (req,res) => {
    try {
        let result = await model.delete(req.body.id)

        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({usuario: req.session.user.id, tabla: "proyectos",acc: "b",registro: req.body.id});            
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

const ValidarCampos = o => {
    return new Promise((resolve, reject) => {
        if(String(o.fecha).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar una fecha' })
        if(String(o.descripcion).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar una descripcion' })
        if(String(o.descCorta).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar una descripcion  corta' })
        if(String(o.localidad).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe selecciona la localidad' })
        if(String(o.responsable).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el nombre del responsable' })
        if(!o.cliente) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar un cliente' })
        if(String(o.mailRes).trim().length == 0){
            resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el mail del responsable' })
        }else{
            if(!utils.validarMail(String(o.mailRes).trim())) 
                resolve({ status: false, icon: "error", title: "Error", text: "El mail del responsable ingresado no es válido. Ej.: abc@ejemplo.com" })
        }
        if(String(o.telefonoRes).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el teléfono del responsable' })
        resolve({ status: true })
    })
}


exports.getAltaItems = async (req, res) => {
    try {
        let proyectoTit = await model.getById(req.params.id)
        if(proyectoTit.length != 1) return res.redirect('/inicio')
        if(proyectoTit[0].id_estado_fk > 2) return res.redirect('/inicio')
 
        proyectoTit[0].cuit = utils.formatCUIT(proyectoTit[0].cuit)

        res.render('proyectos/views/altaItems', {
            pagename: `Alta de tareas - Nro. de comprobante: ${String(proyectoTit[0].id).padStart(8, '0')}`,
            permisos: req.session.user.permisos, 
            proyectoTit: proyectoTit[0]
        })
    } catch (error) {
        console.log(error)
        return res.redirect('/inicio')
    }
}

exports.getListaItemsAjax = async (req, res) => {
    try {
        const proyectoTit = await model.getProyectoTituloById(req.body.idProyectoItem)
        if(proyectoTit.length != 1) return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        if(proyectoTit[0].id_estado_fk > 2) return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        
        const total = await model.getTotalProyectoByIdTitulo(req.body.idProyectoItem)
        const data = await model.getProyectoItemsById(req.body.idProyectoItem)
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen registros cargados", total: total[0].total })
        res.json({ status: true, data, total: total[0].total })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAltaItems = async (req, res) => {
    try {
        if(req.body.idProyectoItem.length == 0)  return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
        if(String(req.body.idTarea).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la tarea' })
        if(String(req.body.tarea).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la tarea' })
        if(String(req.body.cantidad).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la cantidad' })
        if(String(req.body.kpi).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el porcentaje de KPI.' })
        if(String(req.body.precio).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el precio' })
        if(String(req.body.idCargo).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el cargo' })

        let resInsert = await model.insertItem(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({usuario: req.session.user.id, tabla: "Proyectos", acc: "a", registro: `Alta de item | ID:${resInsert.insertId}` })
        res.json({ status: true, icon:"success",  title: "Éxito", text: 'Solicitud procesada correctamente' })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getItemByIdAjax = async (req, res) => {

}

exports.postModificarItemAjax = async (req, res) => {

}

exports.postCerrarProyecto = async (req, res) => {
    try {
        let data = await model.getProyectoItemsById(req.body.idProyectoItem)
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "Debe ingresar al menos una tarea al proyecto" })

        let result = await model.updateProyectoEstado(2, req.body.idProyectoItem)
        if(result.affectedRows > 0) return res.json({ status: true, icon:"success",  title: "Éxito", text: 'Solicitud procesada correctamente' })
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postActualizarEstado = async (req, res) => {
    try {
        let result = await model.updateCotizacionEstado(req.body.estado, req.body.id)
        if(result.affectedRows == 1) return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}






exports.getProyectosAceptados = async (req,res) => {
    try {
        let data = await model.getAllAceptados()
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.getProyectosCliente = async (req,res) => {
    try {
        if(String(req.body.cliente).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el cliente' })

        let result = await model.getByIdClienteAceptados(req.body.cliente)
        // if(result.length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'No existen proyectos para el cliente seleccionado' })
        res.json({ status: true, data: result })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.getProyectosCompletoCliente = async (req,res) => {
    try {
        if(String(req.body.idComprobante).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
        if(String(req.body.idProyectoTitulo).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })

        let data = await model.getByIdClienteAceptados(req.body.cliente)
        res.json({ status: true, data })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.getTareasProyectosCompletoCliente = async (req,res) => {
    try {
        if(String(req.body.idProyectoTitulo).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })

        let data = await model.getProyectoItemsEmpleadosById(req.body.idProyectoTitulo, req.session.user.id_cargo_fk)
        res.json({ status: true, data })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}