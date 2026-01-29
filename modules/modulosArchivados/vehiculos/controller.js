const model = require('./model')
const mTiposVehiculos = require('../tiposVehiculos/model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")


exports.getLista = async (req, res) => {
    try {
        res.render('vehiculos/views/index', {
            pagename: "Vehículos",
            permisos: req.session.user.permisos
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        let params = [], 
            query = `
                SELECT v.*, tv.descripcion AS tipoVehiculoTxt, m.descripcion AS marcaTxt 
                FROM vehiculos v
                LEFT JOIN tipos_vehiculos tv ON tv.id = v.id_tipovehiculo_fk 
                LEFT JOIN marcas m ON m.id = v.id_marca_fk 
                WHERE 1=1 
            `
        
        if(req.body.activo != 't'){
            query += ` AND v.activo = ?`
            params.push(req.body.activo)
        }
        
        console.log(req.body.tipoVehiculo)
        if(req.body.tipoVehiculo != undefined){
                query +=  ` AND v.id_tipovehiculo_fk = ?`
                params.push(req.body.tipoVehiculo)
        }

        query += ` ORDER BY ISNULL(v.nro_interno), v.nro_interno DESC, v.anio DESC`
        const data = await model.execQuery(query, params)
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getNroInternoAjax = async (req, res) => {
    try {
        if(String(req.body.nroInterno).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el número interno' })
        const nroInterno = await model.getNroInternoExiste(req.body.nroInterno)
        if(nroInterno[0].existe == 1) return res.json({ status: false, icon: "error", title: "Error", text: "El número de interno ya existe!" })
        res.json({ status: true })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getListaSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllbyActivo(1)
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getListaCamionesSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllCamionesbyActivo()
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros de camiones cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getListaCamChofSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllCamionesChoferesActivos()
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros de camiones cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getListaSemisSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllSemisbyActivo()
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros de semis cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        const validacion = await ValidarCampos(req.body, true)
        if(!validacion.status) return res.json(validacion)
        
        let resInsert = await model.insert(req.body)
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
        const validacion = await ValidarCampos(req.body, false)
        if(!validacion.status) return res.json(validacion)

            console.log(req.body)

        let result = await model.update(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({usuario: req.session.user.id, tabla: "Cargos",acc: "m",registro: req.body.id}); 
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postEliminar = async (req, res) => {
    try {
        // agregar a orden de trabajo  
        // agregar a kilometros  
        // agregar a combustible
        let result = await model.delete(req.body.id)
        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({usuario: req.session.user.id, tabla: "Cargos",acc: "b",registro: req.body.id})
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })
        // return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Falta vinculacion" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

const ValidarCampos = (o, esAlta) => {
    return new Promise(async (resolve, reject) => {
        if(String(o.tipoVehiculo).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el tipo de vehículo' })
        const resTipoVehiculo = await mTiposVehiculos.getTipoSeleccionadoAjax(o.tipoVehiculo)
        if(!resTipoVehiculo.length) resolve({ status: false, icon: 'error', title: 'Error', text: 'No existe informacion, hubo un error' })
        if(resTipoVehiculo[0].asigna_chofer == 1){
            if(String(o.nroInterno).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el número interno' })
            if(esAlta == true){
                const nroInterno = await model.getNroInternoExiste(o.nroInterno)
                if(nroInterno[0].existe == 1) resolve({ status: false, icon: "error", title: "Error", text: "El número de interno ya existe!" })
            }
        }

        if(String(o.patente).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la patente' })
        if(String(o.marca).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la marca' })
        
        if(resTipoVehiculo[0].asigna_semi == 1 && resTipoVehiculo[0].asigna_chofer == 1){
            if(String(o.chofer).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el chofer' })
            if(String(o.semi).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el semi' })
        }else if(resTipoVehiculo[0].asigna_chofer == 1){
            if(String(o.chofer).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el chofer' })
        }

        if(String(o.modelo).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el modelo' })
        if(String(o.anio).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el año' })
        // if(String(o.nroChasis).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el número de chasis' })
        // if(String(o.ejes).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la cantidad de ejes' })
        // if(o.ejes.length >= 4) resolve({ status: false, icon: 'error', title: 'Error', text: 'La cantidad de caracteres de ejes supera la cantidad máxima permitida (Máx.: 3)' })
        // if(String(o.tara).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la capacidad de carga' })
        // if(String(o.largo).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el largo en metros' })

        o.patente = o.patente.toUpperCase()
        o.cargasPeligrosas = utils.convertChbBoolean(o.cargasPeligrosas)
        o.interno = utils.convertChbBoolean(o.interno)

        if(resTipoVehiculo[0].asigna_chofer == 0){
            o.nroInterno = null
            o.chofer = null
        }
        if(resTipoVehiculo[0].asigna_semi == 0){
            o.semi = null
        }

        resolve({ status: true })
    })
}


exports.getAllVehiculosByTipoSelectAjax = async (req, res) => {
    try {
        const data = await model.getCamionesByTipoVehiculo(req.body.id)
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}