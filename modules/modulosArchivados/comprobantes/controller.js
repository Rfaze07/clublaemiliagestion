const model = require('./model')
const eventos = require("../eventos/controller")

const mRepuestos = require("../repuestos/model")
const mFichasRepuestos = require("../fichasRepuestos/model")
const mArticulos = require("../articulos/model")
const mAlicuotasIva = require("../alicuotasIVA/model")
const mEventosAfip = require("../eventosAfip/model")
const utils = require('../../utils')
const swig = require('swig')
const numlet = require('../../public/js/numerosAletras')



// const mProveedores = require("../proveedores/model")
// const mClientes = require("../clientes/model")
// const mTareas = require("../tareas/model")
// const mEmpresas = require("../empresas/model")
// const mPuntoVenta = require("../puntosVenta/model")
// const mTiposComprobantes = require("../tiposComprobantes/model")
// const QRCode = require('qrcode')

swig.setFilter('numletras', numlet.numeroALetras)
swig.setFilter('currency', utils.formatCurrency)
swig.setFilter('formatCurrency', utils.formatCurrency)
swig.setFilter('padCodigo', nro => {
	nro = String(nro)
	return nro.padStart(4, 0)
})
swig.setFilter('toFixed', (input, decimales) => {
	if(isNaN(input)) return 0;
	
	decimales = decimales || 2;
	
	var multiplier = Math.pow(10, decimales);
	return parseFloat(Math.round(input * multiplier) / multiplier).toFixed(decimales);
})




/***************      COMPROBANTES DE COMPRAS       ***********************************************/

