const model = require('./model')
const mCondicionesIva = require('../condicionesiva/model')
const utils = require('../../public/js/utils')


exports.getLista = async (req, res) => {
    try {
        const condicionesIva = await mCondicionesIva.getAllActivos()
            
        res.render('compras/views/index', {
            pagename: "Compras",
            permisos: req.session.user.permisos,
            condicionesIva
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaActivosAjaxSelect = async (req, res) => {
    try {
        const data = await model.getAllActivos()
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        let params=[], 
            query = `
            SELECT p.*
            FROM proveedores p` 

        if(req.body.activo != 't'){
            query += 'WHERE p.activo = ?'
            params.push(req.body.activo)
        }

        query += 'ORDER BY p.activo DESC, p.razon_social'

        let data = await model.execQuery(query, params)
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        if(String(req.body.cliente).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el cliente' })
        if(String(req.body.medioPago).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el medio de pago' })
        if(!Array.isArray(req.body.productos) || req.body.productos.length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe agregar al menos un producto' })

        req.body.id_usuario_fk = req.session.user.id
        req.body.empresa = 1 //Por ahora fijo (usuario es DEV,FALTA ASOCIAR USUARIO A EMPRESA))
        req.body.fecha = utils.changeDateYMD(utils.generateTodayDate())

        let resInsert = await model.insertComprobante(req.body)
        if(!resInsert.insertId) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })

        let resInsertItems = await model.insertComprobanteItems(resInsert.insertId, req.body.productos)
        if(!resInsertItems.affectedRows) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })

        let resUpdateCostos = await model.updateCostosProductos(req.body.productos)

        if(!resUpdateCostos.affectedRows) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente', insertId: resInsert.insertId })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

