const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")

exports.getLista = async (req, res) => {
    try {
        res.render('deportes/views/index', {
            pagename: "Deportes",
            permisos: req.session.user.permisos
        })
    }
    catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        let data = await model.getAll()
        if(!data.length) return res.json({ status: false, icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, con:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getByIdAjax = async (req, res) => {
    try {
        let id = req.body.id
        let data = await model.getById(id)
        return res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: 'error', text: 'Error del servidor' })
    }
}

exports.alta = async (req, res) => {
    try {
        
        if (!req.body.nombre || req.body.nombre.trim() === '') {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'El nombre es obligatorio' })
        }
        if (!req.body.descripcion || req.body.descripcion.trim() === '') {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'La descripción es obligatoria' })
        }
        if (!req.body.horarios || req.body.horarios.trim() === '') {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'Los horarios son obligatorios' })
        }
        if (!req.body.profesores || req.body.profesores.trim() === '') {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'Los profesores son obligatorios' })
        }

        let result = await model.insert(req.body)
        if (result.status === 0) {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: result.text })
        }
        return res.json({ status: true,  icon: 'success', title: 'Éxito', type: 'success', text: 'Deporte dado de alta correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', type: 'error', text: 'Error del servidor' })
    }
}

exports.modificar = async (req, res) => {
    try {
        if (!req.body.nombre || req.body.nombre.trim() === '') {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'El nombre es obligatorio' })
        }
        if (!req.body.descripcion || req.body.descripcion.trim() === '') {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'La descripción es obligatoria' })
        }
        if (!req.body.horarios || req.body.horarios.trim() === '') {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'Los horarios son obligatorios' })
        }
        if (!req.body.profesores || req.body.profesores.trim() === '') {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'Los profesores son obligatorios' })
        }
        let result = await model.update(req.body)
        if (result.status === 0) {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: result.text })
        }
        return res.json({ status: true,  icon: 'success', title: 'Éxito', type: 'success', text: 'Deporte modificado correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'Error del servidor' })
    }
}

exports.eliminar = async (req, res) => {
    try {
        let id = req.body.id
        let deporte = await model.getById(id)
        if (deporte.status === 0) {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'Deporte no encontrado' })
        }
        let result = await model.delete(id)
        if (result.status === 0) {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: result.text })
        }
        return res.json({ status: true,  icon: 'success', title:'Éxito', type: 'success', text: 'Deporte eliminado correctamente' })
    } 
    catch (error) {
        console.log(error)
        return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'Error del servidor' })
    }
}