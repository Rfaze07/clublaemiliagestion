const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")


exports.getLista = async (req, res) => {
    try {
        res.render('subCategorias/views/index', {
            pagename: "SubCategorias",
            permisos: req.session.user.permisos
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}
exports.getListaAjax = async (req, res) => {
    try {
        const { activo, categoria } = req.body

        const data = await model.getByFiltros(activo, categoria)

        if (!data.length) {
            return res.json({
                status: false,
                icon: "warning",
                title: "Alerta",
                text: "No existen registros con los filtros seleccionados"
            })
        }
 
        return res.json({ status: true, data })

    } catch (error) {
        console.log(error)
        return res.json({
            status: false,
            icon: "error",
            title: "Error",
            text: "Hubo un error al procesar la solicitud"
        })
    }
}

exports.getListaSelectAjax = async (req, res) => {
    try {
        const { id_categoria_fk } = req.body
        
        let data
        if(id_categoria_fk){
            data = await model.getByFiltros(1, id_categoria_fk)
        } else {
            data = await model.getAllbyActivo(1)
        }
        
        if(!data.length) return res.json({ status: false, icon:"warning", title: "Alerta", text: "No existen subcategorías cargadas" })
        return res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    console.log(req.body)
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

        //Validar que no tenga subcategoria asociadas , a futuro

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
        if(String(o.descripcion).trim().length == 0) return res.json({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la descripción' })
        if(String(o.descripcion).trim().length >= 40) return res.json({ status: false, icon:'error', title: 'Error', text: 'La descripcion supero la cantidad permitida' })
        if( String(o.desc_corta).trim().length == 0 ) return res.json({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la descripción corta' })
        if( String(o.desc_corta).trim().length > 4 ) return res.json({ status: false, icon:'error', title: 'Error', text: 'La descripción corta supero la cantidad permitida' })
        
        //desc_corta a mayusculas
        o.desc_corta = String(o.desc_corta).trim().toUpperCase()
        o.activo = utils.changeToBoolean(o.activo)
        

        return resolve({ status: true })
    })
}
