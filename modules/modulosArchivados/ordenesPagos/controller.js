const model = require('./model')
const mComprobantes = require("../comprobantes/model")
const mProveedores = require("../proveedores/model")
const mMediosPagos = require("../mediosPagos/model")
const utils = require('../../utils')
const eventos = require("../eventos/controller")
const swig = require('swig')
const numlet = require('../../public/js/numerosAletras')
// const aCopias = [ // PARA IMPRESION DE RECIBO > 0- Original y duplicado | 1- Original | 2- Duplicado
//     { id: 0, desc: 'Original y duplicado', valor: ['ORIGINAL', 'DUPLICADO']}, 
//     { id: 1, desc: 'Sólo original', valor: ['ORIGINAL']}, 
//     { id: 2, desc: 'Sólo duplicado', valor: ['DUPLICADO']}
// ]

swig.setFilter('numletras', numlet.numeroALetras)
swig.setFilter('currency', utils.formatCurrency)
// swig.setFilter('currencyPositivo', utils.valorPositivo)
swig.setFilter('formatCuit', utils.formatCUIT)


exports.getLista = async (req, res) => {
    try {
        const proveedores = await mProveedores.getAllActivos()

        res.render('ordenesPagos/views/lista', {
            pagename: "Órdenes de pagos",
            permisos: req.session.user.permisos,
            proveedores
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        if(String(req.body.desde).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la fecha desde' })
        if(String(req.body.hasta).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar la fecha hasta' })

        req.body.desde = utils.changeDateYMD(req.body.desde)
        req.body.hasta = utils.changeDateYMD(req.body.hasta)
        let data = await model.getAllByRangoFechas(req.body)
        res.json({ status: true, data })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postAlta = async (req, res) => {
    try {
        if(String(req.body.proveedor).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el proveedor' })
        if(String(req.body.fecha).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la fecha' })

        req.body.fecha = utils.changeDateYMD(req.body.fecha)

        let resInsert = await model.insert(req.body)
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente', id: resInsert.insertId })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.getAltaItems = async (req, res) => {
    let ordenPago = await model.getOrdenPagoTituloById(req.params.id)
    if(ordenPago.length == 0) return res.redirect('/inicio')

    let comprobantes = await mComprobantes.getComprobantesProveedores()
    let mediosPagos = await mMediosPagos.getAllbyActivo(1)
    let btnImprimirHidden = await model.getListaMedioPagoByIdOrdenPago(req.params.id)
    btnImprimirHidden = btnImprimirHidden.length > 0 ? false : true

    res.render('ordenesPagos/views/altaItems', {
        pagename: "Órdenes de pagos - Alta de datos (NOTA: Definir proceso de impresion de OP parcial o final)",
        permisos: req.session.user.permisos,
        ordenPago: ordenPago[0],
        comprobantes, mediosPagos, btnImprimirHidden
    })
}

exports.getComprobanteById = async (req, res) => {
    try {
        let comprobante = await mComprobantes.getComprobanteById(req.body.id)
        res.json({ status: true, comprobante: comprobante[0] })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'HUbo un error al procesar la solicitud' })
    }
}

exports.getOrdePagoById = async (req, res) => {
    try {
        
        if(String(req.body.id).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })

        let titulo = await model.getOrdenPagoTituloById(req.body.id)
        if(titulo.length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error (1)' })
        res.json({ status: true, titulo: titulo[0] })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postModificar = async (req, res) => {

}

const ObtenerOrdenPagos = idOrdenPago => {
    return new Promise(async (resolve, reject) => {
        const titulo = await model.getOrdenPagoTituloById(idOrdenPago)
        const comprobantes = await model.getListaComprobantesByIdOrdenPago(idOrdenPago)
        const mediosPagos = await model.getListaMedioPagoByIdOrdenPago(idOrdenPago)
        const totales = await CalcularTotalesByOrden(idOrdenPago)
        resolve({ status: true, titulo: titulo[0], comprobantes, mediosPagos, totales })
    })
}

exports.postVer = async (req, res) => {
    try {
        if(String(req.body.idOrdenPago).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
        
        let result = await ObtenerOrdenPagos(req.body.idOrdenPago)
        res.json(result)
                
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postImprimir = async (req, res) => {
    /*-----------------------------------------------------------------------------------------------------

                    HAY QUE DEFINIR COMO FUNCIONA EL IMPRIMIR, SI SE PERMITE CON PAGO PARCIAL O TOTAL   

    -----------------------------------------------------------------------------------------------------*/

    

    try {
        if(String(req.body.idOrdenPago).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })

        let titulo = await model.getOrdenPagoTituloById(req.body.idOrdenPago)
        if(titulo.length == 1){

            let mediosPagos = await model.getListaMedioPagoByIdOrdenPago(req.body.idOrdenPago)
            if(mediosPagos.length > 0){
                if(titulo[0].impreso == 0) await model.updateImpresoByIdOrdenPago(req.body.idOrdenPago)
            }else{
                return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe cancelar el saldo pendiente o ingresar al menos un pago' })
            }

            res.json({ 
                impreso: titulo[0].impreso,
                status: true, 
                icon: 'success', 
                title: 'Éxito', text: 'Solicitud procesada correctamente', 
                url: `/ordenesPagos/imprimir?id=${req.body.idOrdenPago}`
            })

        }else{
            res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud (2)' })
        }
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.getImprimir = async (req, res) => {
    /*-----------------------------------------------------------------------------------------------------

                HAY QUE DEFINIR COMO FUNCIONA EL IMPRIMIR, SI SE PERMITE CON PAGO PARCIAL O TOTAL   

    -----------------------------------------------------------------------------------------------------*/
    
    
    
    try {
        // VALIDACIONES
        if(!req.query.id) return res.redirect('/')

        let result = await ObtenerOrdenPagos(req.query.id)
        console.log(result)

        // VALIDACIONES
        if(result.length == 0) return res.redirect('/')
        // if(result.titulo.impreso == 1) return res.redirect('/')

        result.titulo.id = String(result.titulo.id).padStart(8, '0')

        res.render('ordenesPagos/views/imprimir', {
            pagename: 'Orden de pago | Imprimir',
            titulo: result.titulo,
            comprobantes: result.comprobantes,
            mediosPagos: result.mediosPagos,
            totales: result.totales
        })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postEliminar = async (req, res) => {

}





/****************************************
            DETALLES ALTA
****************************************/

exports.getTotalesByIdOrdenPago = async (req, res) => {
    let result = await CalcularTotalesByOrden(req.body.idOrdenPago)
    res.send(result)
}

const CalcularTotalesByOrden = idOrdenPago => {
    return new Promise(async (resolve, reject) => {
        try {
            if(String(idOrdenPago).length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
    
            let existe = await model.getOrdenPagoTituloById(idOrdenPago)
            if(existe.length == 1){
                // obtengo totales 
                let totOP = await model.getTotalesByIdOrdenPago(idOrdenPago)
                // boton imrpimri
                let btnImprimirHidden = await model.getListaMedioPagoByIdOrdenPago(idOrdenPago)
                btnImprimirHidden = btnImprimirHidden.length > 0 ? false : true

                const total = parseFloat(parseFloat(totOP[0].total).toFixed(2))
                const totalPagado = parseFloat(parseFloat(totOP[0].totalPagado).toFixed(2))
                const saldoPendiente = parseFloat(parseFloat(parseFloat(totOP[0].total) - parseFloat(totOP[0].totalPagado)).toFixed(2))

                resolve({
                    status: true,
                    total,
                    totalPagado,
                    saldoPendiente,
                    btnImprimirHidden
                })
            }else{
                resolve({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
            }
        } catch (error) {
            console.log(error)
            resolve({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        }
    })
}

exports.postBlindar = async (req, res) => {
    try {
        if(String(req.body.idOrdenPago).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
            
        await model.updateBlindado(1, req.body.idOrdenPago)
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postDesblindar = async (req, res) => {
    try {
        if(String(req.body.idOrdenPago).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
            
        await model.updateBlindado(0, req.body.idOrdenPago)
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}




/****************************************
            COMPROBANTES
****************************************/

exports.getComprobantesListaAjax = async (req, res) => {
    try {
        let data = await model.getListaComprobantesByIdOrdenPago(req.body.idOrdenPago)
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postAltaComprobantes = async (req, res) => {
    try {
        if(String(req.body.idOrdenPago).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
        if(String(req.body.idComprobante).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
        
        req.body.usuario = req.session.user.id

        let comprobante = await model.verificoComprobante(req.body.idComprobante)
        if(comprobante[0].existe == 0){
            let resInsert = await model.insertComprobante(req.body)
            res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
        }else{
            res.json({ status: false, icon: 'error', title: 'Error', text: 'El comprobante que se quiere asociar ya existe!' })
        }
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postEliminarComprobante = async (req, res) => {
    try {
        if(String(req.body.id).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
        await model.deleteComprobante(req.body.id)
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}



/****************************************
            MEDIOS DE PAGOS
****************************************/

exports.getMediosPagosListaAjax = async (req, res) => {
    try {
        let data = await model.getListaMedioPagoByIdOrdenPago(req.body.idOrdenPago)
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postAltaMediosPagos = async (req, res) => {
    try {
        if(String(req.body.idMedioPago).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el medio de pago' })
        if(String(req.body.importe).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el importe' })
        if(req.body.importe == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el importe' })
        if(String(req.body.fecha).length == 0 || String(req.body.fecha).length < 10) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar una fecha válida' })
        if(String(req.body.idOrdenPago).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })

        let totales = await CalcularTotalesByOrden(req.body.idOrdenPago)
        if(totales.saldoPendiente == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'El saldo pendiente de la orden de pago está cancelado' })

        req.body.fecha = utils.changeDateYMD(req.body.fecha)
        req.body.usuario = req.session.user.id
        
        let medioPago = await model.verificoMedioPago(req.body)
        if(medioPago[0].existe == 0){
            await model.insertMedioPago(req.body)
            res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
        }else{
            res.json({ status: false, icon: 'error', title: 'Error', text: 'El comprobante que se quiere asociar ya existe!' })
        }
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postEliminarMedioPago = async (req, res) => {
    try {
        if(String(req.body.id).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
        await model.deleteMedioPago(req.body.id)        
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}