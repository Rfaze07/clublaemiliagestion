const { queryMYSQL } = require("../../database");


/****************       RECIBOS TITULO      **********************/ 

exports.getAllByRangoFechas = o => {
	return queryMYSQL(`
        SELECT r.*, cl.razon_social AS clienteTxt, 
               LPAD(r.punto_venta,5,'0') AS puntoVentaTxt, 
               LPAD(r.numero,8,'0') AS numeroTxt,
               e.razon_social AS empresaTxt, e.cuit AS cuitEmpresa
        FROM recibos r
        LEFT JOIN clientes cl ON cl.id = r.id_cliente_fk 
        LEFT JOIN empresas e ON e.id = r.id_empresa_fk 
        WHERE r.fecha_recibo BETWEEN ? AND ?
    `, [o.desde, o.hasta])
}

exports.insert = o => {
	return queryMYSQL(`
        INSERT INTO recibos (id_empresa_fk, id_cliente_fk, fecha_recibo, fecha_alta, 
                             id_puntoventa_fk, punto_venta, observacion, id_usuario_fk)
        VALUES (?,?,?,NOW(),?,?,?,?)
    `, [o.empresa, o.cliente, o.fecha, o.puntoVenta, o.puntoVentaTxt, o.observaciones, o.unica])
}

exports.getReciboEmpresaById = id => {
	return queryMYSQL(`
        SELECT e.razon_social, e.cuit, e.direccion, e.email, e.imagen, e.telefono, 
               e.fecha_inicio, l.descripcion AS localidad, l.cp, p.descripcion AS provincia
        FROM recibos r
        LEFT JOIN empresas e ON e.id = r.id_empresa_fk 
        LEFT JOIN localidades l ON l.id = e.id_localidad_fk 
        LEFT JOIN provincias p ON p.id = l.id_provincia_fk 
        WHERE r.id = ?
    `, [id])
}

exports.getReciboTituloById = id => {
	return queryMYSQL(`
        SELECT r.*, cl.razon_social AS clienteTxt, cl.nro_documento, tda.descripcion AS tipoDoc,
               LPAD(r.punto_venta,5,'0') AS puntoVentaTxt, LPAD(r.numero,8,'0') AS numeroTxt,
               ci.descripcion AS condicionIVATxt, cl.direccion, s.usuario 
        FROM recibos r
        LEFT JOIN clientes cl ON cl.id = r.id_cliente_fk 
        LEFT JOIN condiciones_iva ci ON ci.id = cl.id_condicioniva_fk
        LEFT JOIN tipos_documentos_afip tda ON tda.id = cl.id_tipodoc_fk 
        LEFT JOIN secr s ON s.unica = r.id_usuario_fk 
        WHERE r.id = ?
    `, [id])
}

exports.updateImpresoByIdOrdenPago = id => {
	return queryMYSQL(`
        UPDATE recibos 
        SET impreso = 1, fecha_impresion = NOW()
        WHERE id = ?
    `, [id])
}

exports.getUltReciboByEmpresaPtoVenta = o => {
    return queryMYSQL(`
        SELECT IFNULL(MAX(r.numero), 0) AS ultimo
        FROM recibos r 
        WHERE r.id_empresa_fk = ? AND  
            r.id_puntoventa_fk = ?
    `, [o.id_empresa_fk, o.id_puntoventa_fk])
}

exports.updateNumeroRecibo = (numero, id) => {
    return queryMYSQL(`
        UPDATE recibos
        SET numero=?, blindado=1
        WHERE id=?
    `, [numero, id])
}



/****************       RECIBOS DETALLES        **********************/ 

exports.getTotalesByIdRecibo2 = idRecibo => {
    return queryMYSQL(`
        SELECT IFNULL(c.total, 0) AS total, IFNULL(SUM(rp.importe), 0) AS totalPagado
        FROM recibos r
        LEFT JOIN recibos_pagos rp ON rp.id_recibo_fk = r.id 
        LEFT JOIN recibos_comprobantes rc ON rc.id_recibo_fk = r.id 
        LEFT JOIN comprobantes c ON c.id = rc.id_comprobante_fk 
        WHERE c.id = ?
    `, [idRecibo])
}

exports.getTotalesByIdRecibo = idRecibo => {
    return queryMYSQL(`
       SELECT IFNULL((SELECT SUM(rp.importe) 
                FROM recibos_comprobantes rc
                LEFT JOIN recibos r ON r.id = rc.id_recibo_fk
                LEFT JOIN recibos_pagos rp ON rp.id_recibo_fk = r.id
                WHERE rc.id_comprobante_fk = c.id), 0) AS totalPagado,
            SUM(c.total) AS total
        FROM recibos_comprobantes rc
        LEFT JOIN recibos r ON r.id = rc.id_recibo_fk
        LEFT JOIN comprobantes c ON c.id = rc.id_comprobante_fk 
        WHERE r.id = ?
        GROUP BY c.id
    `, [idRecibo])
}

exports.updateBlindado = (blindado, idRecibo) => {
    return queryMYSQL(`
        UPDATE recibos
        SET blindado = ?
        WHERE id = ?
    `, [blindado, idRecibo])
}



/****************       COMPROBANTES        **********************/ 

exports.getListaComprobantesByIdRecibo = idRecibo => {
	return queryMYSQL(`
        SELECT rc.*, tc.descripcion AS tipoComprobanteTxt, 
               c.fecha_comprobante, 
               cl.razon_social AS clienteTxt,
               LPAD(c.punto_venta,5,'0') AS puntoVentaTxt, LPAD(c.numero,8,'0') AS numeroTxt,
               c.total
        FROM recibos_comprobantes rc 
        LEFT JOIN comprobantes c ON c.id = rc.id_comprobante_fk 
        LEFT JOIN clientes cl ON cl.id = c.id_cliente_fk 
        LEFT JOIN tipos_comprobantes tc ON tc.id = c.id_tipo_comp_fk 
        WHERE rc.id_recibo_fk = ?
    `, [idRecibo])
}

