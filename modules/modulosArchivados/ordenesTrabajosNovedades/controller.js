const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")


exports.getLista = async (req, res) => {
    try {
        res.render('ordenesTrabajosNovedades/views/index', {
            pagename: "OT - Novedades",
            permisos: req.session.user.permisos
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
               SELECT otn.*, i.descripcion AS imputacion, v.patente AS vehiculo
        FROM ordenes_trabajos_novedades otn
        LEFT JOIN imputaciones i ON i.id = otn.id_imputacion_fk
        LEFT JOIN vehiculos v ON v.id = otn.id_vehiculo_fk `
   
           if(req.body.estado != 't'){
               query += 'WHERE otn.estado = ? '
               params.push(req.body.estado)
           }

           
           if(req.body.vehiculo != '' && req.body.estado !='t'){
               query += 'AND otn.id_vehiculo_fk = ? '
               params.push(req.body.vehiculo)
           }else if (req.body.vehiculo != ''){
                query += 'WHERE otn.id_vehiculo_fk = ? '
               params.push(req.body.vehiculo)
           }

   
           query += 'ORDER BY otn.descripcion '
   
           let data = await model.execQuery(query, params)
           if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
           res.json({ status: true, data })
       } catch (error) {
           console.log(error)
           return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
       }
}


exports.getListaByVehiculo = async (req, res) => { 
    try {
           const data = await model.getListaByVehiculo(req.body.idVehiculo)
           if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros de novedades cargadas para el vehiculo seleccionado" })
           res.json({ status: true, data })
       } catch (error) {
           console.log(error)
           return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
       }
}

exports.getListaByVehiculoSinOT = async (req, res) => { 
    try {
           const data = await model.getListaByVehiculoSinOT(req.body.idVehiculo)
           if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros de novedades cargadas para el vehiculo seleccionado" })
           res.json({ status: true, data })
       } catch (error) {
           console.log(error)
           return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
       }
}


exports.getListaSelectAjax = async (req, res) => {
    try {
        const data = await model.getAll()
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen novedades de OT cargadas" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}


exports.postAlta = async (req, res) => {
    try {
        let resultValidaciones = await ValidarCampos(req.body)
        if(!resultValidaciones.status) return res.json(resultValidaciones)
        
        req.body.usuariocreador =  req.session.user.id

        
        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Novedades", acc: "a", registro: resInsert.insertId })
        res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postEliminar = async (req, res) => {
     try {

        //VERIFICAR QUE NO TENGA NIGUNA OT
        if (req.body.idOT != null) {
            return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "El registro que intenta eliminar esta asignado a una orden de trabajo. No se puede eliminar." })
        }else{
            let result = await model.delete(req.body.id)
            if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
            await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Tareas", acc: "b",registro: req.body.id })
            return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })
        }

        

    } catch (error) {
         console.log(error)
         return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
     }

}

const ValidarCampos = o => {
    return new Promise(async resolve => {
        if(String(o.descripcion).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar una descripción' })
        if(String(o.prioridad).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la prioridad de la tarea' })
        if(String(o.imputacion).trim().length == 0) return resolve({status: false, icon:'error', title:'Error', text: 'Debe seleccionar la imputacion'})
        if(String(o.vehiculo).trim().length == 0) return resolve({status: false, icon:'error', title:'Error', text: 'Debe seleccionar un vehiculo'})
        return resolve({ status: true })
    })
}

