const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")
const cloudinary = require('../cloudinary/controller')

const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'image' },
            (error, result) => {
                if (error) return reject(error)
                resolve(result)
            }
        )
        stream.end(buffer)
    })
}

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
            return res.json({ status: false, icon: 'error', title: 'Error', type: 'error', text: 'El título es obligatorio' })
        }
        if (!req.body.subtitulo || req.body.subtitulo.trim() === '') {
            return res.json({ status: false, icon: 'error', title: 'Error', type: 'error', text: 'El subtítulo es obligatorio' })
        }
        if (!req.body.descripcion || req.body.descripcion.trim() === '') {
            return res.json({ status: false, icon: 'error', title: 'Error', type: 'error', text: 'La descripción es obligatoria' })
        }

        let imagen_url = null, imagen_public_id = null
        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer, 'noticias')
            imagen_url = uploadResult.secure_url
            imagen_public_id = uploadResult.public_id
        }

        let result = await model.insert({ ...req.body, imagen_url, imagen_public_id })
        if (result.status === 0) {
            return res.json({ status: false, icon: 'error', title: 'Error', type: 'error', text: result.text })
        }
        return res.json({ status: true, icon: 'success', title: 'Éxito', type: 'success', text: 'Noticia dada de alta correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', type: 'error', text: 'Error del servidor' })
    }
}

exports.modificar = async (req, res) => {
    try {
        if (!req.body.titulo || req.body.titulo.trim() === '') {
            return res.json({ status: false, icon: 'error', title: 'Error', type: 'error', text: 'El título es obligatorio' })
        }
        if (!req.body.subtitulo || req.body.subtitulo.trim() === '') {
            return res.json({ status: false, icon: 'error', title: 'Error', type: 'error', text: 'El subtítulo es obligatorio' })
        }
        if (!req.body.descripcion || req.body.descripcion.trim() === '') {
            return res.json({ status: false, icon: 'error', title: 'Error', type: 'error', text: 'La descripción es obligatoria' })
        }

        let imagen_url = null, imagen_public_id = null
        if (req.file) {
            // Si tenia imagen anterior, eliminarla de Cloudinary
            const noticiaActual = await model.getById(req.body.id)
            if (noticiaActual.length && noticiaActual[0].imagen_public_id) {
                await cloudinary.uploader.destroy(noticiaActual[0].imagen_public_id).catch(() => {})
            }
            const uploadResult = await uploadToCloudinary(req.file.buffer, 'noticias')
            imagen_url = uploadResult.secure_url
            imagen_public_id = uploadResult.public_id
        }

        let result = await model.update({ ...req.body, imagen_url, imagen_public_id })
        if (result.status === 0) {
            return res.json({ status: false, icon: 'error', title: 'Error', type: 'error', text: result.text })
        }
        return res.json({ status: true, icon: 'success', title: 'Éxito', type: 'success', text: 'Noticia modificada correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', type: 'error', text: 'Error del servidor' })
    }
}

exports.eliminar = async (req, res) => {
    try {
        let id = req.body.id
        let noticia = await model.getById(id)
        if (noticia.status === 0) {
            return res.json({ status: false, icon: 'error', title: 'Error', type: 'error', text: 'Noticia no encontrada' })
        }
        // Eliminar imagen de Cloudinary si existe
        if (noticia.length && noticia[0].imagen_public_id) {
            await cloudinary.uploader.destroy(noticia[0].imagen_public_id).catch(() => {})
        }
        let result = await model.delete(id)
        if (result.status === 0) {
            return res.json({ status: false, icon: 'error', title: 'Error', type: 'error', text: result.text })
        }
        return res.json({ status: true, icon: 'success', title:'Éxito', type: 'success', text: 'Noticia eliminada correctamente' })
    } 
    catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', type: 'error', text: 'Error del servidor' })
    }
}