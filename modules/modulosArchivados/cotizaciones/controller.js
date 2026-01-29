const model = require('./model')
const mTareas = require("../tareas/model")
const eventos = require("../eventos/controller")
const mProvincias = require("../provincias/model")
const mClientes = require("../clientes/model")
const mProyectos = require("../proyectos/model")
const utils = require('../../utils')
const swig = require('swig')
const numlet = require('../../public/js/numerosAletras')

swig.setFilter('numletras', numlet.numeroALetras)
swig.setFilter('currency', utils.formatCurrency)


exports.getLista = async (req, res) => {
    try {
        const provincias = await mProvincias.getProvincias()
        const clientes = await mClientes.getAllActivos()
        const estados = await  model.getAllEstadosActivos()

        res.render('cotizaciones/views/lista', {
            pagename: "Cotizaciones",
            permisos: req.session.user.permisos,
            estados, provincias, clientes
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        if(String(req.body.desde).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la fecha desde' })
        if(String(req.body.hasta).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la fecha hasta' })
        
        req.body.desde = utils.changeDateYMD(req.body.desde)
        req.body.hasta = utils.changeDateYMD(req.body.hasta)

        let params = [req.body.desde, req.body.hasta],
            query = `
                SELECT ct.*, c.razon_social AS clienteTxt, l.descripcion AS localidadTxt, l.cp, p.descripcion AS provinciaTxt, ce.descripcion AS estadoTxt
                FROM cotizaciones_titulos ct
                LEFT JOIN clientes c ON c.id = ct.id_cliente_fk 
                LEFT JOIN localidades l ON l.id = ct.id_localidad_fk 
                LEFT JOIN provincias p ON p.id = l.id_provincia_fk 
                LEFT JOIN cotizaciones_estados ce ON ce.id = ct.id_estado_fk 
                WHERE ct.fecha BETWEEN ? AND ?
            `
        if(req.body.estado != ''){
            query += ` AND ct.id_estado_fk = ?`
            params.push(req.body.estado)
        }

        let data = await model.execQuery(query, params)
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getAlta = async (req, res) => {
    try {
        if((req.body.descripcion).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripción.' })
        if((req.body.descripcion).trim().length >= 100) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La descripcion supero la cantidad permitida.' })
        if((req.body.desc_corta).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripcion corta.' })
        if((req.body.desc_corta).trim().length >= 5) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La descripcion corta supero la cantidad permitida.' })
        
        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        res.json({ status: true, type: "success", icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        let validacion = await ValidarCampos(req.body)
        if(!validacion.status) return res.json(validacion)

        req.body.fecha = utils.changeDateYMD(req.body.fecha)
        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({usuario: req.session.user.id, tabla: "Cotizaciones", acc: "a", registro: `Alta | ID:${resInsert.insertId}` })
        res.json({
            status: true, 
            icon:"success", 
            title: "Éxito", 
            text: `Solicitud procesada correctamente, será redirigido para ingresar los items de la cotización.<br><strong>ID de cotización: ${resInsert.insertId}</strong>`, 
            idCotizacionItem: resInsert.insertId
        })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getAltaItems = async (req, res) => {
    try {
        let cotizacionTit = await model.getCotizacionTituloById(req.params.id)
        if(cotizacionTit.length != 1) return res.redirect('/inicio')
        if(cotizacionTit[0].id_estado_fk > 2) return res.redirect('/inicio')

        let tareas = await mTareas.getAllbyActivo(1)
    
        res.render('cotizaciones/views/altaItems', {
            pagename: `Alta de tareas - Nro. de comprobante: ${String(cotizacionTit[0].id).padStart(8, '0')}`,
            permisos: req.session.user.permisos, 
            cotizacionTit: cotizacionTit[0],
            tareas
        })
    } catch (error) {
        console.log(error)
        return res.redirect('/inicio')
    }
}

exports.getListaItemsAjax = async (req, res) => {
    try {
        const cotizacionTit = await model.getCotizacionTituloById(req.body.idCotizacionItem)
        if(cotizacionTit.length != 1) return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        if(cotizacionTit[0].id_estado_fk > 2) return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        
        const total = await model.getTotalCotizacionByIdTitulo(req.body.idCotizacionItem)
        const data = await model.getCotizacionItemsById(req.body.idCotizacionItem)
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen registros cargados", total: total[0].total })
        res.json({ status: true, data, total: total[0].total })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postCerrarCotizacion = async (req, res) => {
    try {
        let data = await model.getCotizacionItemsById(req.body.idCotizacionItem)
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "Debe ingresar al menos una tarea a la cotización" })

        let result = await model.updateCotizacionEstado(2, req.body.idCotizacionItem)
        if(result.affectedRows > 0) return res.json({ status: true, icon:"success",  title: "Éxito", text: 'Solicitud procesada correctamente' })
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAltaItems = async (req, res) => {
    try {
        if(req.body.idCotizacionItem.length == 0)  return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
        if(String(req.body.idTarea).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la tarea' })
        if(String(req.body.tarea).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la tarea' })
        if(String(req.body.cantidad).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la cantidad' })
        if(String(req.body.kpi).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el porcentaje de KPI.' })
        if(String(req.body.precio).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el precio' })

        let resInsert = await model.insertItem(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({usuario: req.session.user.id, tabla: "Cotizaciones", acc: "a", registro: `Alta de item | ID:${resInsert.insertId}` })
        res.json({ status: true, icon:"success",  title: "Éxito", text: 'Solicitud procesada correctamente' })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getItemByIdAjax = async (req, res) => {
    try {
        const data = await model.getItemsById(req.body.id)
        if(!data.length) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        res.json({ status: true, data: data[0] })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postModificarItemAjax = async (req, res) => {
    try {
        const data = await model.getItemsById(req.body.id)
        if(!data.length) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })

            console.log(req.body)

        const result = await model.updateItem(req.body)
        if(result.affectedRows != 1) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        res.json({ status: true, icon:"success",  title: "Éxito", text: 'Solicitud procesada correctamente' })
        
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getById = async (req, res) => {    
    try {
        const data = await model.getCotizacionTituloById(req.body.id)
        if(!data.length) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "No existen registros cargados" })
        res.json({ status: true, data: data[0] })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postModificar = async (req, res) => {
    try {
        let validacion = await ValidarCampos(req.body)
        if(!validacion.status) return res.json(validacion)

        req.body.fecha = utils.changeDateYMD(req.body.fecha)

        let result = await model.update(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({usuario: req.session.user.id, tabla: "Cotizaciones", acc: "m", registro: req.body.id})
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postEliminar = async (req, res) => {
    try {
        let result = await model.delete(req.body.id)
        if(result.affectedRows == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        return res.json({ status: true, icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getVer = async (req, res) => {
    try {
        const titulo = await model.getCotizacionTituloById(req.body.id)
        if(titulo.length != 1) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        const detalles = await model.getCotizacionItemsById(req.body.id)
        const total = await model.getTotalCotizacionByIdTitulo(req.body.id)
        res.json({ titulo: titulo[0], detalles, total: total[0].total })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
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

exports.postConvertir = async (req, res) => {
    try {
        if((req.body.id).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al obtener la cotización, comuniquese con los programadores' })
        
        const cotizacionTitulo = await model.getCotizacionTituloById(req.body.id)
        if(!cotizacionTitulo) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al obtener la cotización' })

        if((req.body.descCorta).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la descripción corta' })
        if((req.body.descCorta).trim().length > 50) return res.json({ status: false, icon: 'error', title: 'Error', text: 'La descripción corta superó la cantidad de caracteres máximos' })
        if((req.body.responsable).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el nombre del responsable' })
        if((req.body.responsable).trim().length > 100) return res.json({ status: false, icon: 'error', title: 'Error', text: 'El nombre del responsable superó la cantidad de caracteres máximos' })
        if((req.body.mail).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el mail' })
        if((req.body.mail).trim().length > 100) return res.json({ status: false, icon: 'error', title: 'Error', text: 'El mail ingresado superó la cantidad de caracteres máximos' })
        if(!utils.validateEmail(req.body.mail)) return res.json({ status: false, icon: 'error', title: 'Error', text: 'El mail ingresado no es válido' })
        if((req.body.telefono).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el teléfono' })
        if((req.body.telefono).trim().length > 60) return res.json({ status: false, icon: 'error', title: 'Error', text: 'El teléfono ingresado superó la cantidad de caracteres máximos' })

        const cotizacionDetalles = await model.getCotizacionItemsById(req.body.id)
        if(!cotizacionDetalles) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al obtener la cotización' })
        
        // COPIO COTIZACION PARA INSERTAR EN PROYECTOS TITULO Y DETALLES
        // TITULO
        const obj = {
            cliente: cotizacionTitulo[0].id_cliente_fk,
            fecha: utils.generateTodayDateYMD(),
            descripcion: cotizacionTitulo[0].descripcion,
            descCorta: req.body.descCorta,
            responsable: req.body.responsable,
            mailRes: req.body.mail,
            telefonoRes: req.body.telefono,
            localidad: cotizacionTitulo[0].id_localidad_fk,
            observaciones: cotizacionTitulo[0].observaciones
        }
        const insertProyect = await mProyectos.insert(obj)
        if(insertProyect.affectedRows == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud (1)' })

        // DETALLES
        let query = `INSERT INTO proyectos_detalles (id_proyectotitulo_fk, cantidad, precio, id_tarea_fk, tarea, observaciones) VALUES `
        let params=[]                
        for(let i=0; i<cotizacionDetalles.length; i++){
            query += `(?,?,?,?,?,?)${i == cotizacionDetalles.length-1 ? ';':','}`
            params.push(
                cotizacionDetalles[i].id_cotizaciontitulo_fk,
                cotizacionDetalles[i].cantidad, 
                cotizacionDetalles[i].precio, 
                cotizacionDetalles[i].id_tarea_fk, 
                cotizacionDetalles[i].tarea, 
                cotizacionDetalles[i].observaciones
            )
        }

        const resultDetalles = await model.execQuery(query, params)
        if(resultDetalles.affectedRows == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud (2)' })

        const result = await model.updateCotizacionProyecto(insertProyect.insertId, req.body.id)
        if(result.affectedRows == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud (3)' })
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

const ValidarCampos = o => {
    return new Promise(async (resolve, reject) => {
        if(String(o.cliente).trim().length == 0) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe seleccionar el cliente' })
        if(String(o.provincia).trim().length == 0) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe seleccionar la provincia' })
        if(String(o.localidad).trim().length == 0) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe seleccionar la localidad' })
        if(String(o.descripcion).trim().length == 0) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar una descripción' })
        if(String(o.fecha).trim().length == 0) resolve({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe seleccionar la fecha' })
        resolve({ status: true })
    })
}