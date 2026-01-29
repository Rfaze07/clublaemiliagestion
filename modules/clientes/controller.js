const model = require('./model')
const mCondicionesIva = require('../condicionesiva/model')
const mProvincias = require('../provincias/model')
const utils = require('../../public/js/utils')


exports.getLista = async (req, res) => {
    try {
        const condicionesIva = await mCondicionesIva.getAllActivos()
	        
        res.render('clientes/views/index', {
            pagename: "Clientes",
            permisos: req.session.user.permisos,
            condicionesIva
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaActivosAjaxSelect = async (req, res) => {
    try {
        const data = await model.getAllActivos()
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        let params=[], 
            query = `
            SELECT c.*, ci.descripcion AS descCondIvaTxt, l.descripcion AS descLocalidadTxt, p.descripcion AS descProvinciaTxt, tda.descripcion AS tipoDoc
            FROM clientes c
            LEFT JOIN condiciones_iva ci ON ci.id = c.id_condicioniva_fk
            LEFT JOIN localidades l on l.id = c.id_localidad_fk
            LEFT JOIN provincias p on p.id = l.id_provincia_fk
            LEFT JOIN tipos_documentos_afip tda ON tda.id = c.id_tipodoc_fk
        `


        if(req.body.activo != 't'){
            query += 'WHERE c.activo = ?'
            params.push(req.body.activo)
        }

        query += 'ORDER BY c.activo DESC, c.razon_social'

        let data = await model.execQuery(query, params)
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        if(String(req.body.razonSocial).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la razón social' })
        if(String(req.body.tipoDoc).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el tipo de documento' })
        if(String(req.body.nroDoc).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la CUIT' })
        if(String(req.body.condicionIva).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la condición de IVA' })
        if(String(req.body.direccion).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la dirección' })
        if(String(req.body.provincia).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la provincia' })
        if(String(req.body.localidad).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la localidad' })

        if(String(req.body.mail).trim().length == 0){
            return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el mail' })
        }else{
            if(!utils.validarMail(String(req.body.mail).trim())) 
                return res.json({ status: false, icon: "error", title: "Error", text: "El mail ingresado no es válido. Ej.: abc@ejemplo.com" })
        }

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

        req.body.activo = utils.convertChbBoolean(req.body.activo)

        let resInsert = await model.update(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postBorrar = async (req, res) => {
    res.json({ status: false, icon: 'error', title: 'Error', text: 'Accion momentaneamente no permitida' })
}

const ValidarCampos = o => {
    return new Promise((resolve, reject) => {
        if(String(o.razonSocial).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la razón social' })
        if(String(o.cuit).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la CUIT' })
        if(String(o.condicionIva).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la condición de IVA' })
        if(String(o.direccion).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la dirección' })
        if(String(o.mail).trim().length == 0){
            resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el mail' })
        }else{
            if(!utils.validarMail(String(o.mail).trim())) 
                resolve({ status: false, icon: "error", title: "Error", text: "El mail ingresado no es válido. Ej.: abc@ejemplo.com" })
        }
        if(String(o.telefono1).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el teléfono 1' })
        resolve({ status: true })
    })
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