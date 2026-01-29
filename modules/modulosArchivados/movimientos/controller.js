const model = require('./model')
const eventos = require("../eventos/controller")
const utils = require('../../public/js/utils')


exports.getLista = async (req, res) => {
    try {
        res.render('movimientos/views/index', {
            pagename: "Movimientos",
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
            SELECT m.*, u.usuario AS usuarioTxt
            FROM movimientos m
            LEFT JOIN secr u ON u.unica = m.id_usuario_creador_fk
            WHERE m.fecha between ? and ? `

        params.push(utils.changeDateYMD(req.body.desde), utils.changeDateYMD(req.body.hasta))
        if(req.body.tipo != 't'){
            query += ' AND m.tipo = ?'
            params.push(req.body.tipo)
        }

        query += ' ORDER BY m.fecha DESC, m.id DESC'

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
        if(String(req.body.tipo).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el tipo de movimiento' })
        if(String(req.body.motivo).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el motivo del movimiento' })
        if(String(req.body.fecha).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la fecha del movimiento' })

        req.body.id_usuario_creador_fk = req.session.user.id
        req.body.fecha = utils.changeDateYMD(req.body.fecha)
        resInsert = await model.insert(req.body)

        

        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente', insertId: resInsert.insertId })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}


exports.postDelete = async (req, res) => {
    try {
       
        await model.delete(req.body.id)
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    }
    catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postBlindar = async (req, res) => {
    try {
        await model.blindar(req.body.id)
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postDesblindar = async (req, res) => {
    try {
        await model.desblindar(req.body.id)
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}



//Movimientos Detalles
exports.getAltaItems = async (req, res) => {
    try {
        let movimiento = await model.execQuery('SELECT * FROM movimientos WHERE id = ?', [req.params.id])
        if(!movimiento.length) return res.redirect('/movimientos')
        movimiento = movimiento[0]
    if(movimiento.tipo === 0){
        movimiento.tipoTxt = 'Ingreso'
    }
    else if(movimiento.tipo === 1){
        movimiento.tipoTxt = 'Egreso'
    }
    console.log(movimiento)
        res.render('movimientos/views/altaItems', {
            pagename: "Detalle del movimiento",
            permisos: req.session.user.permisos,
            movimiento
        })
    }
    catch (error) {
        console.log(error)
        res.redirect('/movimientos')
    }
}


exports.getListaProductosAjax = async (req, res) => {
    try {
        let data = await model.execQuery(`
            SELECT p.*, m.cantidad
            FROM movimientos_detalle m
            LEFT JOIN productos p ON m.id_producto_fk = p.id
            WHERE m.id_movimiento_fk = ?
            ORDER BY p.Desc_Producto ASC
        `, [req.body.idMovimiento])
        if (!data.length) return res.json({ status: false, icon: 'warning', title: 'Alerta', text: 'No existen registros cargados' })
        res.json({ status: true, data })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}


exports.postAltaProductos = async (req, res) => {
    try {
        if(String(req.body.idMovimiento).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Movimiento inválido' })
        if(String(req.body.idProducto).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Producto inválido' })
        if(isNaN(req.body.cantidad) || Number(req.body.cantidad) <= 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Cantidad inválida' })
        await model.insertarProducto(req.body)
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    }
    catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postEliminarDetalle = async (req, res) => {
    try {
        await model.execQuery('DELETE FROM movimientos_detalle WHERE id = ?', [req.body.id])
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}