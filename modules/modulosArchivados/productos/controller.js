const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")


exports.getLista = async (req, res) => {
    try {
        res.render('productos/views/index', {
            pagename: "Productos",
            permisos: req.session.user.permisos
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getImprimirEtiqueta = async (req, res) => {
    try {
        let producto = await model.getById(req.params.id)
        if(!producto.length) return res.redirect('/productos')
        producto[0].precio = (parseFloat(producto[0].Costo) * (1 + (parseFloat(producto[0].Porcentaje) / 100))).toFixed(2) 
        producto[0].precioIva = (producto[0].precio * (1 + (parseFloat(producto[0].porcIva) / 100))).toFixed(2)
        producto[0].precioIvaF = utils.formatCurrency(producto[0].precioIva)    
        res.render('productos/views/imprimirEtiqueta', {
            pagename: "Etiquetas de productos",
            permisos: req.session.user.permisos,
            producto: producto[0]
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getImprimirEtiquetas = async (req, res) => {
    try {
        console.log('idComprobante recibido:', req.query.idComprobante)
        let productos = await model.getProductosByIdComprobanteCompra(req.query.idComprobante)
        if(!productos.length) return res.redirect('/productos')
        productos.forEach(producto => {
            producto.precio = (parseFloat(producto.Costo) * (1 + (parseFloat(producto.Porcentaje) / 100))).toFixed(2)
            producto.precioIva = (producto.precio * (1 + (parseFloat(producto.porcIva) / 100))).toFixed(2)
            producto.precioIvaF = utils.formatCurrency(producto.precioIva)
        })
        console.log('Productos procesados:', productos)
        res.render('productos/views/imprimirEtiquetas', {
            pagename: "Etiquetas de productos",
            permisos: req.session.user.permisos,
            productos
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}




exports.getListaAjax = async (req, res) => {
    try {
        let params = []
        let query = `
            SELECT p.*, CONCAT(u.desc_corta, ' - ', u.descripcion) AS unidadMedidaTxt, m.descripcion AS marcaTxt, r.descripcion AS rubroTxt, a.valor as porcIva
            FROM productos p
            LEFT JOIN unmed u ON u.id = p.id_unmed_fk
            LEFT JOIN marcas m ON m.id = p.id_marca_fk
            LEFT JOIN rubros r ON r.id = p.id_rubro_fk
            LEFT JOIN alicuotas_iva a ON a.id = p.id_alicuota_iva_fk
            WHERE 1 = 1
        `

        if(req.body.activo != 't'){
            query += ` AND p.activo = ?`
            params.push(req.body.activo)
        }
        if(req.body.marca != 't'){
            query += ` AND p.id_marca_fk = ?`
            params.push(req.body.marca)
        }

        if(req.body.rubro != 't'){
            query += ` AND p.id_rubro_fk = ?`
            params.push(req.body.rubro)
        }
        if(req.body.unidad != 't'){
            query += ` AND p.id_unmed_fk = ?`
            params.push(req.body.unidad)
        }

        const data = await model.execQuery(query + ' ORDER BY p.desc_producto', params)
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getListaSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllbyActivo(1)
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAlta = async (req, res) => {
    try {
        const validar = await ValidarCampos(req.body)
        if(!validar.status) return res.json(validar)
        
        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Productos", acc: "a", registro: resInsert.insertId })
        res.json({ status: true, type: "success", icon:"success", title: "Éxito", text: "Solicitud procesada correctamente", insertId: resInsert.insertId  })
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
        const validar = await ValidarCampos(req.body)
        if(!validar.status) return res.json(validar)

        req.body.activo = utils.changeToBoolean(req.body.activo)

        const result = await model.update(req.body)
        if(result.affectedRows == 0) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
        await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Productos", acc: "m", registro: req.body.id })
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
         await eventos.insertarEvento({usuario: req.session.user.id, tabla: "Cargos",acc: "b",registro: req.body.id});            
         return res.json({ status: true, type: "success", icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

     } catch (error) {
         console.log(error)
         return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
     }
}

const ValidarCampos = o => {
    return new Promise((resolve, reject) => {
        if(String(o.codBarras).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la Codigo de Barras' })
        if(String(o.descripcion).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la descripción' })
        if(String(o.descripcion).trim().length > 100) return resolve({ status: false, icon:'error', title: 'Error', text: 'La descripción superó la cantidad permitida de caracteres (Máx.: 100)' })

        if(String(o.unidadMedida).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar la unidad de medida' })
        if(String(o.marca).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar la marca' })
        if(String(o.rubro).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar el rubro' })
        if(isNaN(parseFloat(o.costo)) || parseFloat(o.costo) < 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'El costo ingresado es inválido' })
        if(isNaN(parseFloat(o.porcentaje)) || parseFloat(o.porcentaje) < 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'El porcentaje ingresado es inválido' })
        if(String(o.alicuota).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar la alícuota de IVA' })
        if(String(o.stockMinimo).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar el stock mínimo' })



        return resolve({ status: true })
    })
}


exports.postBuscar = async (req, res) => {
    try {
        let params = [req.body.codigo]
        let query = `
            SELECT p.*, CONCAT(u.desc_corta, ' - ', u.descripcion) AS unidadMedidaTxt, m.descripcion AS marcaTxt, r.descripcion AS rubroTxt, a.valor as porcIva
            FROM productos p
            LEFT JOIN unmed u ON u.id = p.id_unmed_fk
            LEFT JOIN marcas m ON m.id = p.id_marca_fk
            LEFT JOIN rubros r ON r.id = p.id_rubro_fk
            LEFT JOIN alicuotas_iva a ON a.id = p.id_alicuota_iva_fk
            WHERE p.Cod_Producto = ? AND p.activo = 1
        `   

        const data = await model.execQuery(query, params)
        if(!data.length) {
            return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        }
        
        data[0].precio = (parseFloat(data[0].Costo) * (1 + (parseFloat(data[0].Porcentaje) / 100))).toFixed(2) 
        data[0].precioIva = (data[0].precio * (1 + (parseFloat(data[0].porcIva) / 100))).toFixed(2)

        return res.json({ status: true, producto: data[0] })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}
