const model = require('./model')
const eventos = require("../eventos/controller")
const utils = require('../../utils')


exports.getLista = async (req, res) => {
    try {
        res.render('repuestos/views/index', {
            pagename: "Repuestos",
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
                       SELECT re.*, m.descripcion AS marcaTxt, ru.descripcion AS rubroTxt, d.descripcion AS depositoTxt
                    FROM repuestos re 
                    LEFT JOIN marcas m ON m.id = re.id_marca_fk 
                    LEFT JOIN rubros ru ON ru.id = re.id_rubro_fk 
                    LEFT JOIN depositos d ON d.id = re.id_deposito_fk 
                    WHERE 1=1
        `
        
        if(req.body.activo != 't'){
            query += ' AND re.activo = ?'
            params.push(req.body.activo)
        }
        
        if(req.body.rubro != 't'){
            query += ' AND re.id_rubro_fk = ?'
            params.push(req.body.rubro)
        }
        
        query += 'ORDER BY re.descripcion'
        
        let data = await model.execQuery(query, params)

        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen repuestos cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getListaSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllbyActivo(1)
        if(!data.length) return res.json({ status: false, icon:"warning", title: "Alerta", text: "No existen repuestos cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getVerificoCodigoAjax = async (req, res) => {
    try {
        const repuesto = await model.getRepuestoByCodigo(req.body.codigo)
        if(repuesto[0].existe == 1) return res.json({ status: false, icon:"error", title: "Error", text: "El código del repuesto ya existe!" })
        res.json({ status: true })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        const validaciones = await ValidarCampos(req.body, true)
        if(!validaciones.status) return res.json(validaciones)
        
        const resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Repuestos", acc: "a", registro: resInsert.insertId })
        return res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getById = async (req, res) => {    
    const data = await model.getById(req.body.id)
    if(!data.length) return res.json({ status: false, icon:'error', title: "Error", text: "Hubo un error, comuniquese con los programadores" })
    res.json({ status: true, data: data[0] })
}

exports.postModificar = async (req, res) => {
    try {
        const validaciones = await ValidarCampos(req.body, false)
        if(!validaciones.status) return res.json(validaciones)
        
        const result = await model.update(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Repuestos", acc: "m", registro: req.body.id })
        return res.json({ status: true, icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postEliminar = async (req, res) => {
    try {
        const repuesto = await model.puedoEliminarByRepuesto(req.body.id)
        if(repuesto[0].puedoEliminar == 0) return res.json({ status: false, icon: "error", title: "Error", text: "El repuesto seleccionado no se puede eliminar ya que se utiliza en fichas de repuestos" })

        let result = await model.delete(req.body.id)
        if(result.affectedRows == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Repuestos", acc: "b", registro: req.body.id })
        return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

const ValidarCampos = (o, esAlta) => {
    return new Promise(async (resolve, reject) => {
        if(String(o.codigo).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el código' })
        
        if(esAlta){
            const repuesto = await model.getRepuestoByCodigo(o.codigo)
            if(repuesto[0].existe == 1) return resolve({ status: false, icon:"error", title: "Error", text: "El código del repuesto ya existe!" })
        }
        
        if(String(o.codigoOri).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el código original' })
        if(String(o.descripcion).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la descripción' })
        if(String(o.rubro).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el rubro' })
        if(String(o.marca).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la marca' })
        if(String(o.deposito).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el depósito' })
        if(String(o.minimo).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar stock mínimo' })
        if(String(o.pedido).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el punto de pedido' })
        if(String(o.maximo).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el stock máximo' })
        if(String(o.esFicha).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar si es ficha' })
        if(String(o.esNeuma).trim().length == 0) return resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar si es neumático' })

        o.codigoOri = o.codigoOri.toUpperCase()
        o.esFicha = utils.convertChbBoolean(o.esFicha)
        o.esNeuma = utils.convertChbBoolean(o.esNeuma)
        o.activo = utils.convertChbBoolean(o.activo)
        if(o.esNeuma == 1) o.esFicha = 1

        return resolve({ status: true })
    })
}