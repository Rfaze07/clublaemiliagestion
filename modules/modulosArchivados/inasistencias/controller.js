const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")


exports.getLista = async (req, res) => {
    try {
        res.render('inasistencias/views/index', {
            pagename: "Inasistencias",
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
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getCargarParaAjax = async (req, res) => {
    try {
        let data = await model.getAllEmpleadosActivos(req.body.para)
        if(data.length == 0) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        const validar = await ValidarCampos(req.body)
        if(!validar.status) return res.json(validar)

        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Inasistencias", acc: "a", registro: req.body.id })
        res.json({ status: true, type: "success", icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getById = async (req, res) => {    
    const inasistencia = await model.getById(req.body.id)
    const certificados = await model.getCertificadosByIdInasistencia(req.body.id)
    if(!inasistencia.length) return res.json({ status: false, icon:'error', title: "Error", text: "No existen registros cargados" })
    res.json({ status: true, inasistencia: inasistencia[0], certificados })
}

exports.postModificar = async (req, res) => {
    try {
        const validar = await ValidarCampos(req.body)
        if(!validar.status) return res.json(validar)

        let result = await model.update(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Inasistencias", acc: "m", registro: req.body.id })
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
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

exports.getPuestoAjax = async (req, res) => {
    try {
        let data = await model.getAllEmpleadosByPuestos(req.body.puesto)
        if(data.length == 0) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

const ValidarCampos = o => {
    return new Promise((resolve, reject) => {
        if(String(o.fecha).trim().length == 0) resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar la fecha' })
        if(o.fecha.length < 10) resolve({ status: false, icon:'error', title: 'Error', text: 'La fecha ingresada no es válida' })
        if(String(o.puesto).trim().length == 0) resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar el puesto' })
        if(String(o.empleado).trim().length == 0) resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar el empleado' })
        if(String(o.tipoInasistencia).trim().length == 0) resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar el tipo de inasistencia' })
        if(String(o.enfermedad).trim().length == 0) resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar la enfermedad' })
        if(String(o.dias).trim().length == 0) resolve({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la cantidad de dias de inasistencia' })
        
        o.fecha = utils.changeDateYMD(o.fecha)
        o.activo = utils.changeToBoolean(o.activo)
    
        resolve({ status: true })
    })
}







exports.postAltaCertificado = async (req, res) => {
    try {
        const validar = await ValidarCamposCert(req.body)
        if(!validar.status) return res.json(validar)

        let resInsert = await model.insertCertificado(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "InasistenciasCertificados", acc: "a", registro: req.body.id })
        res.json({ status: true, type: "success", icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postModificarCertificado = async (req, res) => {
    try {
        const validar = await ValidarCamposCert(req.body)
        if(!validar.status) return res.json(validar)

        req.body.fecha = utils.changeDateYMD(req.body.fecha)
        req.body.fechaCert = utils.changeDateYMD(req.body.fechaCert)
        req.body.activo = utils.changeToBoolean(req.body.activo)

        let result = await model.updateCertificado(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "InasistenciasCertificados", acc: "m", registro: req.body.id })
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postEliminarCertificado = async (req, res) => {
    try {
        // const validar = await ValidarCamposCert(req.body)
        // if(!validar.status) return res.json(validar)

        // req.body.fecha = utils.changeDateYMD(req.body.fecha)
        // req.body.fechaCert = utils.changeDateYMD(req.body.fechaCert)
        // req.body.activo = utils.changeToBoolean(req.body.activo)

        // let result = await model.updateCertificado(req.body)
        // if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        // await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "InasistenciasCertificados", acc: "m", registro: req.body.id })
        // return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })


        let resDeleteCert = await model.deleteCertificado(req.body.id)
        if(resDeleteCert.affectedRows == 0) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "InasistenciasCertificados", acc: "b", registro: req.body.id })
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

const ValidarCamposCert = o => {
    return new Promise((resolve, reject) => {
        o.fecha = utils.changeDateYMD(o.fecha)
        o.fechaCert = utils.changeDateYMD(o.fechaCert)
        if((o.fecha).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar una fecha' })
        if(o.fecha.length < 10) resolve({ status: false, icon:'error', title: 'Error', text: 'La fecha ingresada no es válida' })
        if((o.fechaCert).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la fecha del certificado' })
        const diff = parseInt((new Date(o.fechaCert) - new Date(o.fecha)) / 86_400_000)
        if(diff <= 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'La cantidad de dias no es válido' })
        if((o.medico).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el médico' })
        if((o.observaciones).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el diagnóstico' })
        if((o.observaciones).trim().length < 5) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el diagnóstico con al menos 5 caracteres' })
        resolve({ status: true })
    })
}