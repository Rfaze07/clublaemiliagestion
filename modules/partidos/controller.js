const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")


exports.getLista = async (req, res) => {
    try {
        res.render('partidos/views/index', {
            pagename: "Partidos",
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
                SELECT p.*, eA.nombre as equipoA, eB.nombre as equipoB
                FROM partidos p
                LEFT JOIN equipos eA ON p.id_equipoA_fk = eA.id
                LEFT JOIN equipos eB ON p.id_equipoB_fk = eB.id
                WHERE 1=1
        `
        if(req.body.equipo != 't'){
            query += ' AND (p.id_equipoA_fk = ? OR p.id_equipoB_fk = ?)'
            params.push(req.body.equipo, req.body.equipo)
        }

        if(req.body.estado != 't'){
            query += ' AND p.estado = ?'
            params.push(req.body.estado)
        }


        query += 'ORDER BY p.fecha_hora'
        let data = await model.execQuery(query, params)

        if(!data.length) return res.json({ status: false, icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, con:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getListaSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllbyActivo(1)
        if(!data.length) return res.json({ status: false, icon:"warning", title: "Alerta", text: "No existen rubros cargados" })
        return res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        const validaciones = await ValidarCampos(req.body)
        if(!validaciones.status) return res.json(validaciones)

        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Rubros", acc: "a", registro: resInsert.insertId })
        res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getById = async (req, res) => {    
    const data = await model.getById(req.body.id)
    if(!data.length) return res.json({ status: false, icon:'error', title: "Error", text: "No existen registros cargados" })
    res.json({ status: true, data: data[0] })
}

exports.postModificar = async (req, res) => {
    try {
        const validaciones = await ValidarCampos(req.body)
        if(!validaciones.status) return res.json(validaciones)

        let result = await model.update(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Rubros", acc: "m", registro: req.body.id })
        return res.json({ status: true, icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postEliminar = async (req, res) => {
    try {
        let result = await model.delete(req.body.id)
        if(result.affectedRows == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Rubros", acc: "b", registro: req.body.id })            
        return res.json({ status: true, icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

const ValidarCampos = o => {
    return new Promise((resolve, reject) => {
        if(!o.fecha_hora || o.fecha_hora.trim() === '') return resolve({ status: false, icon:"warning", title: "Alerta", text: "El campo Fecha y Hora es obligatorio" })
        if(!o.id_equipoA_fk || isNaN(o.id_equipoA_fk)) return resolve({ status: false, icon:"warning", title: "Alerta", text: "El campo Equipo A es obligatorio" })
        if(!o.id_equipoB_fk || isNaN(o.id_equipoB_fk)) return resolve({ status: false, icon:"warning", title: "Alerta", text: "El campo Equipo B es obligatorio" })
        if(o.id_equipoA_fk === o.id_equipoB_fk) return resolve({ status: false, icon:"warning", title: "Alerta", text: "Los equipos no pueden ser los mismos" })
        
        fecha = o.fecha_hora.split(' ')[0]
        hora = o.fecha_hora.split(' ')[1]
        fecha = utils.changeDateYMD(fecha)

        o.fecha_hora = fecha + ' ' + hora
        return resolve({ status: true })
    })
}

exports.postActualizarEstado = async (req, res) => {
    try {
        const { id, estado, puntosA, puntosB } = req.body;
        let result = await model.updateEstado(id, estado, puntosA, puntosB);
        if(result.affectedRows == 0) return res.json({ status: false, icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        return res.json({ status: true, icon: "success", title: "Éxito", text: "Estado actualizado correctamente" });
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getPlanillaDigital = async (req, res) => {
    try {
        res.render('partidos/views/planillaDigital', {
            pagename: "Planilla Digital",
            permisos: req.session.user.permisos
        })
    } catch (error) {
        console.log(error)
        res.redirect('/partidos')
    }
}

exports.postRegistrarEstadistica = async (req, res) => {
    try {
        const resInsert = await model.insertarEvento({
            id_partido_fk: req.body.id_partido_fk,
            id_jugador_fk: req.body.id_jugador_fk,
            evento: req.body.evento,
            valor: req.body.valor,
            periodo: req.body.periodo,
            tiempo_restante: req.body.tiempo_restante
        });
        if (!resInsert.affectedRows) {
            return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" });
        }
        return res.json({ status: true, icon: "success", title: "Éxito", text: "Estadística registrada correctamente" });
    }
    catch (error) {
        console.log(error);
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" });
    }
}

exports.postDeshacerUltimaAccion = async (req, res) => {
    try {
        const resDelete = await model.deshacerUltimoEvento(req.body.id_partido_fk);
        if (resDelete.affectedRows == 0) {
            return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" });
        }
        return res.json({ status: true, icon: "success", title: "Éxito", text: "Última acción deshecha correctamente" });
    } catch (error) {
        console.log(error);
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" });
    }
}


exports.postObtenerEstadisticas = async (req, res) => {
    try {
        const data = await model.getEventosByPartido(req.body.id);
        if (!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" });
        return res.json({ status: true, data });
    } catch (error) {
        console.log(error);
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" });
    }
}