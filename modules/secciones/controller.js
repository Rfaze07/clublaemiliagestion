const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")

exports.getLista = async (req, res) => {
    try {
        res.render('secciones/views/index', {
            pagename: "Secciones",
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
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'El nombre es obligatorio' })
        }
        if (!req.body.descripcion || req.body.descripcion.trim() === '') {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'La descripción es obligatoria' })
        }
        if (!req.body.orden || req.body.orden.trim() === '') {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'El orden es obligatorio' })
        }
        if (parseInt(req.body.orden).toString() === 'NaN') {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'El orden debe ser un número' })
        }
        if (req.body.orden <= 0) {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'El orden debe ser un número positivo' })
        }

        let result = await model.insert(req.body)
        if (result.status === 0) {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: result.text })
        }
        return res.json({ status: true,  icon: 'success', title: 'Éxito', type: 'success', text: 'Sección dada de alta correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', type: 'error', text: 'Error del servidor' })
    }
}

exports.modificar = async (req, res) => {
    try {
        if (!req.body.titulo || req.body.titulo.trim() === '') {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'El nombre es obligatorio' })
        }
        if (!req.body.descripcion || req.body.descripcion.trim() === '') {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'La descripción es obligatoria' })
        }
        if (!req.body.orden || req.body.orden.trim() === '') {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'El orden es obligatorio' })
        }
        if (parseInt(req.body.orden).toString() === 'NaN') {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'El orden debe ser un número' })
        }
        if (req.body.orden <= 0) {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'El orden debe ser un número positivo' })
        }


        let result = await model.update(req.body)
        if (result.status === 0) {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: result.text })
        }
        return res.json({ status: true,  icon: 'success', title: 'Éxito', type: 'success', text: 'Sección modificada correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'Error del servidor' })
    }
}

exports.eliminar = async (req, res) => {
    try {
        let id = req.body.id
        let seccion = await model.getById(id)
        if (seccion.status === 0) {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'Sección no encontrada' })
        }
        let result = await model.delete(id)
        if (result.status === 0) {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: result.text })
        }
        return res.json({ status: true,  icon: 'success', title:'Éxito', type: 'success', text: 'Sección eliminada correctamente' })
    } 
    catch (error) {
        console.log(error)
        return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'Error del servidor' })
    }
}



//==================SubSecciones==================


exports.getSubSeccionesBySeccionIdAjax = async (req, res) => {
    try {
        let id_seccion_fk = req.body.id_seccion_fk
        let data = await model.getSubSeccionesBySeccionId(id_seccion_fk)
        return res.json({ status: true, data })
    }
    catch (error) {
        console.log(error)
        return res.json({ status: false, type: 'error', text: 'Error del servidor' })
    }
}

exports.altaSubSeccion = async (req, res) => {
    try {
        if (!req.body.titulo || req.body.titulo.trim() === '') { status: false; return res.json({  icon: 'error', title: 'Error', type: 'error', text: 'El título es obligatorio' }) }
        if (!req.body.descripcion || req.body.descripcion.trim() === '') { status: false; return res.json({  icon: 'error', title: 'Error', type: 'error', text: 'La descripción es obligatoria' }) }
        if (!req.body.orden || req.body.orden.trim() === '') { status: false; return res.json({  icon: 'error', title: 'Error', type: 'error', text: 'El orden es obligatorio' }) }
        if (parseInt(req.body.orden).toString() === 'NaN') { status: false; return res.json({  icon: 'error', title: 'Error', type: 'error', text: 'El orden debe ser un número' }) }
        if (req.body.orden <= 0) { status: false; return res.json({  icon: 'error', title: 'Error', type: 'error', text: 'El orden debe ser un número positivo' }) }

        let result = await model.insertSubSeccion(req.body)
        if (result.status === 0) {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: result.text })
        }
        return res.json({ status: true,  icon: 'success', title: 'Éxito', type: 'success', text: 'SubSección dada de alta correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'Error del servidor' })
    }
}

exports.modificarSubSeccion = async (req, res) => {
    try {
        if (!req.body.titulo || req.body.titulo.trim() === '') { status: false; return res.json({  icon: 'error', title: 'Error', type: 'error', text: 'El título es obligatorio' }) }
        if (!req.body.descripcion || req.body.descripcion.trim() === '') { status: false; return res.json({  icon: 'error', title: 'Error', type: 'error', text: 'La descripción es obligatoria' }) }
        if (!req.body.orden || req.body.orden.trim() === '') { status: false; return res.json({  icon: 'error', title: 'Error', type: 'error', text: 'El orden es obligatorio' }) }
        if (parseInt(req.body.orden).toString() === 'NaN') { status: false; return res.json({  icon: 'error', title: 'Error', type: 'error', text: 'El orden debe ser un número' }) }
        if (req.body.orden <= 0) { status: false; return res.json({  icon: 'error', title: 'Error', type: 'error', text: 'El orden debe ser un número positivo' }) }

        let result = await model.updateSubSeccion(req.body)
        if (result.status === 0) {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: result.text })
        }
        return res.json({ status: true,  icon: 'success', title: 'Éxito', type: 'success', text: 'SubSección modificada correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'Error del servidor' })
    }
}

exports.eliminarSubSeccion = async (req, res) => {
    try {
        let id = req.body.id
        let subSeccion = await model.getSubSeccionById(id)
        if (subSeccion.status === 0) {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'SubSección no encontrada' })
        }
        let result = await model.deleteSubSeccion(id)
        if (result.status === 0) {
            return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: result.text })
        }
        return res.json({ status: true,  icon: 'success', title:'Éxito', type: 'success', text: 'SubSección eliminada correctamente' })
    }
    catch (error) {
        console.log(error)
        return res.json({ status: false,  icon: 'error', title: 'Error', type: 'error', text: 'Error del servidor' })
    }
}


