const model = require('./model')
const mRepuestos = require('../repuestos/model')
const eventos = require("../eventos/controller")
const utils = require('../../public/js/utils')


exports.getLista = async (req, res) => {
    try {
        res.render('fichasRepuestos/views/index', {
            pagename: "Fichas de repuestos",
            permisos: req.session.user.permisos
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

// exports.getListaActivosAjaxSelect = async (req, res) => {
//     try {
//         const data = await model.getAllActivos()
//         res.json({ status: true, data })
//     } catch (error) {
//         console.log(error)
//         res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
//     }
// }





exports.getListaAjax = async (req, res) => {
    try {
        let params=[], 
            query = `
            SELECT rf.id, r.descripcion AS respuestoTxt, m.descripcion AS marcaTxt, r.codigo, rf.nro_serie, 
                    rf.neumatico, rf.medida_neumatico, IFNULL(cn.descripcion, '') AS condicionTxt
            FROM repuestos_ficha rf
            LEFT JOIN repuestos r ON r.id = rf.id_repuesto_fk 
            LEFT JOIN marcas m ON m.id = r.id_marca_fk 
            LEFT JOIN proveedores p ON p.id = rf.id_proveedor_fk 
            LEFT JOIN comprobantes c ON c.id = rf.id_comprobante_fk 
            LEFT JOIN condiciones_neumaticos cn ON cn.id = rf.id_condicion_fk 
            WHERE rf.fecha_baja IS NULL 
        `

        if(req.body.ubicacion != 't'){
            query += ' AND rf.id_deposito_fk = ?'
            params.push(req.body.ubicacion)
        }
        if(req.body.repuesto != 't'){
            query += ' AND rf.id_repuesto_fk = ?'
            params.push(req.body.repuesto)
        }
        if(req.body.neumatico != 't'){
            query += ' AND rf.neumatico = ?'
            params.push(req.body.neumatico)
        }

        if(req.body.condicion != 't'){
            query += ' AND rf.id_condicion_fk = ?'
            params.push(req.body.condicion)
        }

        if(req.body.marca != 't'){
            query += ' AND r.id_marca_fk = ?'
            params.push(req.body.marca)
        }

        // query += 'ORDER BY c.activo DESC, c.razon_social'
        let data = await model.execQuery(query, params)
        console.log(req.body)
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        const validacion = await ValidarCampos(req.body)
        if(!validacion.status) return res.json(validacion)

            console.log(req.body)

        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.getModificar = async (req, res) => {
    try {
        const data = await model.getById(req.body.id)
        if(!data.length) return res.json({ status: false, icon: "error", icon:'error', title: "Error", text: "Hubo un error, comuniquese con los programadores." })
        res.json({ status: true, data: data[0] })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postModificar = async (req, res) => {
    try {
        const validacion = await ValidarCampos(req.body)
        if(!validacion.status) return res.json(validacion)

        const resInsert = await model.update(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "fichasRepuestos", acc: "m", registro: req.body.id })
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postBorrar = async (req, res) => {
    try {
        const resDelete = await model.delete(req.body.id)
        if(!resDelete.affectedRows) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "fichasRepuestos", acc: "b", registro: req.body.id })
        return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postVer = async (req, res) => {
    try {
        const data = await model.getById(req.body.id)
        if(!data.length) return res.json({ status: false, icon: "error", icon:'error', title: "Error", text: "Hubo un error, comuniquese con los programadores." })
        res.json({ status: true, data: data[0] })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

const ValidarCampos = o => {
    return new Promise(async (resolve, reject) => {        
        if(String(o.repuesto).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el repuesto' })
        if(String(o.proveedor).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el proveedor' })
        if(String(o.deposito).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el origen' })
        if(String(o.nroSerie).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el número de serie' })
        // if(String(o.nroChas).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el númer de CHAS' })
        // if(String(o.modelo).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el modelo' })

        let repuesto = await mRepuestos.getById(o.repuesto)
        if(repuesto[0].es_neumatico == 1){
            if(String(o.medidasNeu).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar las medidas del neumático' })
            if(String(o.medidasNeu).trim().length >= 50) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Superó el límite de caracteres para las medidas del neumático. (Máx.: 50)' })
            if(String(o.tipoNeu).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el tipo de neumático' })
            if(String(o.condicion).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la condición del neumático' })
            if(String(o.fechaCompra).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la fecha de compra' })
            if(String(o.motivoBaja).trim().length > 0){
                if(String(o.fechaBaja).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la fecha de baja' })
            }
            if(String(o.motivoBaja).trim().length >= 100) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Superó el límite de caracteres para el motivo de baja. (Máx.: 100)' })
        }else{
            o.condicion = null
        }
        
        // if(String(o.importe).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el importe total' })
        if(String(o.observaciones).trim().length > 500) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Superó el límite de caracteres para las observaciones. (Máx.: 500)' })
        
        o.fechaCompra = String(o.fechaCompra).trim().length == 10 ? utils.changeDateYMD(o.fechaCompra) : null
        o.fechaFab = String(o.fechaFab).trim().length == 10 ? utils.changeDateYMD(o.fechaFab) : null
        o.fechaBaja = String(o.fechaBaja).trim().length == 10 ? utils.changeDateYMD(o.fechaBaja) : null
        o.esNeumatico = repuesto[0].es_neumatico
        if(o.importe.length == 0) o.importe = 0

        return resolve({ status: true })
    })
}



exports.postFichasRepuestosAjax = async (req, res) => {
    try {
        const data = await model.getFichasRepuestosByIdRepuestoDisp(req.body.id)
        if(!data.length) return res.json({ status: false, icon: "error", icon:'error', title: "Error", text: "No hay fichas disponibles para el repuesto seleccionado." })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

