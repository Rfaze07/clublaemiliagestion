const model = require('./model')
const mVehiculos = require('../vehiculos/model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")


exports.getLista = async (req, res) => {
    try {
        res.render('combustiblesVales/views/index', {
            pagename: "Cargas de gasoil",
            permisos: req.session.user.permisos
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        req.body.desde = utils.changeDateYMD(req.body.desde)
        req.body.hasta = utils.changeDateYMD(req.body.hasta)
        const data = await model.getAllbyRangoFechas(req.body.desde, req.body.hasta)
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        const validacion = await ValidarCampos(req.body)
        if(!validacion.status) return res.json(validacion)

        const vale = await model.getUltimoNroVale()
        req.body.nroVale = vale[0].utlNroVale

        const vehiculo = await mVehiculos.getChoferByIdCamion(req.body.camion)
        req.body.chofer = vehiculo[0].id
        
        req.body.user = req.session.user.id

        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "ValesCombustible", acc: "a", registro: resInsert.insertId })
        res.json({ status: true, type: "success", icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postEliminar = async (req, res) => {
    try {
        const vales = await model.getPuedoEliminar(req.body.vehiculo)
        if(vales.length == 1){
            if(vales[0].id == req.body.id){
                let result = await model.delete(req.body.id)
                if(result.affectedRows == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
                await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "CombustiblesVales", acc: "b", registro: req.body.id })
                return res.json({ status: true, icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })
            }else{
                return res.json({ status: false, icon: "error", title: "Error", text: "No se puede eliminar, debe eliminar el último registro para eliminar este" })                
            }
        } else {
            return res.json({ status: false, icon: "error", title: "Error", text: "No se puede eliminar, hubo un error" })
        }
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

const ValidarCampos = o => {
    return new Promise((resolve, reject) => {
        if(String(o.fecha).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la fecha' })
        if(String(o.hora).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la hora' })
        if(String(o.tanque).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el tanque' })
        if(String(o.camion).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el vehículo' })
        if(String(o.ltsHistorico).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar los listros históricos' })
        if(String(o.litros).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar los litros' })
        if(String(o.odometro).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el odómetro' })
        if(String(o.kms).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar los kilómetros' })

        o.fecha = utils.changeDateYMD(o.fecha)
        o.fechaHora = new Date(`${o.fecha} ${o.hora}`)

        return resolve({ status: true })
    })
}