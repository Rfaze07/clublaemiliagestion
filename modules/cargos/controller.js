const model = require('./model')
const eventos = require("../eventos/controller")
const mUsuarios = require("../usuarios/model")
const utils = require('../../utils')


exports.getLista = async (req, res) => {
    try {
        res.render('cargos/views/index', {
            pagename: "Cargos",
            permisos: req.session.user.permisos
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        let  data  
        if (req.body.activo == 't') {
            data  =  await model.getAll()
        }else{
            data  =  await model.getAllbyActivo(req.body.activo)
        }
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getListaSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllbyActivo(1)
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
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
        const puedoModificar = await model.getById(req.body.id)
        if(puedoModificar[0].editable == 0) return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "El cargo seleccionado no se puede modificar" })

        if((req.body.descripcion).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripción.' })
        if((req.body.descripcion).trim().length >= 100) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La descripcion supero la cantidad permitida.' })
        if((req.body.desc_corta).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripcion corta.' })
        if((req.body.desc_corta).trim().length >= 5) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La descripcion corta supero la cantidad permitida.' })
        
        req.body.activo = utils.changeToBoolean(req.body.activo)

        let result = await model.update(req.body)

        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({usuario: req.session.user.id, tabla: "Cargos",acc: "m",registro: req.body.id}); 
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postEliminar = async (req, res) => {
    try {
        const puedoEliminar = await model.getById(req.body.id)
        if(puedoEliminar[0].editable == 0) return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "El cargo seleccionado no se puede eliminar" })

        let result = await model.delete(req.body.id)
        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({usuario: req.session.user.id, tabla: "Cargos",acc: "b",registro: req.body.id});            
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}



/**************************************************************
 * 
 *               PERMISOS/ACCESOS CARGOS
 * 
**************************************************************/

exports.getAccesos = async (req, res) => {
    const usuario = await mUsuarios.getUsuarioById(req.params.id)
    const cargo = await model.getById(req.params.id)
    let menues = await mUsuarios.getMenues()
    let accesosxusuario = await model.getAccesosByCargo(req.params.id)
    const lastmenuid = await mUsuarios.getLastMenuId()
    const lastAccesoIdDeUsuario = await model.getLastAccesoId(req.params.id)
    lastmenuid2 = lastmenuid[0].id
    lastAccesoIdDeUsuario2 = lastAccesoIdDeUsuario[0].menu
    let usuarios = mUsuarios.getUsuarios()

    if(lastmenuid2 != lastAccesoIdDeUsuario2){
        for (x = 0; x < menues.length; x++) {
            let secr2 = await model.verificarmenu(req.params.id, menues[x].id)
            if (secr2.length == 0) await model.insertMenu(req.params.id, menues[x].id)
        }
        menues = await mUsuarios.getMenues()
        accesosxusuario = await model.getAccesosByCargo(req.params.id)
    }

    res.render('cargos/views/accesos', {
        pagename: `Lista de accesos para: ${cargo[0].descripcion}`,
        idCargo: req.params.id,
        menues,
        usuario_accesos: accesosxusuario,
        usuario: usuario[0],
        usuarios
    })
}

exports.updateAcceso = async (req, res) => {
    const resultado = await model.updateAcceso(req.params)
    if (!resultado.affectedRows) return res.json({ status: false, type: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    res.json({ status: true, type: 'success', title: 'Exito', text: 'Solicitud procesada correctamente' })
}