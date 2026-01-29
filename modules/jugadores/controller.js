const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")


exports.getLista = async (req, res) => {
    try {
        res.render('jugadores/views/index', {
            pagename: "Jugadores",
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
                SELECT j.*, e.nombre as equipo
                FROM jugadores j
                LEFT JOIN equipos e ON j.id_equipo_fk = e.id
                WHERE 1=1
        `
        if(req.body.equipo != 't'){
            query += ' AND j.id_equipo_fk = ?'
            params.push(req.body.equipo)
        }

        if(req.body.activo != 't'){
            query += ' AND j.activo = ?'
            params.push(req.body.activo)
        }


        query += 'ORDER BY j.nombre'

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

exports.getByEquipo = async (req, res) => {
    try {
        const { equipo_id } = req.body
        const data = await model.execQuery(
            'SELECT * FROM jugadores WHERE id_equipo_fk = ? AND activo = 1 ORDER BY dorsal, nombre',
            [equipo_id]
        )
        if(!data.length) return res.json({ status: false, icon:"warning", title: "Alerta", text: "No existen jugadores cargados para este equipo" })
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
        if(String(o.nombre).trim().length == 0) return res.json({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar el nombre' })
        if(String(o.nombre).trim().length >= 40) return res.json({ status: false, icon:'error', title: 'Error', text: 'El nombre supero la cantidad permitida' })
        if(isNaN(o.id_equipo_fk)) return res.json({ status: false, icon:'error', title: 'Error', text: 'El equipo seleccionado es inválido' })
        if(isNaN(o.dorsal) || o.dorsal < 0) return res.json({ status: false, icon:'error', title: 'Error', text: 'El dorsal ingresado es inválido' })

        o.activo = utils.changeToBoolean(o.activo)
        

        return resolve({ status: true })
    })
}