exports.verificoComprobante = id => {
	return queryMYSQL(`
        SELECT *
        FROM recibos r 
        LEFT JOIN recibos_comprobantes rc ON rc.id_recibo_fk = r.id 
        LEFT JOIN recibos_pagos rp ON rp.id_recibo_fk = r.id
        LEFT JOIN comprobantes c ON c.id = rc.id_comprobante_fk 
        WHERE c.id = ?
        HAVING SUM(rp.importe) < c.total
    `, [id])
}

exports.insertComprobante = o => {
	return queryMYSQL(`
        INSERT INTO recibos_comprobantes (id_recibo_fk, id_comprobante_fk, id_usuario_fk)
        VALUES (?,?,?)
    `, [o.idRecibo, o.idComprobante, o.usuario])
}

exports.deleteComprobante = id => {
	return queryMYSQL(`DELETE FROM recibos_comprobantes WHERE id = ?`, [id])
}



/****************       MEDIOS DE PAGOS     **********************/ 

exports.getListaMedioPagoByIdRecibo = idRecibo => {
	return queryMYSQL(`
        SELECT rp.*, mp.descripcion AS medioPagoTxt
        FROM recibos_pagos rp
        LEFT JOIN medios_pagos mp ON mp.id = rp.id_medio_pago_fk
        WHERE id_recibo_fk = ?
    `, [idRecibo])
}

exports.verificoMedioPago = o => {
	return queryMYSQL(`
        SELECT IF(COUNT(*) > 1, 1, 0) AS existe
        FROM recibos_pagos
        WHERE id_recibo_fk = ? AND id_medio_pago_fk = ?
    `, [o.idRecibo, o.idMedioPago])
}

exports.insertMedioPago = o => {
	return queryMYSQL(`
        INSERT INTO recibos_pagos (id_recibo_fk, id_medio_pago_fk, fecha, importe, descripcion, id_usuario_fk)
        VALUES (?,?,?,?,?,?)
    `, [o.idRecibo, o.idMedioPago, o.fecha, o.importe, o.observaciones, o.usuario])
}

exports.deleteMedioPago = id => {
	return queryMYSQL(`DELETE FROM recibos_pagos WHERE id = ?`, [id])
}



/****************       MEDIOS DE PAGOS     **********************/ 

exports.getSaldobyEmpresaAndProveedor = o => {
	return queryMYSQL(`select r.id_cliente_fk, r.id_empresa_fk,
    (select sum(importe) from recibos_pagos rp where rp.id_recibo_fk  = r.id) as importe 
    from  ordenes_pagos r 
    where r.fecha < ? and r.id_empresa_fk = ?  and r.id_cliente_fk = ? `, 
    [o.desde, o.empresa, o.cliente])
}

exports.getListaFechasByempresaAndProveedor = o => {
	return queryMYSQL(`select r.*, cl.razon_social as clientetxt, cl.cuit as cuit, 
        (select sum(importe) from recibos_pagos rp where rp.id_recibo_fk =r.id) as importe
        from ordenes_pagos r 
        LEFT JOIN empresas e ON e.id = r.id_empresa_fk
        left join clientes cl on cl.id = r.id_cliente_fk 
        where r.fecha >= ? and r.fecha <= ? and r.id_empresa_fk = ? and r.id_cliente_fk = ? `, 
    [o.desde, o.hasta, o.empresa, o.cliente])
}



/****************       Cc / Clientes        **********************/ 

// exports.getListaFechasByempresaAndCliente = o => {
// 	return queryMYSQL(`
//         SELECT rc.*, tc.descripcion AS tipoComprobanteTxt, 
//             c.fecha_comprobante, 
//             cl.razon_social AS clienteTxt,
//             LPAD(c.punto_venta,5,'0') AS puntoVentaTxt, LPAD(c.numero,8,'0') AS numeroTxt,
//             c.total
//         FROM recibos_comprobantes rc
//         LEFT JOIN recibos r ON r.id = rc.id_recibo_fk 
//         LEFT JOIN comprobantes c ON c.id = rc.id_comprobante_fk 
//         LEFT JOIN clientes cl ON cl.id = c.id_cliente_fk 
//         LEFT JOIN tipos_comprobantes tc ON tc.id = c.id_tipo_comp_fk 
//         WHERE r.id_empresa_fk = ? AND 
//             r.id_cliente_fk = ? AND 
//             r.fecha_recibo < ?
//     `, [o.empresa, o.cliente, o.desde, o.hasta])
// }

// exports.getListaFechasByempresaAndCliente = o => {
// 	return queryMYSQL(`
//         SELECT rp.*, r.fecha_recibo, r.punto_venta, r.numero
//         FROM recibos_comprobantes rc
//         LEFT JOIN recibos r ON r.id = rc.id_recibo_fk 
//         LEFT JOIN recibos_pagos rp ON rp.id_recibo_fk = r.id
//         LEFT JOIN comprobantes c ON c.id = rc.id_comprobante_fk 
//         LEFT JOIN clientes cl ON cl.id = c.id_cliente_fk  
//         WHERE r.id_empresa_fk = ? AND 
//             r.id_cliente_fk = ? AND 
//             r.fecha_recibo < ?
//         GROUP BY r.id 
//     `, [o.empresa, o.cliente, o.hasta])
// }