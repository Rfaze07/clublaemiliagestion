const model = require('./model')
const mCondicionesIva = require('../condicionesiva/model')
const utils = require('../../public/js/utils')


exports.getLista = async (req, res) => {
    try {
        const condicionesIva = await mCondicionesIva.getAllActivos()
            
        res.render('ventas/views/index', {
            pagename: "Ventas",
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
            SELECT c.*, ci.descripcion AS descCondIvaTxt
            FROM clientes c
            LEFT JOIN condiciones_iva ci ON ci.id = c.id_condicioniva_fk `

        if(req.body.activo != 't'){
            query += 'WHERE c.activo = ?'
            params.push(req.body.activo)
        }

        query += 'ORDER BY c.activo DESC, c.razon_social'

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
        req.body.puntoVenta = 1 //Por ahora fijo
        req.body.id_puntoventa_fk = 1 //Por ahora fijo
        req.body.empresa = 1 //Por ahora fijo (usuario es DEV,FALTA ASOCIAR USUARIO A EMPRESA))
        req.body.tipoComprobante = 7 //Interno Venta
        req.body.fecha = utils.changeDateYMD(utils.generateTodayDate())

        let ultimo = await model.getUltimoNumero(req.body.empresa, req.body.id_puntoventa_fk, req.body.tipoComprobante)
        req.body.numero = (ultimo[0].ultimoNumero == null) ? 1 : parseInt(ultimo[0].ultimoNumero) + 1

        

        let resInsert = await model.insertComprobante(req.body)
        if(!resInsert.insertId) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })

        let resInsertItems = await model.insertComprobanteItems(resInsert.insertId, req.body.productos)
        if(!resInsertItems.affectedRows) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })

        if(!resInsert.affectedRows) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente', id: resInsert.insertId })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}


exports.getImprimir = async (req, res) => {
    try {
        //if(!(req.params.id)) return res.redirect('/ventas')
        let dataComprobante = await model.getComprobanteById(req.params.id)
        //if(!dataComprobante.length) return res.redirect('/ventas')
        dataComprobante = dataComprobante[0]
        let dataComprobanteItems = await model.getComprobanteItemsByIdComprobante(req.params.id)

            // Formatear número de comprobante: 4 dígitos para punto de venta, 8 para número
            function getNumeroComprobante(pv, nc) {
                return String(pv).padStart(4, '0') + '-' + String(nc).padStart(8, '0');
            }
            dataComprobante.numeroFormateado = getNumeroComprobante(dataComprobante.punto_venta, dataComprobante.numero);
        
        dataComprobante.fechaFormateada = utils.changeDateDMY(dataComprobante.fecha)
        res.render('ventas/views/imprimirVenta', {
            pagename: "Imprimir Comprobante",
            permisos: req.session.user.permisos,
            comprobante: dataComprobante,
            items: dataComprobanteItems
        })
    } catch (error) {
        console.log(error)
        res.redirect('/ventas')
    }
}