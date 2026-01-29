const { queryMYSQL } = require("../../database");


/****************************************
        ORDENES PAGOS TITULO
****************************************/ 

exports.getAllByRangoFechas = o => {
	return queryMYSQL(`
        SELECT op.*, p.razon_social AS proveedorTxt
        FROM ordenes_pagos op
        LEFT JOIN proveedores p ON p.id = op.id_proveedor_fk 
        WHERE op.fecha BETWEEN ? AND ?
    `, [o.desde, o.hasta])
}

exports.insert = o => {
	return queryMYSQL(`
        INSERT INTO ordenes_pagos (id_proveedor_fk, fecha, observacion)
        VALUES (?,?,?)
    `, [o.proveedor, o.fecha, o.observaciones])
}

exports.getOrdenPagoTituloById = id => {
	return queryMYSQL(`
        SELECT op.*, p.razon_social AS proveedorTxt, p.cuit, 
                ci.descripcion AS condicionIVATxt, p.direccion, s.usuario 
        FROM ordenes_pagos op
        LEFT JOIN proveedores p ON p.id = op.id_proveedor_fk 
        LEFT JOIN condiciones_iva ci ON ci.id = p.id_condicioniva_fk
        LEFT JOIN secr s ON s.unica = op.id_usuario_fk 
        WHERE op.id = ?
    `, [id])
}

exports.updateImpresoByIdOrdenPago = id => {
	return queryMYSQL(`
        UPDATE ordenes_pagos 
        SET impreso = 1, fecha_impresion = NOW()
        WHERE id = ?
    `, [id])
}




/****************************************
        ORDENES PAGOS DETALLES
****************************************/ 

exports.getTotalesByIdOrdenPago = idOrdenPago => {
    return queryMYSQL(`
        SELECT c.total, IFNULL(SUM(opp.importe), 0) AS totalPagado
        FROM ordenes_pagos op
        LEFT JOIN ordenes_pagos_pagos opp ON opp.id_orden_pago_fk = op.id 
        LEFT JOIN ordenes_pago_comprobantes opc ON opc.id_orden_pago_fk = op.id 
        LEFT JOIN comprobantes c ON c.id = opc.id_comprobante_fk 
        WHERE op.id = ? 
    `, [idOrdenPago])
}

exports.updateBlindado = (blindado, idOrdenPago) => {
    return queryMYSQL(`
        UPDATE ordenes_pagos
        SET blindado = ?
        WHERE id = ?
    `, [blindado, idOrdenPago])
}




/****************************************
            COMPROBANTES
****************************************/ 

exports.getListaComprobantesByIdOrdenPago = idOrdenPago => {
	return queryMYSQL(`
        SELECT opc.*, tc.descripcion AS tipoComprobanteTxt, c.fecha_real, p.razon_social AS proveedorTxt, c.numero, c.total
        FROM ordenes_pago_comprobantes opc 
        LEFT JOIN comprobantes c ON c.id = opc.id_comprobante_fk 
        LEFT JOIN proveedores p ON p.id = c.id_proveedor_fk 
        LEFT JOIN tipos_comprobantes tc ON tc.id = c.id_tipo_comp_fk 
        WHERE id_orden_pago_fk = ?
    `, [idOrdenPago])
}

exports.verificoComprobante = id => {
	return queryMYSQL(`
        SELECT IF(COUNT(*) > 0, 1, 0) AS existe
        FROM ordenes_pago_comprobantes 
        WHERE id_comprobante_fk = ?
    `, [id])
}

exports.insertComprobante = o => {
	return queryMYSQL(`
        INSERT INTO ordenes_pago_comprobantes (id_orden_pago_fk, id_comprobante_fk, id_usuario_fk)
        VALUES (?,?,?)
    `, [o.idOrdenPago, o.idComprobante, o.usuario])
}

exports.deleteComprobante = id => {
	return queryMYSQL(`DELETE FROM ordenes_pago_comprobantes WHERE id = ?`, [id])
}




/****************************************
            MEDIOS DE PAGOS
****************************************/ 

exports.getListaMedioPagoByIdOrdenPago = idOrdenPago => {
	return queryMYSQL(`
        SELECT opp.*, mp.descripcion AS medioPagoTxt
        FROM ordenes_pagos_pagos opp
        LEFT JOIN medios_pagos mp ON mp.id = opp.id_medio_pago_fk
        WHERE id_orden_pago_fk = ?
    `, [idOrdenPago])
}

exports.verificoMedioPago = o => {
	return queryMYSQL(`
        SELECT IF(COUNT(*) > 1, 1, 0) AS existe
        FROM ordenes_pagos_pagos
        WHERE id_orden_pago_fk = ? AND id_medio_pago_fk = ?
    `, [o.idOrdenPago, o.idMedioPago])
}

exports.insertMedioPago = o => {
	return queryMYSQL(`
        INSERT INTO ordenes_pagos_pagos (id_orden_pago_fk, id_medio_pago_fk, fecha, importe, descripcion, id_usuario_fk)
        VALUES (?,?,?,?,?,?)
    `, [o.idOrdenPago, o.idMedioPago, o.fecha, o.importe, o.observaciones, o.usuario])
}

exports.deleteMedioPago = id => {
	return queryMYSQL(`DELETE FROM ordenes_pagos_pagos WHERE id = ?`, [id])
}


/****************************************
            MEDIOS DE PAGOS
****************************************/ 
exports.getSaldobyEmpresaAndProveedor = o => {
	return queryMYSQL(`select op.id_proveedor_fk, op.id_empresa_fk,
    (select sum(importe) from ordenes_pagos_pagos opp where opp.id_orden_pago_fk  = op.id) as importe 
    from  ordenes_pagos op 
    where op.fecha < ? and op.id_empresa_fk = ?  and op.id_proveedor_fk = ? `, 
    [o.desde, o.empresa, o.proveedor])
}

exports.getListaFechasByempresaAndProveedor = o => {
	return queryMYSQL(`select op.*, p.razon_social as proveedortxt, p.cuit as cuit, 
        (select sum(importe) from ordenes_pagos_pagos opp where opp.id_orden_pago_fk =op.id) as importe
        from ordenes_pagos op 
        LEFT JOIN empresas e ON e.id = op.id_empresa_fk
        left join proveedores p on p.id = op.id_proveedor_fk 
        where op.fecha >= ? and op.fecha <= ? and op.id_empresa_fk = ? and op.id_proveedor_fk = ? `, 
    [o.desde, o.hasta, o.empresa, o.proveedor])
}
