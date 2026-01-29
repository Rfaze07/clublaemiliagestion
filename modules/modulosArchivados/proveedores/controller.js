const model = require('./model')
const mCondicionesIva = require('../condicionesiva/model')
const mProvincias = require('../provincias/model')
const utils = require('../../public/js/utils')


exports.getLista = async (req, res) => {
    try {
        const provincias = await mProvincias.getProvincias()
        const condicionesIva = await mCondicionesIva.getAllActivos()
	        
        res.render('proveedores/views/index', {
            pagename: "Proveedores",
            permisos: req.session.user.permisos,
            condicionesIva, provincias
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        let params=[], 
            query = `
            SELECT p.*, ci.descripcion AS descCondIvaTxt, l.descripcion AS localidadTxt, 
                    l.cp, pr.descripcion AS provinciaTxt
            FROM proveedores p
            LEFT JOIN condiciones_iva ci ON ci.id = p.id_condicioniva_fk
            LEFT JOIN localidades l ON l.id = p.id_localidad_fk
            LEFT JOIN provincias pr ON pr.id = l.id_provincia_fk `

        if(req.body.activo != 't'){
            query += 'WHERE p.activo = ?'
            params.push(req.body.activo)
        }

        query += 'ORDER BY p.activo DESC, p.razon_social'

        let data = await model.execQuery(query, params)
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getListaSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllActivos()
        if(!data.length) return res.json({ status: false, icon:"warning", title: "Alerta", text: "No existen proveedores cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        const validacion = await ValidarCampos(req.body)
        if(!validacion.status) return res.json(validacion)

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
        // if(String(o.nombreFantasia).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el nombre de fantasía' })
        if(String(o.cuit).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la CUIT' })
        if(String(o.condicionIva).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la condición de IVA' })
        if(String(o.provncia).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe selecciona la provincia' })
        if(String(o.localidad).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe selecciona la localidad' })
        if(String(o.direccion).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la dirección' })
        if(String(o.mail).trim().length > 0){
            if(!utils.validarMail(String(o.mail).trim())) resolve({ status: false, icon: "error", title: "Error", text: "El mail ingresado no es válido. Ej.: abc@ejemplo.com" })
        }
        // if(String(o.telefono).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el teléfono' })
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