exports.getListaCompras = async (req, res) => {
    try {
        const tiposComprobantes = await model.getAllTiposCompActivosCompras()

        res.render('comprobantes/views/compras/lista', {
            pagename: "Comprobantes de compras",
            permisos: req.session.user.permisos,
            tiposComprobantes
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaComprasAjax = async (req, res) => {
    try {
        if(String(req.body.desde).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la fecha desde' })
        if(String(req.body.hasta).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la fecha hasta' })
        
        req.body.desde = utils.changeDateYMD(req.body.desde)
        req.body.hasta = utils.changeDateYMD(req.body.hasta)

        let data = await model.getAllByRangoFechas(req.body)
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getAltaCompras = async (req, res) => {
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

exports.postAltaCompras = async (req, res) => {
    try {
        const validaciones = await ValidarCamposCompraTitulo(req.body)
        if(!validaciones.status) return res.json(validaciones)

        let resInsert = await model.insert(req.body)
        if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
        res.json({
            status: true, 
            icon:"success", 
            title: "Éxito", 
            text: `Solicitud procesada correctamente, será redirigido para ingresar los items del comprobante.<br><strong>ID de comprobante: ${resInsert.insertId}</strong>`, 
            idComprobanteItem: resInsert.insertId
        })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getAltaItemsCompras = async (req, res) => {
    let comprobante = await model.getCompCompraTituloById(req.params.id)
    if(comprobante.length != 1) return res.redirect('/inicio')
    let articulos = await mArticulos.getAllbyActivo(1)

    res.render('comprobantes/views/compras/altaItems', {
        pagename: `Alta de items - Nro. de comprobante: ${comprobante[0].nroComprobanteTxt}`,
        permisos: req.session.user.permisos,
        comprobante: comprobante[0],
        articulos
    })
}

exports.getListaComprasItemsAjax = async (req, res) => {
    try {
        let data = await model.getComprobanteItemsById(req.body.idComprobante)
        if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getTareaIdProyectoAjax = async (req, res) => {
    try {
        if(String(req.body.id).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Hubo un error' })

        let data = []
        if(req.body.idProyectoTitulo == 0)
            data = await mTareas.getSinProyectoById(req.body.id)
        else
            data = await model.getTareaProyectoByIdFact(req.body.id)

        res.json({ status: true, data: data[0] })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postAltaItemsCompras = async (req, res) => {
    try {
        const validaciones = await ValidarCamposCompraDetalles(req.body)
        if(!validaciones.status) return res.json(validaciones)

        const valorAlicuota = await mAlicuotasIva.getValorAlicuotaIvaById(req.body.alicIva)
        let importeUnitario=0, importeTotal=0, obj={}, resInsertRepArt=null
        let iva = (parseFloat(valorAlicuota[0].valor)/100)+1
        importeTotal = parseFloat((parseFloat(req.body.precio * req.body.cantidad) * iva))
        importeUnitario = importeTotal / req.body.cantidad

        if(req.body.tipoItem == 'r'){
            const repuesto = await mRepuestos.getById(req.body.item)
            const comprTitulo = await model.getCompCompraTituloById(req.body.idComprobante)
            req.body.cantidad = parseInt(req.body.cantidad)
            let nroSerie = parseInt(req.body.nroSerie)
            let esNeumatico = repuesto[0].es_neumatico
            let deposito = req.body.deposito
            
            const body = {
                idComprobante: req.body.idComprobante,
                idArticulo: null,
                idRepuesto: repuesto[0].id,
                descripcion: repuesto[0].descripcion,
                costo: importeUnitario,
                precio: importeUnitario,
                total: importeTotal,
                iva: valorAlicuota[0].valor,
                cantidad: req.body.cantidad
            }                
            const resInsertItem = await model.insertItem(body)
            if(!resInsertItem.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud (1)" })
                
                
            for(let i=0; i<req.body.cantidad; i++){
                if(repuesto[0].es_ficha == 1){
                    nroSerie = (i == 0) ? nroSerie : nroSerie+1
                    let nroChas=null, medidasNeu=null, tipoNeu=null, condicion=null, modelo=null, fechaFab=null, fechaBaja=null, motivoBaja=null, observaciones=null
                    if(repuesto[0].es_neumatico == 1){
                        medidasNeu = req.body.medidasNeu
                        tipoNeu = req.body.tipoNeu
                        condicion = req.body.condNeu
                        modelo = req.body.modelo
                    }

                    obj = {
                        idComprobanteDetalle: resInsertItem.insertId,
                        repuesto: repuesto[0].id,
                        proveedor: comprTitulo[0].id_proveedor_fk,
                        nroChas, nroSerie,
                        fechaCompra: utils.generateTodayDateYMD(),
                        fechaFab, fechaBaja, motivoBaja,
                        esNeumatico, condicion, medidasNeu, tipoNeu,
                        modelo, deposito, observaciones,
                        importe: importeUnitario
                    }

                    resInsertRepArt = await mFichasRepuestos.insert(obj)
                    if(!resInsertRepArt.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud (2)" })
                // }else{
                //     repuesto[0].valor = importeUnitario
                //     repuesto[0].id_deposito_fk = deposito
                //     repuesto[0].idComprobanteDetalle = resInsertItem.insertId
                //     resInsertRepArt = await mRepuestos.insert(repuesto[0])
                }
            }

            
            return res.json({ status: true, icon:"success",  title: "Éxito", text: 'Solicitud procesada correctamente' })

        }else if(req.body.tipoItem == 'a'){
            let articulo = await mArticulos.getById(req.body.item)

            // await mArticulos.updateValor({
            //     iva: valorAlicuota[0].valor,
            //     costo: importeUnitario,
            //     precio1: importeUnitario,
            //     precio2: 0,
            //     id: articulo[0].id
            // })
            const body = {
                idComprobante: req.body.idComprobante,
                idArticulo: articulo[0].id,
                idRepuesto: null,
                cantidad: req.body.cantidad,
                descripcion: articulo[0].descripcion,
                costo: importeUnitario,
                precio: importeUnitario,
                iva: valorAlicuota[0].valor,
                total: importeTotal,
                tanque: req.body.tanque
            }

            const resInsertItem = await model.insertItem(body)
            if(!resInsertItem.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud (2)" })
            return res.json({ status: true, icon:"success",  title: "Éxito", text: 'Solicitud procesada correctamente' })
        }
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.getComprasById = async (req, res) => {    
    const data = await model.getById(req.body.id)
    if(!data.length) return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "No existen registros cargados" })
    res.json({ status: true, data: data[0] })
}

exports.getVer = async (req, res) => {
    try {
        let titulo = await model.getCompCompraTituloById(req.body.id)
        let detalles = await model.getComprobanteItemsById(req.body.id)

        titulo = {
            fecha_comprobante: titulo[0].fecha_comprobante,
            proveedorTxt: titulo[0].proveedorTxt,
            nroComprobanteTxt: titulo[0].nroComprobanteTxt,
            tipoComprobanteTxt: titulo[0].tipoComprobanteTxt,
            letra: titulo[0].letra,
            blindado: titulo[0].blindado
        }
        return res.json({ status: true, titulo, detalles })

    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: "error", icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postModificarCompras = async (req, res) => {
    try {
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

exports.postEliminarCompras = async (req, res) => {
    try {
        const item = await model.getComprobanteItemById(req.body.id)
        if(item.length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud (2)" })

        if(item[0].id_articulo_fk == 0 && item[0].id_repuesto_fk > 0){
            const repFicha = await mRepuestos.deleteRepuestoFicha(req.body.id)
            if(repFicha.affectedRows == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud (1)" })
        }

        const result = await model.delete(req.body.id)
        if(result.affectedRows == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud (2)" })
        return res.json({ status: true, icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

exports.postBlindarCompras = async (req, res) => {
     try {
         if(String(req.body.idComprobante).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })

        const puedoBlindar = await model.getComprobanteItemsById(req.body.idComprobante)
        console.log(puedoBlindar)
        if(puedoBlindar.length > 0){
            await model.updateBlindado(1, req.body.idComprobante)
            res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
        }else{
            res.json({ status: false, icon: 'warning', title: 'Alerta', text: 'Debe agregar al menos un item al comprobante' })
        } 
     } catch (error) {
         console.log(error)
         res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
     }
}

exports.postDesblindarCompras = async (req, res) => {
    try {
        if(String(req.body.idComprobante).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
        await model.updateBlindado(0, req.body.idComprobante)
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

const ValidarCamposCompraTitulo = o  => {
    return new Promise(async (resolve, reject) => {
        if(String(o.fecha).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar la fecha ' })
        if(String(o.tipoComprobante).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar el tipo de comprobante' })
        if(String(o.proveedor).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar el proveedor' })
        if(String(o.nroComprobante).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar el número de comprobante' })
        if(String(o.total).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar el total del comprobante' })
        if(isNaN(o.total)) return resolve({ status: false, icon:'error', title: 'Error', text: 'El total del comprobante debe ser numérico' })

        o.fecha = utils.changeDateYMD(o.fecha)
        o.ptoVenta = o.nroComprobante.split('-')[0]
        o.nroComprobante = o.nroComprobante.split('-')[1]

        if(String(o.impuestosOtros).trim().length == 0) o.impuestosOtros = 0
        if(String(o.iibbPba).trim().length == 0) o.iibbPba = 0
        if(String(o.percIva).trim().length == 0) o.percIva = 0
        if(String(o.percGanancias).trim().length == 0) o.percGanancias = 0
        if(String(o.percIibb).trim().length == 0) o.percIibb = 0
        if(String(o.percInternos).trim().length == 0) o.percInternos = 0

        return resolve({ status: true })
    })
}

const ValidarCamposCompraDetalles = o  => {
    return new Promise(async (resolve, reject) => {
        console.log(o)
        if(String(o.idComprobante).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Hubo un error, comuniquese con los programadores' })
        if(String(o.tipoItem).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar el tipo' })
        if(String(o.cantidad).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la cantidad' })
        if(isNaN(o.cantidad)) return resolve({ status: false, icon:'error', title: 'Error', text: 'La cantidad debe ser numérica' })
        if(String(o.item).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar el tipo de item' })

        if(o.tipoItem == 'r'){
            if(String(o.deposito).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar el depósito' })
            const repuesto = await mRepuestos.getById(o.item)
            if(repuesto[0].es_ficha == 1){
                if(String(o.nroSerie).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar el número de serie' })
                if(isNaN(o.nroSerie)) return resolve({ status: false, icon:'error', title: 'Error', text: 'El número de serie debe ser numérico' })
            }
            o.tanque = null
        }else if(o.tipoItem == 'a'){
            if(o.item == 0){
                if(String(o.tanque).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar el tanque' })
            }
        }

        if(String(o.precio).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar el precio' })
        if(isNaN(o.precio)) return resolve({ status: false, icon:'error', title: 'Error', text: 'El precio debe ser numérico' })
        if(String(o.alicIva).trim().length == 0) return resolve({ status: false, icon:'error', title: 'Error', text: 'Debe seleccionar el alícuota del IVA' })
        return resolve({ status: true })
    })
}






/***************      COMPROBANTES DE VENTAS        ***********************************************/

// exports.getListaVentas = async (req, res) => {
//     try {
//         const tiposComprobantes = await model.getAllTiposCompActivos()
//         const clientes = await mClientes.getAllActivos()
//         const empresas = await mEmpresas.getEmpresas()

//         res.render('comprobantes/views/ventas/lista', {
//             pagename: "Comprobantes de ventas",
//             permisos: req.session.user.permisos,
//             tiposComprobantes, clientes, empresas
//         })
//     } catch (error) {
//         console.log(error)
//         res.redirect('/inicio')
//     }
// }

// exports.getListaVentasAjax = async (req, res) => {
//     try {
//         if(String(req.body.empresa).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la empresa' })
//         if(String(req.body.desde).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la fecha desde' })
//         if(String(req.body.hasta).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la fecha hasta' })
        
//         req.body.desde = utils.changeDateYMD(req.body.desde)
//         req.body.hasta = utils.changeDateYMD(req.body.hasta)

//         let data = await model.getAllVentasByRangoFechas(req.body)
//         if(!data.length) return res.json({ status: false, type: "warning", icon:"warning", title: "Alerta", text: "No existen registros cargados" })
//         res.json({ status: true, data })
//     } catch (error) {
//         console.log(error)
//         return res.json({ status: false, type: "error",icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
//     }
// }

// exports.getAltaVentas = async (req, res) => {
//     try {
//         if((req.body.descripcion).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripción.' })
//         if((req.body.descripcion).trim().length >= 100) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La descripcion supero la cantidad permitida.' })
//         if((req.body.desc_corta).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Debe ingresar la descripcion corta.' })
//         if((req.body.desc_corta).trim().length >= 5) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'La descripcion corta supero la cantidad permitida.' })
        
//         let resInsert = await model.insert(req.body)
//         if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
//         res.json({ status: true, type: "success", icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })
//     } catch (error) {
//         console.log(error)
//         return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
//     }
// }

// exports.postAltaVentas = async (req, res) => {
//     try {
//         console.log(req.body)

//         //-------------  VALIDACIONES  -------------
//         //
//         if(String(req.body.empresa).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar una empresa' })
//         if(String(req.body.cliente).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar un cliente' })
//         if(String(req.body.fechaComp).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar una fecha' })
//         if(String(req.body.concepto).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar un concepto' })
//         if(req.body.concepto != 1){
//             if(String(req.body.fechaDesde).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la fecha desde' })
//             if(String(req.body.fechaHasta).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la fecha hasta' })
//             if(String(req.body.fechaVtoPago).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la fecha de vencimiento de pago' })
//         }
//         if(String(req.body.puntoVenta).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar un punto de venta' })
//         if(String(req.body.tipoComprobante).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar un tipo de comprobante' })


        
//         //-------------  ARMO OBJETO PARA INSERTAR COMPROBANTE  -------------
//         //
//         const ptoVenta = await mPuntoVenta.getPuntoVentaById(req.body.puntoVenta)
//         if(ptoVenta.length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al obtener el punto de venta, comuníquese con los programadores' })
//         req.body.idPuntoVenta = ptoVenta[0].id
//         req.body.puntoVenta = ptoVenta[0].punto_venta
        
//         const tipoComp = await mTiposComprobantes.getById(req.body.tipoComprobante)
//         if(tipoComp.length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al obtener el tipo de comprobante, comuníquese con los programadores' })
//         req.body.tipoComprobanteTxt = tipoComp[0].descripcion
//         req.body.letra = tipoComp[0].letra
        
//         req.body.fechaComp = utils.changeDateYMD(req.body.fechaComp)
//         req.body.proyecto = req.body.proyecto == 'sp' ? 0 : req.body.proyecto
//         if(req.body.concepto != 1){
//             req.body.fechaDesde = utils.changeDateYMD(req.body.fechaDesde)
//             req.body.fechaHasta = utils.changeDateYMD(req.body.fechaHasta)
//             req.body.fechaVtoPago = utils.changeDateYMD(req.body.fechaVtoPago)
//         }

//         const resInsert = await model.insertCompVentasTitulo(req.body)
//         if(!resInsert.affectedRows) return res.json({ status: false, type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
//         res.json({
//             status: true, 
//             icon:"success", 
//             title: "Éxito", 
//             text: `Solicitud procesada correctamente, será redirigido para ingresar los items del comprobante.<br><strong>ID de comprobante: ${resInsert.insertId}</strong>`, 
//             idComprobanteItem: resInsert.insertId
//         })

//     } catch (error) {
//         console.log(error)
//         return res.json({ status: false, type: "error", icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
//     }
// }

// exports.getListaTareasIdProyectoAjax = async (req, res) => {
//     try {
//         if(String(req.body.idProyectoTitulo).trim().length == 0) return res.json({ status: false, type: 'error', icon:'error', title: 'Error', text: 'Hubo un error' })
            
//         let data = []
//         if(req.body.idProyectoTitulo == 0)
//             data = await mTareas.getAllTareasSinProyectoActivo(1)
//         else
//             data = await model.getTareasProyectoFact(req.body.idProyectoTitulo)

//         if(data.length > 0) return res.json({ status: true, data })
//         return res.json({ status: true, icon:'error', title: "Error", text: "No existen tareas cargadas para el proyecto seleccionado o no existen tareas cargadas" })
//     } catch (error) {
//         console.log(error)
//         return res.json({ status: false, icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
//     }
// }

// exports.getAltaItemsVentas = async (req, res) => {
//     let comprobante = await model.getCompVentaTituloById(req.params.id)
//     if(comprobante.length != 1) return res.redirect('/inicio')
//     let articulos = await mArticulos.getAllbyActivo(1)

//     res.render('comprobantes/views/ventas/altaItems', {
//         pagename: `Comprobantes - Alta de items`,
//         permisos: req.session.user.permisos,
//         comprobante: comprobante[0],
//         articulos
//     })
// }

// exports.postAltaItemsVentas = async (req, res) => {
//     try {
//         if(String(req.body.idComprobante).trim().length == 0) return res.json({ status: false, icon:"warning", title: "Error", text: "Hubo un error (1)" })
//         if(String(req.body.idProyectoTitulo).trim().length == 0) return res.json({ status: false, icon:"warning", title: "Error", text: "Hubo un error (2)" })
//         if(req.body.tipoItem != 't' && req.body.tipoItem != 'a') return res.json({ status: false, icon:"warning", title: "Error", text: "Hubo un error (3)" })

//         let obj = {}
//         obj.id_comprobante_fk = req.body.idComprobante

//         if(req.body.tipoItem == 't'){
//             let tarea=null

//             // CONDICIONAL PARA SABER SI FACTURA TAREA DE PROYECTO O NO
//             if(req.body.idProyectoTitulo != 0){
//                 // VALIDO CANTIDAD DE HORAS REALES A FACTURAR Y LAS INGRESADAS
//                 let validoCantidad = await model.getTareasProyectoFact(req.body.idProyectoTitulo)
//                 if(validoCantidad.length == 0) return res.json({ status: false, icon:"warning", title: "Error", text: "Hubo un error (4)" })
//                 let horasPendDeFacturacion = validoCantidad[0].cantidad - parseFloat(validoCantidad[0].cantFacturado)
//                 if(req.body.cantidadT > horasPendDeFacturacion) return res.json({ status: false, icon:"warning", title: "Error", text: `La cantiadad de horas ingresadas no son válidas, superan las pendientes de facturación (${horasPendDeFacturacion})` })
//             }

//             tarea = await mTareas.getById(req.body.tarea)
//             obj.precio = parseFloat(req.body.precioT)

//             if(req.body.descuentoT.length == 0){
//                 obj.dto = 0
//                 obj.total = parseFloat(req.body.precioT)
//             }else if(req.body.descuentoT == 0){
//                 obj.dto = 0
//                 obj.total = parseFloat(req.body.precioT)
//             }else if(req.body.descuentoT > 0){
//                 obj.dto = parseFloat(req.body.descuentoT)
//                 obj.precioT = parseFloat(req.body.precioT)
//                 let calculo = (obj.dto * obj.precioT)/100
//                 obj.total = parseFloat(obj.precioT - calculo)
//             }

//             obj.id_articulo_fk = 0
//             obj.id_umed_fk = tarea[0].id_unmed_fk
//             obj.id_tarea_fk = req.body.tarea
//             obj.id_tarea_presupuesto_fk = req.body.tarea
//             obj.cantidad = req.body.cantidadT
//             obj.iva = 0
//             obj.esAdicional = utils.changeToBoolean(req.body.esAdicional)
//             obj.descripcion = req.body.descripcionT

//         }else if(req.body.tipoItem == 'a'){
//             let articulo = await mArticulos.getById(req.body.idArticulo)

//             if(req.body.precioConIva == 'true'){
//                 let iva = (parseFloat(articulo[0].alicuotaIvaValor)/100)+1
//                 obj.total = parseFloat(req.body.precio * parseInt(req.body.cantidad) * iva)
//             }else
//                 obj.total = parseFloat(req.body.precio * parseInt(req.body.cantidad))

//             if(req.body.descuento.length == 0){
//                 obj.dto = 0
//                 obj.total = parseFloat(obj.total)
//             }else if(req.body.descuento == 0){
//                 obj.dto = 0
//                 obj.total = parseFloat(obj.total)
//             }else if(req.body.descuento > 0){
//                 obj.dto = parseFloat(req.body.descuento)
//                 let calculo = (obj.dto * obj.total)/100
//                 obj.total = parseFloat(obj.total - calculo)
//             }

//             obj.id_tarea_fk = 0
//             obj.id_tarea_presupuesto_fk = 0
//             obj.id_articulo_fk = req.body.idArticulo
//             obj.cantidad = req.body.cantidad
//             obj.iva = articulo[0].alicuotaIvaValor
//             obj.precio = parseFloat(req.body.precio)
//             obj.id_umed_fk = articulo.length == 0 ? 0 : articulo[0].id_unmed_fk
//             obj.esAdicional = false
//             obj.descripcion = req.body.descripcion
//         }

//         let result = await model.insertItemVenta(obj)
//         if(result.affectedRows > 0){
//             const resTotales = await model.getTotalesComprobanteVentasItemsById(obj.id_comprobante_fk)
//             if(resTotales.length > 0) await model.updateComprobanteVentasById(resTotales[0], obj.id_comprobante_fk)

//             res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })
//         }else
//             res.json({ status: false, icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })

//     } catch (error) {
//         console.log(error)
//         return res.json({ status: false, icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
//     }
// }

// exports.getListaVentasItemsAjax = async (req, res) => {
//     try {
//         let data = await model.getComprobanteVentasItemsById(req.body.idComprobante)
//         // let iva = await model.getTotalIvaComprobanteVentasItemsById(req.body.idComprobante)
//         // let total = 0, importeNeto = 0

//         // if(iva.length == 0){
//         //     iva = arrIva
//         // }else if(iva.length == 1){
//         //     let idxCero = iva.find(el => el.iva == '10.50')
//         //     let idxUno = iva.find(el => el.iva == '21.00')

//         //     if(idxCero == undefined) iva.push(arrIva[0])
//         //     if(idxUno == undefined) iva.push(arrIva[1])
//         // }

//         let totales = await model.getTotalesComprobanteVentasItemsById(req.body.idComprobante)

//         for(let i=0; i<data.length; i++){
//             data[i].precioUniIva = parseFloat(data[i].precio) * parseFloat((parseFloat(data[i].iva)/100) + 1)
//             data[i].subtotalIva = (data[i].precioUniIva - parseFloat(data[i].precio)) * parseFloat(data[i].cantidad)
//             data[i].subtotalTotal = data[i].precioUniIva * parseFloat(data[i].cantidad)
//             // total += data[i].subtotalTotal
//             // importeNeto += parseFloat(data[i].precio) * parseFloat(data[i].cantidad)
//         }

//         if(!data.length){
//             return res.json({ 
//                 status: false, 
//                 icon:"warning", 
//                 title: "Alerta", 
//                 text: "No existen registros cargados", 
//                 total: totales[0].total, 
//                 importeNeto: totales[0].totalNeto, 
//                 iva21: totales[0].totalIva21, 
//                 iva105: totales[0].totalIva105
//             })
//         }

//         res.json({ 
//             status: true, 
//             data, 
//             total: totales[0].total, 
//             importeNeto: totales[0].totalNeto, 
//             iva21: totales[0].totalIva21, 
//             iva105: totales[0].totalIva105
//         })

//     } catch (error) {
//         console.log(error)
//         return res.json({ status: false, icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
//     }
// }

// exports.postEliminarItemVentas = async (req, res) => {
//     try {
//         const item = await model.getItemComprobanteVentaById(req.body.id)
//         if(item.length == 1){
//             const resDelete = await model.deleteItem(item[0].id)
//             if(resDelete.affectedRows > 0){
//                 // result = await model.getTotalComprobanteVentasItemsById(item[0].id_comprobante_fk)
//                 // if(result.length > 0) await model.updateTotalVentas(result[0].total , item[0].id_comprobante_fk)
//                 // res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })
//                 // let totalesIva = await model.getTotalIvaComprobanteVentasItemsById(item[0].id_comprobante_fk)

//                 // if(totalesIva.length == 0){
//                 //     totalesIva = arrIva
//                 // }else if(totalesIva.length == 1){
//                 //     let idxCero = totalesIva.find(el => el.iva == '10.50')
//                 //     let idxUno = totalesIva.find(el => el.iva == '21.00')
//                 //     if(idxCero == undefined) totalesIva.push(arrIva[0])
//                 //     if(idxUno == undefined) totalesIva.push(arrIva[1])
//                 // }
//                 // result = await model.getTotalComprobanteVentasItemsById(item[0].id_comprobante_fk)

//                 resTotales = await model.getTotalesComprobanteVentasItemsById(item[0].id_comprobante_fk)
//                 if(resTotales.length > 0) await model.updateComprobanteVentasById(resTotales[0], item[0].id_comprobante_fk)
//                 res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })

//             }else
//                 res.json({ status: false, icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
//         }else{
//             return res.json({ status: false, icon:"error", title: "Error", text: "Hubo un error al eliminar el item seleccionado" })
//         }
//     } catch (error) {
//         console.log(error)
//         return res.json({ status: false, icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
//     }
// }

// exports.postFacturar = async (req, res) => {
//     try {
//         console.log(req.body)

//         const { idComprobante, idEmpresa } = req.body
        
//         let compTitulo = await model.getCompVentaTituloById(idComprobante)
//         if(compTitulo.length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error, comuníquese con los programadores (1)' })
//         let compDetalles = await model.getComprobanteVentasItemsById(idComprobante)
//         if(compDetalles.length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error, comuníquese con los programadores (2)' })
//         let empresa = await mEmpresas.getEmpresasbyId(idEmpresa)
//         if(empresa.length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error, comuníquese con los programadores (3)' })

//         compTitulo = compTitulo[0]
//         empresa = empresa[0]

//         console.log('===================================================================')
//         console.log(compTitulo)
//         // console.log('----------------------------')
//         // console.log(compDetalles)
//         // console.log('----------------------------')
//         // console.log(empresa)
//         console.log('===================================================================')


//         let baseImp21 = 0, baseImp105 = 0, total21 = 0, total105 = 0, totalDetalles = 0, totalNeto = 0

//         if(compTitulo.letra.includes('I')){
//             try {
//                 const interno = await model.getUltInternoByEmpresaTiCompPtoVenta(compTitulo)
//                 if(interno.length == 0){
//                     await mEventosAfip.insert('Error al obtener el ultimo numero de interno', '', JSON.stringify(compTitulo), '')
//                     return res.json({ 
//                         status: false, 
//                         icon: 'error', 
//                         title: 'Error', 
//                         error: 'Hubo un error al obtener el último número de interno, comuníquese con los programadores' 
//                     })
//                 }
//                 const numero = parseInt(interno[0].ultimo)+1
//                 const resUpdate = await model.updateInterno(numero, compTitulo)
//                 if(resUpdate.affectedRows > 0){
//                     return res.json({ 
//                         status: true, 
//                         icon: 'success', 
//                         title: 'Éxito',
//                         error: '',
//                         html: `Comprobante interno cerrado correctamente`
//                     })
//                 }else{
//                     return res.json({ status: false, icon: 'error', title: 'Error', error: 'Hubo un error, comuníquese con los programadores' })
//                 }
                
//             } catch (error) {
//                 console.log(error)
//                 await mEventosAfip.insert('Error al obtener el ultimo numero de interno', '', JSON.stringify(compTitulo), '')
//                 return res.json({ 
//                     status: false, 
//                     icon: 'error', 
//                     title: 'Error', 
//                     error: 'Hubo un error al obtener el último número de interno, comuníquese con los programadores' 
//                 })
//             }
//         }
        
//         const cuit_correspondiente = empresa.cuit
//         const token_correspondiente = empresa.token_fe
//         const modo_correspondiente = empresa.modo_fe

//         const CbteNro = await ObtenerUltComprobanteFacturado(
//             compTitulo.punto_venta,
//             compTitulo.tipoComprobante,
//             cuit_correspondiente,
//             modo_correspondiente,
//             token_correspondiente
//         )

//         if(!CbteNro.status){
//             await mEventosAfip.insert(JSON.stringify(CbteNro), '', JSON.stringify(compTitulo), '', '')
//             return res.json({ status: false, icon: 'error', title: 'Error', error: CbteNro.error })
//         }

//         let obj = {
//             cuit: empresa.cuit, //empresa
//             modo: modo_correspondiente,
//             cbteTipo: compTitulo.tipoComprobante,
//             cantReg: "1",
//             ptoVta: compTitulo.punto_venta,
//             concepto: compTitulo.id_conceptoafip_fk, // 1 = Productos - 2 = Servicios - 3 = Productos y Servicios
//             docTipo: compTitulo.codigoAfip, //cliente
//             docNro: compTitulo.nro_documento, //cliente
//             CondicionIVAReceptorId: compTitulo.ivaReceptor,
//             cbteDesde: CbteNro.numero,
//             cbteHasta: CbteNro.numero,
//             cbteFecha: utils.changeDateArca(compTitulo.fecha_comprobante), 
//             total: compTitulo.total,
//             netoNoGrav: "0",
//             netoGrav: compTitulo.neto,
//             exento: "0",
//             impTrib: "0",
//             impIVA: 0,
//             monId: "PES",
//             monCotiz: "1"
//         }
        
//         if(compTitulo.id_conceptoafip_fk > 1){
//             obj.servDesde = utils.changeDateArca(compTitulo.fecha_serv_desde), // Fecha de inicio de servicio en formato aaaammdd (INTEGRER)
//             obj.servHasta = utils.changeDateArca(compTitulo.fecha_serv_hasta), // Fecha de inicio de servicio en formato aaaammdd (INTEGRER)
//             obj.vtoPago = utils.changeDateArca(compTitulo.fecha_serv_venc_pago) // Fecha de inicio de servicio en formato aaaammdd (INTEGRER)
//         }

//         // corregir para los letrta A  que agregue  el iva  
//         if(compTitulo.letra === 'A'){
//             for(const detalle of compDetalles){
//                 baseImp21 += detalle.iva
//                 total21 += detalle.total
//             }
//             obj.iva.push({
//                 id: 5,
//                 baseImp: String(baseImp21.toFixed(2)),
//                 importe: String(total21.toFixed(2))
//             })
//         }

//         console.log(obj)

//         const headers = { "Content-Type": "application/json", token: token_correspondiente }
//         const raw = JSON.stringify(obj)
//         const requestOptions = {
//             method: "POST",
//             headers: headers,
//             body: raw,
//             redirect: "follow"
//         }
//         const result = await fetch(`${process.env.URL_FACTURACION}/facturar`, requestOptions)
//         const data = await result.json()
//         if(!data.status){
//             await mEventosAfip.insert(`Error en la petición a la API de AFIP: ${data.error}`, '', JSON.stringify(obj), '')
//             return res.json({ status: false, icon: 'error', title: 'Error', error: `Error en la petición a la API de AFIP: ${data.error}` })
//         }

//         const resultArca = await model.updateResultArca(data.result.CAE, data.result.Vto_CAE, data.result.Obs, CbteNro.numero, idComprobante)
//         if(resultArca.affectedRows > 0){ // SI TODO ESTA BIEN RETORNO RES DE AFIP (CAE)
//             await mEventosAfip.insert('', '', JSON.stringify(obj), JSON.stringify(data.result))
//             return res.json({ 
//                 status: true,
//                 icon: 'success', 
//                 title: 'Éxito',
//                 error: '',
//                 html: `Comprobante generado correctamente.<br>
//                        <strong>CAE: ${data.result.CAE} - Fecha Venc.: ${utils.changeDateDMYArca(data.result.Vto_CAE)}</strong>
//                 `
//                 // status: true, 
//                 // ...data.result, 
//                 // numero: CbteNro.numero, 
//                 // Objeto: obj
//             })
//         }else{
//             await mEventosAfip.insert(`${JSON.stringify(resultArca)}`, '', JSON.stringify(obj), '')
//             res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
//         }
//     } catch (error) {
//         console.error("Error en la solicitud:", error)
//         await mEventosAfip.insert(`Error en la solicitud: ${String(error)}`, '', '', '')
//         res.json({ status: false, error })
//     }
// }

// exports.postImprimirComprobante = async (req, res) => {
// 	const tiposCopias = ['ORIGINAL', 'DUPLICADO', 'TRIPLICADO']
    
//     const titulo = await model.getComprobanteById(req.params.id)
//     const empresa = await mEmpresas.getEmpresasbyId(titulo[0].id_empresa_fk)
// 	const detalle = await model.getComprobanteItemsById(req.params.id)
// 	const cliente = await mClientes.getById(titulo[0].id_cliente_fk)
// 	let objQR = {
// 		ver: 1, // numerico
// 		fecha: titulo[0].fecha_facturado, // fecha > 1900-01-01
// 		cuit: parseInt(empresa[0].cuit), // numerico
// 		ptoVta: parseInt(titulo[0].punto_venta), // numerico
// 		tipoCmp: 1, // numerico | 1-Factura A
// 		nroCmp: parseInt(titulo[0].nro_comprobante), // numerico | hasta 8
// 		importe: titulo[0].total, // decimal | hasta 13 enteros y 2 decimales
// 		moneda: "PES", // caracter 3 || "PES" > Pesos Argentinos
// 		ctz: 1.0, // decimal | hasta 13 enteros y 6 decimales | 1 cuando es en pesos
// 		tipoDocRec: 80, // numerico | hasta 2 || 80-CUIT
// 		nroDocRec: parseInt(titulo[0].cuit), // numerico | hasta 20
// 		tipoCodAut: "E", // caracter || A=CAEA / E=CAE
// 		codAut: titulo[0].cae
// 	}

// 	const objJsonB64 = Buffer.from(JSON.stringify(objQR)).toString("base64")
// 	const qr = await QRCode.toDataURL(`https://www.afip.gob.ar/fe/qr/?p=${objJsonB64}`)

// 	res.render('comprobantes/views/ventas/impresion', {
// 		tiposCopias,
// 		empresa: empresa[0],
// 		cliente: cliente[0],
// 		titulo: titulo[0],
// 		detalle: detalle,
// 		qr,
// 		paraImprimir: true
// 	})
// }

// exports.postImprimir = async (req, res) => {
//     try {
//         if(String(req.body.idComprobante).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })

//         let titulo = await model.getCompVentaTituloById(req.body.idComprobante)
//         if(titulo.length == 1){

//             // let mediosPagos = await model.getListaMedioPagoByIdRecibo(req.body.idComprobante)
//             // if(mediosPagos.length > 0){
//             //     if(titulo[0].impreso == 0) await model.updateImpresoByIdOrdenPago(req.body.idComprobante)
//             // }else{
//             //     return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe cancelar el saldo pendiente o ingresar al menos un pago' })
//             // }

//             res.json({ 
//                 // impreso: titulo[0].impreso,
//                 status: true, 
//                 // icon: 'success', 
//                 // title: 'Éxito', text: 'Solicitud procesada correctamente', 
//                 url: `/comprobantesVentas/imprimir?id=${req.body.idComprobante}`
//             })

//         }else{
//             res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud (2)' })
//         }
//     } catch (error) {
//         console.log(error)
//         res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
//     }
// }

// exports.getImprimir = async (req, res) => {
//     try {
//         // VALIDACIONES
//         if(!req.query.id) return res.redirect('/')

//         let result = await ObtenerComprobanteVenta(req.query.id)

//         // VALIDACIONES
//         if(result.length == 0) return res.redirect('/')
//         // if(result.titulo.impreso == 1) return res.redirect('/')

//         const tiposCopias = ['ORIGINAL', 'DUPLICADO', 'TRIPLICADO']
//         result.titulo.punto_venta = String(result.titulo.punto_venta).padStart(5, '0')
//         result.titulo.numero = String(result.titulo.numero).padStart(8, '0')
//         result.titulo.cae_vence = utils.changeDateDMYArca(result.titulo.cae_vence)
//         result.empresa.imagen = result.empresa.imagen == null ? result.empresa.imagen : `/img/empresas/${result.empresa.imagen}`
//         result.empresa.cuit = utils.formatCUIT(result.empresa.cuit)
//         result.empresa.fecha_inicio = utils.changeDateDMY(result.empresa.fecha_inicio)
//         result.cliente.nro_documento = utils.formatCUIT(result.cliente.nro_documento)

//         let objQR = {
//             ver: 1, // numerico
//             fecha: result.titulo.fecha_comprobante, // fecha > 1900-01-01
//             cuit: parseInt(result.empresa.cuit), // numerico
//             ptoVta: parseInt(result.titulo.punto_venta), // numerico
//             tipoCmp: 1, // numerico | 1-Factura A
//             nroCmp: parseInt(result.titulo.numero), // numerico | hasta 8
//             importe: result.titulo.total, // decimal | hasta 13 enteros y 2 decimales
//             moneda: "PES", // caracter 3 || "PES" > Pesos Argentinos
//             ctz: 1.0, // decimal | hasta 13 enteros y 6 decimales | 1 cuando es en pesos
//             tipoDocRec: 80, // numerico | hasta 2 || 80-CUIT
//             nroDocRec: parseInt(result.cliente.cuit), // numerico | hasta 20
//             tipoCodAut: "E", // caracter || A=CAEA / E=CAE
//             codAut: result.titulo.cae
//         }

//         let objJsonB64 = Buffer.from(JSON.stringify(objQR)).toString("base64")
// 	    let qr = await QRCode.toDataURL(`https://www.afip.gob.ar/fe/qr/?p=${objJsonB64}`)

//         res.render('comprobantes/views/ventas/imprimir', {
//             pagename: 'Comprobante | Imprimir',
//             empresa: result.empresa,
//             cliente: result.cliente,
//             titulo: result.titulo,
//             detalles: result.detalles,
//             tiposCopias: result.titulo.letra === "I" ? ['Interno'] : tiposCopias, 
//             qr
//         })
//     } catch (error) {
//         console.log(error)
//         res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
//     }
// }


// exports.postTipoCompSelectAjax = async (req, res) => {
// 	try {
// 		if(String(req.body.idPtoVenta).trim().length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al obtener los tipos de comprobantes" })
// 		if(String(req.body.idEmpresa).trim().length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al obtener la empresa" })
// 		if(String(req.body.idCliente).trim().length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al obtener el cliente" })
			
// 		const puntoVenta = await mPuntoVenta.getPuntoVentaById(req.body.idPtoVenta)
// 		if(puntoVenta.length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud (1)" })

// 		const empresa = await mEmpresas.getLetraFEByEmpresa(req.body.idEmpresa)
//         if(empresa.length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud (2)" })
//         if(empresa[0].letra_fe == null) return res.json({ status: false, icon: "error", title: "Error", text: "Debe asignar los tipos de comprobantes de la empresa" })

//         let params = [], 
//             query = `
//                 SELECT tc.*
//                 FROM tipos_comprobantes tc
//                 WHERE tc.activo = 1 
//             `
// 		if(puntoVenta[0].habilita_interno && puntoVenta[0].habilita_arca){
// 				query += ` AND tc.codigo_afip >= 0 AND tc.letra IN (${empresa[0].letra_fe})`
// 		}else{
// 			if(!puntoVenta[0].habilita_interno) 
// 				query += ` AND tc.codigo_afip > 0 AND tc.letra IN (${empresa[0].letra_fe})`
// 			else 
// 				query += ` AND tc.codigo_afip = 0  AND tc.letra IN (${empresa[0].letra_fe})`
// 		}

//         query += ` ORDER BY tc.id`

//         const tiposComprobantes = await model.exectQuery(query, params)
//         if(tiposComprobantes.length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicidud (3)" })

// 		const condIVACliente = await model.getCondicionIvaByCliente(req.body.idCliente)
// 		if(condIVACliente.length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicidud (4)' })
			
// 		let data = []
// 		tiposComprobantes.map(el => {
// 			if(el.letra == 'A'){
// 				if(condIVACliente[0].A_M == 1) data.push(el)
// 			}
// 			if(el.letra == 'B'){
// 				if(condIVACliente[0].B == 1) data.push(el)
// 			}
// 			if(el.letra == 'C'){
// 				if(condIVACliente[0].C == 1) data.push(el)
// 			}
// 			if(el.letra == 'I'){
// 				data.push(el)
// 			}
// 		})

// 		if(data.length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "No existen puntos de venta para la empresa seleccionada" })
// 		res.json({ status: true, data })

// 	} catch (error) {
// 		console.log(error)
// 		return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
// 	}
// }






/* -----------------  FUNCIONES GLOBALES  ------------------- */

const ObtenerComprobanteVenta = idComprobante => {
    return new Promise(async (resolve, reject) => {
        const empresa = await model.getCompVentaEmpresaById(idComprobante)
        const cliente = await model.getCompVentaClienteById(idComprobante)
        const titulo = await model.getCompVentaTituloById(idComprobante)
        const detalles = await model.getComprobanteVentasItemsById(idComprobante)
        resolve({ status: true, cliente: cliente[0], empresa: empresa[0], titulo: titulo[0], detalles })
    })
}



/* -----------------  FUNCIONES GLOBALES ARCA  ------------------- */

const ObtenerUltComprobanteFacturado = async (punto_venta, tipo_comprobante, cuit, modo, token_correspondiente) => {
    return new Promise(async (resolve, reject) => {
        try {
            const myHeaders = new Headers()
            myHeaders.append("Content-Type", "application/json")
            myHeaders.append("token", token_correspondiente)

            const raw = JSON.stringify({
                cuit, 
                modo,
                ptoVta: punto_venta,
                cbteTipo: tipo_comprobante
            })

            let result = await fetch(`${process.env.URL_FACTURACION}/ultimoComprobante`, {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            })
            console.log(result)
            result = await result.json()
            if(!result.status){
                await mEventosAfip.insert(JSON.stringify(result.error), '', '', '')
                return resolve({ status: false, error: `Error en la petición a la API de AFIP: ${result.error}` })
            }
            resolve({ status: true, numero: parseInt(result.result.FECompUltimoAutorizadoResult.CbteNro)+1 })

        } catch (error) {
            console.log(error)
            resolve({ status: false, error: 'Hubo un error al solicitar la peticion con el servidor de facturación, comuníquese con los programadores' })
        }
    })
}