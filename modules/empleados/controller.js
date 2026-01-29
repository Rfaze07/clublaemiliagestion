const model = require('./model')
const mCargos = require('../cargos/model')
const mProvincias = require('../modulosArchivados/provincias/model')
const mPuestos = require('../modulosArchivados/puestos/model')
const utils = require('../../public/js/utils')


exports.getLista = async (req, res) => {
    try {
        const provincias = await mProvincias.getProvincias()
        const cargos = await mCargos.getAllbyActivo(1)
        const puestos = await mPuestos.getAllbyActivo(1)
        res.render('empleados/views/index', {
            pagename: "Empleados",
            permisos: req.session.user.permisos,
            provincias, cargos, puestos
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
            SELECT e.*, c.descripcion AS cargoTxt,
            p.descripcion AS puestoTxt
            FROM empleados e
            LEFT JOIN cargos c ON c.id = e.id_cargo_fk 
            LEFT JOIN puestos p ON p.id = e.id_puesto_fk `

        if(req.body.activo != 't'){
            query += 'WHERE e.activo = ?'
            params.push(req.body.activo)
        }

        query += 'ORDER BY e.activo DESC, e.apellido'

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
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getChoferesSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllChoferesActivos()
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros de choferes cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getEmpleadosSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllEmpleadosActivos()
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros de choferes cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getEmpleadosPuestoSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllByPuesto(req.body.idPuesto)
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros de choferes cargados para el puesto seleccionado" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getLastNroLegajoAjax = async (req, res) => {
    try {
        const ultimo = await model.getLastNroLegajo()
        res.json({ status: true, ultimo: ultimo[0].nroLegajo })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postAlta = async (req, res) => {
    try {
        req.body.dni = String(req.body.dni).replaceAll('.', '')
        req.body.fechaNac = utils.changeDateYMD(req.body.fechaNac)
        req.body.fechaIng = utils.changeDateYMD(req.body.fechaIng)

        const validacion = await ValidarCampos(req.body, true)
        if(!validacion.status) return res.json(validacion)

        if(req.body.obraSocial.length == 0) req.body.obraSocial = 0

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
        const validacion = await ValidarCampos(req.body, false)
        if(!validacion.status) return res.json(validacion)

        if(req.body.obraSocial.length == 0) req.body.obraSocial = 0
        req.body.dni = req.body.dni.replaceAll('.', '')
        req.body.activo = utils.convertChbBoolean(req.body.activo)
        req.body.fechaNac = utils.changeDateYMD(req.body.fechaNac)
        req.body.fechaIng = utils.changeDateYMD(req.body.fechaIng)

        const estadoActivo = await model.getById(req.body.id)
        if(estadoActivo.length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud. Comuniquese con los programadores (Código: 0x005548)' })
        if(estadoActivo[0].activo != req.body.activo){
            req.body.fechaIng = estadoActivo[0].fecha_alta
            if(req.body.activo == 0){
                req.body.fechaEgr = utils.generateTodayDateYMD()
            }else{
                req.body.fechaEgr = null
            }
        }else{
            if(req.body.fechaEgr.length > 0){
                req.body.activo = 0
                req.body.fechaIng = estadoActivo[0].fecha_alta
                req.body.fechaEgr = utils.changeDateYMD(req.body.fechaEgr)
            }else{
                req.body.activo = 1
                req.body.fechaIng = estadoActivo[0].fecha_alta
                req.body.fechaEgr = null
            }
        }

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

const ValidarCampos = (o, esAlta) => {
    return new Promise(async (resolve, reject) => {
        if(String(o.nroLegajo).trim().length == 0 && esAlta) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el número de legajo' })
        if(esAlta){
            let resNroLegajo = await model.getNroLegajoExiste(o.nroLegajo)
            if(resNroLegajo[0].existe != 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'El número de legajo ya existe!' })
        }
        if(String(o.nombre).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el nombre' })
        if(String(o.apellido).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el apellido' })
        if(String(o.dni).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el DNI' })
        if(esAlta){
            let resDNI = await model.getDNIExiste(o.dni)
            if(resDNI[0].existe != 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'El DNI ya existe!' })
        }
        if(esAlta == false){
            if(String(o.cuil).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el CUIL' })
            if(String(o.direccion).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la dirección' })
            // if(String(o.obraSocial).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la obra social' })
            // if(String(o.nroObraSocial).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el número ' })    
            // if(String(o.planObraSocial).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la dirección' })
            if(String(o.fechaNac).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la fecha de nacimiento' })
        }

        if(String(o.provincia).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la provincia' })
        if(String(o.localidad).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la localidad' })
        if(String(o.puesto).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el puesto' })
        if(String(o.fechaIng).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la fecha de ingreso' })
        // if(String(o.mail).trim().length == 0){
        //     resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el mail' })
        // }else{
        //     if(!utils.validarMail(String(o.mail).trim())) 
        //         resolve({ status: false, icon: "error", title: "Error", text: "El mail ingresado no es válido. Ej.: abc@ejemplo.com" })
        // }
        if(esAlta == false){
            if(String(o.mail).trim().length > 0){
                if(!utils.validarMail(String(o.mail).trim())) 
                    resolve({ status: false, icon: "error", title: "Error", text: "El mail ingresado no es válido. Ej.: abc@ejemplo.com" })
            }
        }
        if(String(o.cargo).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el cargo' })

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