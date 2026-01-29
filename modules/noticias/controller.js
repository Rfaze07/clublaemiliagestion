const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")

exports.getLista = async (req, res) => {
    try {
        res.render('noticias/views/index', {
            pagename: "Noticias",
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
        
        if (!req.body.titulo || req.body.titulo.trim() === '') {
            return res.json({ status: false, type: 'error', text: 'El título es obligatorio' })
        }
        if (!req.body.subtitulo || req.body.subtitulo.trim() === '') {
            return res.json({ status: false, type: 'error', text: 'El subtítulo es obligatorio' })
        }
        if (!req.body.descripcion || req.body.descripcion.trim() === '') {
            return res.json({ status: false, type: 'error', text: 'La descripción es obligatoria' })
        }
        let result = await model.insert(req.body)
        if (result.status === 0) {
            return res.json({ status: false, type: 'error', text: result.text })
        }
        return res.json({ status: true, type: 'success', text: 'Noticia dada de alta correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: 'error', text: 'Error del servidor' })
    }
}

exports.modificar = async (req, res) => {
    try {
        if (!req.body.titulo || req.body.titulo.trim() === '') {
            return res.json({ status: false, type: 'error', text: 'El título es obligatorio' })
        }
        if (!req.body.subtitulo || req.body.subtitulo.trim() === '') {
            return res.json({ status: false, type: 'error', text: 'El subtítulo es obligatorio' })
        }
        if (!req.body.descripcion || req.body.descripcion.trim() === '') {
            return res.json({ status: false, type: 'error', text: 'La descripción es obligatoria' })
        }
        let result = await model.update(req.body)
        if (result.status === 0) {
            return res.json({ status: false, type: 'error', text: result.text })
        }
        return res.json({ status: true, type: 'success', text: 'Noticia modificada correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: 'error', text: 'Error del servidor' })
    }
}

exports.eliminar = async (req, res) => {
    try {
        let id = req.body.id
        let noticia = await model.getById(id)
        if (noticia.status === 0) {
            return res.json({ status: false, type: 'error', text: 'Noticia no encontrada' })
        }
        let result = await model.delete(id)
        if (result.status === 0) {
            return res.json({ status: false, type: 'error', text: result.text })
        }
        return res.json({ status: true, type: 'success', text: 'Noticia eliminada correctamente' })
    }
    catch (error) {
        console.log(error)
        return res.json({ status: false, type: 'error', text: 'Error del servidor' })
    }
}