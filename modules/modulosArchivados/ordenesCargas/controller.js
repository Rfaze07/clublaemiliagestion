const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")
const mProvincias = require('../provincias/model')
const mLocalidades = require('../localidades/model')
const mClientes = require('../clientes/model')
const mProductos = require('../productos/model')
// const mUnidadMedida = require('../unmed/model')
const mEmpleados = require('../empleados/model')
const mVehiculos = require('../vehiculos/model')



exports.getLista = async (req, res) => {
    try {
        res.render('ordenesCargas/views/index', {
            pagename: "Órdenes de cargas",
            permisos: req.session.user.permisos
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        // const data = req.body.activo == 't' ? await model.getAll() : await model.getAllbyActivo(req.body.activo)
        const data = await model.getAll()
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getListaSelectAjax = async (req, res) => {
    try {
        const data = await model.getDocumentacionActivoByIdTipoDoc(req.body.id)
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen datos cargados para el tipo de ducumentación seleccionado" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getById = async (req, res) => {    
    const data = await model.getById(req.body.id)
    if(!data.length) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "No existen registros cargados" })
    res.json({ status: true, data: data[0] })
}

exports.postObtenerEstadosDisponibles = async (req, res) => {
    try {
        if(req.body.id.length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error" })
        let data = await model.getEstadosDisponiblesByIdOrdenCarga(req.body.id)
        res.json({ status: true, data })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postModificarChofer = async (req, res) => {
    try {
        if(req.body.id.length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error" })
        if(req.body.idChofer.length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Debe seleccionar un chofer" })
        if(req.body.idCamion.length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Debe seleccionar un camión" })
        if(req.body.idSemi.length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Debe seleccionar un semi" })

        const chofer = await mEmpleados.getById(req.body.idChofer)
        if(chofer.length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al encontrar el chofer, comuniquese con los programadores" })
        req.body.chofer = `${chofer[0].apellido}, ${chofer[0].nombre}`

        const camion = await mVehiculos.getById(req.body.idCamion)
        if(camion.length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al encontrar el camión, comuniquese con los programadores" })
        req.body.camion = `${camion[0].patente}`

        const semi = await mVehiculos.getById(req.body.idSemi)
        if(semi.length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al encontrar el semi, comuniquese con los programadores" })
        req.body.semi = `${semi[0].patente}`

        let resUpdateChofer = await model.updateChofer(req.body)
        if(!resUpdateChofer.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud (1)" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Ordenes Cargas - Modifica chofer", acc: "m", registro: req.body.id })
        res.json({ status: true, icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postModificarEstado = async (req, res) => {
    try {
        if(req.body.id.length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error" })

        let resInsertEstado = await model.insertEstadoOC(req.body.id, req.body.estado, req.session.user.id)
        if(!resInsertEstado.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud (1)" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Ordenes Cargas - Modifica estado", acc: "m", registro: req.body.id })

        res.json({ status: true, icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postEliminar = async (req, res) => {
    return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "falta" })
    // try {
    //     let result = await model.delete(req.body.id)
    //     if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    //     await eventos.insertarEvento({usuario: req.session.user.id, tabla: "Cargos",acc: "b",registro: req.body.id});            
    //     return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    // } catch (error) {
    //     console.log(error)
    //     return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    // }
}





//=====================================================
//          PASO 1: ORDEN DE CARGA
//=====================================================

exports.postAlta1 = async (req, res) => {
    try {
        const validar = await ValidarCampos1(req.body, false)
        if(!validar.status) return res.json(validar)

        req.body.unica = req.session.user.id
        console.log(req.body)

        let resInsert = await model.insert1(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        let resInsertEstado = await model.insertEstadoOC(resInsert.insertId, 1, req.body.unica)
        if(!resInsertEstado.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })

        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Ordenes Cargas", acc: "a", registro: req.body.id })
        res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente", idOrdenCarga: resInsert.insertId })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postModificar1 = async (req, res) => {
    try {
        const validar = await ValidarCampos1(req.body, true)
        if(!validar.status) return res.json(validar)

        let resInsert = await model.update1(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Ordenes Cargas", acc: "m", registro: req.body.id })
        res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

const ValidarCampos1 = (o, modifico) => {
    return new Promise(async (resolve, reject) => {
        if(String(o.fechaCarga).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar una fecha' })
        if(String(o.cliente).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar un cliente' })
        // if(String(o.nroCliente).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el número de cliente' })
        if(String(o.provinciaO).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la provincia de origen' })
        if(String(o.localidadO).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la localidad de origen' })
        if(String(o.provinciaD).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la provincia de destino' })
        if(String(o.localidadD).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la localidad de destino' })

        o.fechaCarga = utils.changeDateYMD(o.fechaCarga)
        if(modifico) o.activo = utils.changeToBoolean(o.activo)
        
        const cliente = await mClientes.getById(o.cliente)
        o.clienteTxt = cliente.length == 1 ? cliente[0].razon_social : ''

        const provO = await mProvincias.getProvinciaById(o.provinciaO)
        o.provinciaOTxt = provO.length == 1 ? provO[0].descripcion : ''
        
        const provD = await mProvincias.getProvinciaById(o.provinciaD)
        o.provinciaDTxt = provD.length == 1 ? provD[0].descripcion : ''
        
        const locO = await mLocalidades.getLocalidadById(o.localidadO)
        o.localidadesOTxt = locO.length == 1 ? locO[0].descripcion : ''
        o.cpO = locO.length == 1 ? locO[0].cp : ''
        
        const locD = await mLocalidades.getLocalidadById(o.localidadD)
        o.localidadesDTxt = locD.length == 1 ? locD[0].descripcion : ''
        o.cpD = locD.length == 1 ? locD[0].cp : ''

        return resolve({ status: true })
    })
}



//=====================================================
//          PASO 2: PRODUCTO
//=====================================================

exports.getListaProductosAjax = async (req, res) => {
    try {
        const data = await model.getListaProductosAjax(req.body.idOrdenCarga)
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta2 = async (req, res) => {
    try {
        const validar = await ValidarCampos2(req.body)
        if(!validar.status) return res.json(validar)

        const existe = await model.getProductoExisteByIdOrdenCarga(req.body.producto, req.body.idOrdenCarga)
        if(existe.length == 1){
            req.body.id = req.body.idOrdenCarga
            let resUpdate = await model.update2(req.body)
            if(!resUpdate.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
            await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Ordenes Cargas - Producto", acc: "m", registro: req.body.id })
            res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente", idOrdenCarga: req.body.idOrdenCarga })
        }else{
            let resInsert = await model.insert2(req.body)
            if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
            await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Ordenes Cargas - Producto", acc: "a", registro: req.body.id })
            res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente", idOrdenCarga: req.body.idOrdenCarga })
        }
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getModificar2 = async (req, res) => {
    try {
        let data = await model.getProductoById(req.body.id)
        if(data.length != 1) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud, comuniquese con los programadores" })
        res.json({ status: true, data: data[0] })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postModificar2 = async (req, res) => {
    try {
        const validar = await ValidarCampos2(req.body, true)
        if(!validar.status) return res.json(validar)

        let resInsert = await model.update(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Ordenes Cargas", acc: "m", registro: req.body.id })
        res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

const ValidarCampos2 = o => {
    return new Promise(async (resolve, reject) => {
        if(String(o.idOrdenCarga).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error, comuniquese con los programadores' })
        if(String(o.cantidad).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la cantidad' })
        if(String(o.producto).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el producto' })
        if(String(o.uniMed).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la unidad de medida' })

        let prod = await mProductos.getById(o.producto)
        o.descProducto = prod[0].desc_corta.toUpperCase()
        o.productoTxt = prod[0].descripcion
        
        return resolve({ status: true })
    })
}



//=====================================================
//          PASO 3: REPARTOS
//=====================================================

exports.getListaRepartosAjax = async (req, res) => {
    try {
        const data = await model.getListaRepartosAjax(req.body.idOrdenCarga)
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postUltimoOrden3 = async (req, res) => {
    try {
        const data = await model.getUltOrdenReparto(req.body.id)
        res.json({ status: true, data: data[0].ultimo })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta3 = async (req, res) => {
    try {
        const validar = await ValidarCampos3(req.body)
        if(!validar.status) return res.json(validar)

        const existe = await model.getRepartoExisteByIdOrdenCarga(req.body.id)
        if(existe.length == 1){
            req.body.id = req.body.idOrdenCarga
            let resUpdate = await model.update3(req.body)
            if(!resUpdate.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
            await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Ordenes Cargas - Repartos", acc: "m", registro: req.body.id })
            res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente", idOrdenCarga: req.body.idOrdenCarga })
        }else{
            let resInsert = await model.insert3(req.body)
            if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
            await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Ordenes Cargas - Repartos", acc: "a", registro: req.body.id })
            res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente", idOrdenCarga: req.body.idOrdenCarga })
        }
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getModificar3 = async (req, res) => {
    try {
        let data = await model.getRepartoById(req.body.id)
        if(data.length != 1) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud, comuniquese con los programadores" })
        res.json({ status: true, data: data[0] })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postModificar3 = async (req, res) => {
    try {
        const validar = await ValidarCampos3(req.body, true)
        if(!validar.status) return res.json(validar)

        let resInsert = await model.update3(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Ordenes Cargas - Repartos", acc: "m", registro: req.body.id })
        res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postEliminar3 = async (req, res) => {
    try {
        const resDelete = await model.delete3(req.body.id)
        if(!resDelete.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Ordenes Cargas - Repartos", acc: "b", registro: req.body.id })
        res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

const ValidarCampos3 = o => {
    return new Promise(async (resolve, reject) => {
        if(String(o.idOrdenCarga).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error, comuniquese con los programadores' })
        if(String(o.provincia).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la provincia' })
        if(String(o.localidad).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la localidad' })        
        return resolve({ status: true })
    })
}