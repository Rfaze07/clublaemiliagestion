const model = require('./model')
const mComprobantes = require("../comprobantes/model")
const mPuntosVenta = require("../puntosVenta/model")
const mMediosPagos = require("../mediosPagos/model")
const mEmpresas = require("../empresas/model")
const utils = require('../../utils')
// const eventos = require("../eventos/controller")
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
        const empresas = await mEmpresas.getEmpresas()

        res.render('recibos/views/lista', {
            pagename: "Recibos",
            empresas,
            permisos: req.session.user.permisos
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
        const validaciones = await ValidarCampos(req.body)
        if(!validaciones.status) return res.json(validaciones)

        const puntoVenta = await mPuntosVenta.getPuntoVentaById(req.body.puntoVenta)
        if(puntoVenta.length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al obtener el punto de venta' })

        req.body.puntoVentaTxt = puntoVenta[0].punto_venta
        req.body.unica = req.session.user.id
        
        let resInsert = await model.insert(req.body)
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente', id: resInsert.insertId })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.getAltaItems = async (req, res) => {
    let recibo = await model.getReciboTituloById(req.params.id)
    if(recibo.length == 0) return res.redirect('/inicio')

    let comprobantes = await mComprobantes.getComprobantesByCliente(recibo[0].id_cliente_fk, recibo[0].id_empresa_fk)
    let mediosPagos = await mMediosPagos.getAllbyActivo(1)
    let btnImprimirHidden = await model.getListaMedioPagoByIdRecibo(req.params.id)
    btnImprimirHidden = btnImprimirHidden.length > 0 ? false : true
    recibo[0].puntoVentaTxt = String(recibo[0].puerto).padStart(5, '0')
    recibo[0].numeroTxt = String(recibo[0].numero).padStart(8, '0')

    res.render('recibos/views/altaItems', {
        pagename: "Recibos - Alta",
        permisos: req.session.user.permisos,
        recibo: recibo[0],
        comprobantes, mediosPagos, btnImprimirHidden
    })
}

exports.getComprobanteById = async (req, res) => {
    try {
        let comprobante = await mComprobantes.getCompVentaTituloDatosById(req.body.id)
        res.json({ status: true, comprobante: comprobante[0] })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.getReciboById = async (req, res) => {
    try {
        
        if(String(req.body.id).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })

        let titulo = await model.getReciboTituloById(req.body.id)
        if(titulo.length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error (1)' })
        res.json({ status: true, titulo: titulo[0] })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postModificar = async (req, res) => {

}

const ObtenerRecibos = idRecibo => {
    return new Promise(async (resolve, reject) => {
        const empresa = await model.getReciboEmpresaById(idRecibo)
        const titulo = await model.getReciboTituloById(idRecibo)
        const comprobantes = await model.getListaComprobantesByIdRecibo(idRecibo)
        const mediosPagos = await model.getListaMedioPagoByIdRecibo(idRecibo)
        const totales = await CalcularTotalesByRecibo(idRecibo)
        resolve({ status: true, empresa: empresa[0], titulo: titulo[0], comprobantes, mediosPagos, totales })
    })
}

exports.postVer = async (req, res) => {
    try {
        if(String(req.body.idRecibo).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
        console.log(req.body)
        let result = await ObtenerRecibos(req.body.idRecibo)
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
        if(String(req.body.idRecibo).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })

        let titulo = await model.getReciboTituloById(req.body.idRecibo)
        if(titulo.length == 1){

            let mediosPagos = await model.getListaMedioPagoByIdRecibo(req.body.idRecibo)
            if(mediosPagos.length > 0){
                if(titulo[0].impreso == 0) await model.updateImpresoByIdOrdenPago(req.body.idRecibo)
            }else{
                return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe cancelar el saldo pendiente o ingresar al menos un pago' })
            }

            const recibo = await model.getUltReciboByEmpresaPtoVenta(titulo[0])
            if(recibo.length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Huboo un error al obtener el recibo (1)' })
            const numero = parseInt(recibo[0].ultimo)+1
            const resUpdate = await model.updateNumeroRecibo(numero, req.body.idRecibo)
            if(resUpdate.affectedRows > 0){
                res.json({ 
                    impreso: titulo[0].impreso,
                    status: true, 
                    icon: 'success', 
                    title: 'Éxito', text: 'Solicitud procesada correctamente', 
                    url: `/recibos/imprimir?id=${req.body.idRecibo}`
                })
            }else{
                res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud (2)' })
            }
        }else{
            res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud (3)' })
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

        let result = await ObtenerRecibos(req.query.id)

        // VALIDACIONES
        if(result.length == 0) return res.redirect('/')
        // if(result.titulo.impreso == 1) return res.redirect('/')

        result.titulo.puntoVentaTxt = String(result.titulo.punto_venta).padStart(5, '0')
        result.titulo.numeroTxt = String(result.titulo.numero).padStart(8, '0')
        result.titulo.nro_documento = utils.formatCUIT(result.titulo.nro_documento)
        result.empresa.cuit = utils.formatCUIT(result.empresa.cuit)
        result.empresa.fecha_inicio = utils.changeDateDMY(result.empresa.fecha_inicio)
        result.empresa.imagen = result.empresa.imagen == null ? result.empresa.imagen : `/img/empresas/${result.empresa.imagen}`

        res.render('recibos/views/imprimir', {
            pagename: 'Recibo | Imprimir',
            empresa: result.empresa,
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

exports.getPuntoVentaEmpresaAjax = async (req, res) => {
    try {
        const data = await mPuntosVenta.getPuntoVentaByEmpresa(req.body.empresa)
        if(!data.length) return res.json({ status: false, icon: 'error', title: 'Error', text: 'La empresa seleccionada no tiene puntos de ventas habilitados para recibos' })
        
        const habilitaRec = data.filter(el => el.habilita_recibo == 0)
        if(habilitaRec.length > 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'La empresa seleccionada no está habilitada para recibos' })
        
        data.map(el => {
            el.puntoVentaTxt = String(el.punto_venta).padStart(5, '0')
        })

        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

const ValidarCampos = o => {
    return new Promise(async (resolve, reject) => {
        if(String(o.empresa).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la empresa' })
        if(String(o.puntoVenta).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el punto de venta' })
        if(String(o.fecha).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la fecha' })
        if(String(o.cliente).trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el cliente' })

        o.fecha = utils.changeDateYMD(o.fecha)

        resolve({ status: true })
    })
}





/****************       DETALLES ALTA       *************************/

exports.getTotalesByIdOrdenPago = async (req, res) => {
    let result = await CalcularTotalesByRecibo(req.body.idRecibo)
    res.send(result)
}

const CalcularTotalesByRecibo = idRecibo => {
    return new Promise(async (resolve, reject) => {
        try {
            if(String(idRecibo).length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
    
            let existe = await model.getReciboTituloById(idRecibo)
            if(existe.length == 1){
                let totRecibo = await model.getTotalesByIdRecibo(idRecibo)
                let btnImprimirHidden = await model.getListaMedioPagoByIdRecibo(idRecibo)
                btnImprimirHidden = btnImprimirHidden.length > 0 ? false : true

                if(totRecibo.length == 0){
                    resolve({
                        status: true,
                        total: 0,
                        totalPagado: 0,
                        saldoPendiente: 0,
                        btnImprimirHidden
                    })
                }else{
                    const total = parseFloat(parseFloat(totRecibo[0].total).toFixed(2))
                    const totalPagado = parseFloat(parseFloat(totRecibo[0].totalPagado).toFixed(2))
                    const saldoPendiente = parseFloat(parseFloat(parseFloat(totRecibo[0].total) - parseFloat(totRecibo[0].totalPagado)).toFixed(2))
    
                    resolve({
                        status: true,
                        total,
                        totalPagado,
                        saldoPendiente,
                        btnImprimirHidden
                    })
                }
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
        if(String(req.body.idRecibo).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
            
        const comp = await model.getListaComprobantesByIdRecibo(req.body.idRecibo)
        const medPago = await model.getListaMedioPagoByIdRecibo(req.body.idRecibo)

        if(comp.length == 0 || medPago.length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'No se puede blindar si no existen comprobantes y medios de pagos cargados' })

        await model.updateBlindado(1, req.body.idRecibo)
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postDesblindar = async (req, res) => {
    try {
        if(String(req.body.idRecibo).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
            
        await model.updateBlindado(0, req.body.idRecibo)
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })

    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}




/****************       COMPROBANTES        *************************/

exports.getComprobantesListaAjax = async (req, res) => {
    try {
        let data = await model.getListaComprobantesByIdRecibo(req.body.idRecibo)
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postAltaComprobantes = async (req, res) => {
    try {
        if(String(req.body.idRecibo).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
        if(String(req.body.idComprobante).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })
        
        req.body.usuario = req.session.user.id

        let resInsert = await model.insertComprobante(req.body)
        if(resInsert.affectedRows == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })

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



/****************       MEDIOS DE PAGOS        *************************/

exports.getMediosPagosListaAjax = async (req, res) => {
    try {
        let data = await model.getListaMedioPagoByIdRecibo(req.body.idRecibo)
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
        if(String(req.body.idRecibo).length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error' })

        let totales = await CalcularTotalesByRecibo(req.body.idRecibo)
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