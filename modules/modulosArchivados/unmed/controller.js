//EJEMPLO
const model = require('./model');
const utils = require('../../utils')
const eventos = require("../eventos/controller");


//#region GETS
exports.getLista = async (req, res) => {
    try {
        res.render('unmed/views/index', {
            pagename: "Unidades de medida",
            permisos: req.session.user.permisos
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        let  data ; 
        if (req.body.activo == 't') {
            data  =  await model.getAll()
        }else{
            data  =  await model.getAllbyActivo(req.body.activo)
        }
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getListaSelectAjax = async (req, res) => {
    try {
        let  data ; 
        
        data  =  await model.getAllbyActivo(1)
        
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        if((req.body.descripcion).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripción.' })
        if((req.body.descripcion).trim().length >= 100) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La descripcion supero la cantidad permitida.' })
        if((req.body.desc_corta).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripcion corta.' })
        if((req.body.desc_corta).trim().length >= 5) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La descripcion corta supero la cantidad permitida.' })
        
        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        res.json({ status: true, type: "success", icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getById = async (req, res) => {    
    const data = await model.getById(req.body.id)
    if(!data.length) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "No existen registros cargados" })
    res.json({ status: true, data: data[0] })
}


exports.postModificar = async (req, res) => {
    try {
        if((req.body.descripcion).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripción.' })
        if((req.body.descripcion).trim().length >= 100) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La descripcion supero la cantidad permitida.' })
        if((req.body.desc_corta).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripcion corta.' })
        if((req.body.desc_corta).trim().length >= 5) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La descripcion corta supero la cantidad permitida.' })
        req.body.activo = utils.changeToBoolean(req.body.activo)

        let result = await model.update(req.body)

        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({usuario: req.session.user.id, tabla: "unmed",acc: "m",registro: req.body.id}); 
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}


exports.postEliminar = async (req, res) => {
    try {
        let result = await model.delete(req.body.id)

        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({usuario: req.session.user.id, tabla: "unmed",acc: "b",registro: req.body.id});            
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

