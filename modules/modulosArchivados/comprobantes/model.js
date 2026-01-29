const { queryMYSQL } = require("../../database")



/************** General / Tipo de comprobante **************/

exports.execQuery = (q, p) => {
	return queryMYSQL(q, p)
}

exports.getAllVentasByDesdeCliente = o => {
	return queryMYSQL(`
        SELECT c.id, c.fecha_comprobante, cli.razon_social AS clienteTxt, tc.descripcion AS tipoComprobanteTxt, 
                c.numero AS nroComprobanteTxt, c.total 
        FROM comprobantes c
        LEFT JOIN clientes cli ON cli.id = c.id_cliente_fk
        LEFT JOIN tipos_comprobantes tc ON tc.id = c.id_tipo_comp_fk 
        WHERE c.fecha_comprobante >= ?  and c.id_cliente_fk = ? and c.cae != ""
        order by c.fecha_comprobante
    `, [o.desde, o.cliente])
}



/************** COMPROBANTES DE COMPRAS **************/

exports.getAllTiposCompActivosCompras = () => {
	return queryMYSQL(`
        SELECT *
        FROM tipos_comprobantes 
        WHERE activo_compras = 1
        ORDER BY descripcion
    `, [])
}

exports.getAllByRangoFechas = o => {
	return queryMYSQL(`
        SELECT c.id, c.fecha_comprobante, IF(c.id_proveedor_fk = 0, 'Sin proveedor asignado', p.razon_social) AS proveedorTxt, 
                tc.descripcion AS tipoComprobanteTxt, CONCAT(c.punto_venta, '-', c.numero) AS nroComprobanteTxt, c.total, c.blindado
        FROM comprobantes c
        LEFT JOIN proveedores p ON p.id = c.id_proveedor_fk
        LEFT JOIN tipos_comprobantes tc ON tc.id = c.id_tipo_comp_fk 
        WHERE fecha_comprobante BETWEEN ? AND ? AND id_proveedor_fk >= 0 AND id_cliente_fk = 0
    `, [o.desde, o.hasta])
}

exports.getCompCompraTituloById = id => {
	return queryMYSQL(`
        SELECT c.*, IF(c.id_proveedor_fk = 0, 'Sin proveedor asignado', p.razon_social) AS proveedorTxt, 
            DATE_ADD(c.fecha, INTERVAL 15 DAY) AS vencimiento, CONCAT(c.punto_venta, '-', c.numero) AS nroComprobanteTxt, 
            p.cuit AS provCuit, tc.desc_impresion AS tipoComprobanteTxt, tc.letra,
            IFNULL(( SELECT sum((fi.total * fi.iva)/ 100) FROM comprobantes_items fi WHERE fi.id_comprobante_fk = c.id), 0) AS iva
        FROM comprobantes c
        LEFT JOIN proveedores p ON p.id = c.id_proveedor_fk
        LEFT JOIN empresas e ON e.id = c.id_empresa_fk
        LEFT JOIN tipos_comprobantes tc ON tc.id = c.id_tipo_comp_fk
        WHERE c.id = ?
    `, [id])
}

exports.getComprobanteItemsById = id => {
	return queryMYSQL(`
        SELECT ci.*
        FROM comprobantes_items ci  
        WHERE ci.id_comprobante_fk = ?
    `, [id])
}

exports.getComprobanteItemById = id => {
	return queryMYSQL(`
        SELECT *
        FROM comprobantes_items 
        WHERE id = ?
    `, [id])
}

exports.getComprobanteItemsArticuloById = (idComprobante, idArticulo) => {
	return queryMYSQL(`
        SELECT *
        FROM comprobantes_items 
        WHERE id_comprobante_fk = ? AND id_articulo_fk = ?
    `, [idComprobante, idArticulo])
}

exports.getByDesc = async desc => {
    return queryMYSQL(`select * from comprobantes c where d.descripcion = ?`, [desc])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO comprobantes (id_proveedor_fk, fecha, fecha_comprobante, id_tipo_comp_fk, punto_venta, numero, total,
                                    impuestos_otros, iibb_pba, perc_iva, perc_ganancias, perc_iibb, perc_internos) 
        VALUES (?,NOW(),?,?,?,?,?,?,?,?,?,?,?)
    `, [o.proveedor, o.fecha, o.tipoComprobante, o.ptoVenta, o.nroComprobante, o.total, 
        o.impuestosOtros, o.iibbPba, o.percIva, o.percGanancias, o.percIibb, o.percInternos])
}

exports.insertItem = o => {
    return queryMYSQL(`
        INSERT INTO comprobantes_items (id_comprobante_fk, id_articulo_fk, id_repuesto_fk, 
                        descripcion, costo, precio, total, iva, cantidad, id_tanque_fk) 
        VALUES (?,?,?,?,?,?,?,?,?,?)
    `, [o.idComprobante, o.idArticulo, o.idRepuesto, o.descripcion, 
        o.costo, o.precio, o.total, o.iva, o.cantidad, o.tanque])
}

exports.updatetItem = o => {
    return queryMYSQL(`
        UPDATE comprobantes_items 
        SET id_articulo_fk=?, descripcion=?, costo=?, precio=?, total=?, iva=?, cantidad=? 
        WHERE id=?
    `, [o.idArticulo, o.descripcion, o.costo, o.precio, o.total, o.iva, o.cantidad, o.idComprobante])
}

exports.update = o => {
    console.log('UPDATEO')
    return queryMYSQL(`
        UPDATE comprobantes 
        SET descripcion=?, desc_corta = ?, activo=? 
        WHERE id=?
    `, [o.descripcion, o.desc_corta, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM comprobantes_items 
        WHERE id=?
    `, [id])
}

exports.getComprobantesProveedores = () => {
    return queryMYSQL(`
        SELECT c.id, c.numero, c.total, p.razon_social AS proveedorTxt, tc.descripcion AS tipoComproTxt
        FROM comprobantes c
        LEFT JOIN proveedores p ON p.id = c.id_proveedor_fk 
        LEFT JOIN tipos_comprobantes tc ON tc.id = c.id_tipo_comp_fk 
        WHERE id_proveedor_fk != 0 AND id_cliente_fk = 0 AND c.blindado = 1
    `, [])
}

exports.updateFecha = (fecha, idComprobante) => {
    return queryMYSQL(`
        UPDATE comprobantes
        SET fecha=?
        WHERE id=?
    `, [fecha, idComprobante])
}

exports.updateBlindado = (blindado, idComprobante) => {
    return queryMYSQL(`
        UPDATE comprobantes
        SET blindado = ?
        WHERE id = ?
    `, [blindado, idComprobante])
}





/************** CC  Proveedores **************/

exports.getSaldobyEmpresaAndProveedor = o => {
	return queryMYSQL(`SELECT c.id_empresa_fk, c.id_proveedor_fk, 
        sum((SELECT sum(fi.total*((fi.iva+100)/100))  from comprobantes_items fi where fi.id_comprobante_fk = c.id)) as importe,
        DATE_ADD(c.fecha, INTERVAL 15 DAY) as vencimiento,
        ifNULL(( select sum(fi.total) from comprobantes_items fi where fi.id_comprobante_fk = c.id),0) as neto,
               ifNULL(( select sum((fi.total*fi.iva)/100) from comprobantes_items fi where fi.id_comprobante_fk = c.id),0) as iva,
               ifNULL(( select sum(fi.total*((fi.iva+100)/100)) from comprobantes_items fi where fi.id_comprobante_fk = c.id),0) as total,
    LPAD(c.puerto, 5, '0') as puntof, LPAD(c.numero, 5, '0') as numf
    FROM comprobantes c
    where c.fecha < ? and c.id_empresa_fk = ? and c.id_proveedor_fk = ?`, 
    [o.desde, o.empresa, o.proveedor])
}

exports.getListaFechasByempresaAndProveedor = o => {
	return queryMYSQL(`SELECT f.*, p.razon_social AS proveedortxt, p.cuit AS cuit, tc.descripcion AS desctipo, f.total as importe
        FROM comprobantes f
        LEFT JOIN proveedores p ON p.id = f.id_proveedor_fk
        LEFT JOIN empresas e ON e.id = f.id_empresa_fk
        LEFT JOIN tipos_comprobantes tc ON tc.id = f.id_tipo_comp_fk
        where f.id_empresa_fk = ? and f.id_proveedor_fk = ? and  f.fecha >= ? and f.fecha <= ?
        order by f.fecha 
    `, [o.empresa, o.proveedor,  o.desde, o.hasta]);
}





/************** COMPROBANTES DE VENTAS **************/

exports.getAllTiposCompActivosVentas = () => {
	return queryMYSQL(`
        SELECT *
        FROM tipos_comprobantes 
        WHERE activo_ventas = 1
    `, [])
}

exports.insertCompVentasTitulo = o => {
    return queryMYSQL(`
        INSERT INTO comprobantes (id_cliente_fk, id_proyectotitulo_fk, id_empresa_fk, id_puntoventa_fk, punto_venta, fecha, 
                                  fecha_comprobante, id_tipo_comp_fk, tipo_comp, letra, id_conceptoafip_fk, 
                                  fecha_serv_desde, fecha_serv_hasta, fecha_serv_venc_pago) 
        VALUES (?,?,?,?,?,NOW(),?,?,?,?,?,?,?,?)
    `, [o.cliente, o.proyecto, o.empresa, o.idPuntoVenta, o.puntoVenta, o.fechaComp, o.tipoComprobante, o.tipoComprobanteTxt, 
        o.letra, o.concepto, o.fechaDesde, o.fechaHasta, o.fechaVtoPago])
}

exports.getCompVentaTituloById = id => {
	return queryMYSQL(`
        SELECT c.*, cl.razon_social AS clienteTxt, cl.nro_documento, tc.desc_impresion AS impresion, tc.letra, 
               tc.codigo_afip AS tipoComprobante, tda.descripcion AS tipoDocAfip, tda.codigo_afip AS codigoAfip, 
               e.razon_social AS empresaTxt, ci.codigo_afip as ivaReceptor
        FROM comprobantes c 
        LEFT JOIN clientes cl ON cl.id = c.id_cliente_fk
        LEFT JOIN condiciones_iva ci on ci.id = cl.id_condicioniva_fk
        LEFT JOIN empresas e ON e.id = c.id_empresa_fk 
        LEFT JOIN tipos_documentos_afip tda ON tda.id = cl.id_tipodoc_fk
        LEFT JOIN tipos_comprobantes tc ON tc.id = c.id_tipo_comp_fk
        WHERE c.id = ?
    `, [id])
}

exports.getComprobanteItemsArticuloById = (idComprobante, idArticulo) => {
	return queryMYSQL(`
        SELECT *
        FROM comprobantes_items 
        WHERE id_comprobante_fk = ? AND id_articulo_fk = ?
    `, [idComprobante, idArticulo])
}

exports.getItemComprobanteVentaById = id => {
    return queryMYSQL(`
        SELECT * 
        FROM comprobantes_items 
        WHERE id = ?
    `, [id])
}

exports.getComprobanteVentasItemsById = id => {
	return queryMYSQL(`
        SELECT ci.*, u.desc_corta AS uniMedTxt
        FROM comprobantes_items ci 
        LEFT JOIN unmed u ON u.id = ci.id_umed_fk 
        WHERE ci.id_comprobante_fk = ?
    `, [id])
}

exports.getTotalComprobanteVentasItemsById = id => {
	return queryMYSQL(`
        SELECT SUM(ci.precio*((ci.iva/100)+1)*ci.cantidad) AS total,
               SUM(ci.precio*ci.cantidad) AS totalNeto
        FROM comprobantes_items ci  
        WHERE ci.id_comprobante_fk = ?
    `, [id])
}

exports.getTotalIvaComprobanteVentasItemsById = id => {
	return queryMYSQL(`
        SELECT iva, SUM(IF(id_articulo_fk > 0, (cantidad * precio * (iva/100)), 0) ) AS total
        FROM comprobantes_items ci 
        WHERE ci.iva > 0 AND ci.id_comprobante_fk = ?
        GROUP BY iva 
    `, [id])
}

exports.getTotalesComprobanteVentasItemsById = id => {
	return queryMYSQL(`
        SELECT IFNULL(SUM(ci.precio*((ci.iva/100)+1)*ci.cantidad), 0) AS total,
               IFNULL(SUM(ci.precio*ci.cantidad), 0) AS totalNeto,
               IFNULL((SELECT SUM((cantidad*precio)) FROM comprobantes_items ci2 WHERE ci2.iva = '0' AND ci2.id_comprobante_fk = ?), 0) AS totalIva0,
               IFNULL((SELECT SUM((cantidad*precio*(iva/100))) FROM comprobantes_items ci2 WHERE ci2.iva = '10.5' AND ci2.id_comprobante_fk = ?), 0) AS totalIva105,
               IFNULL((SELECT SUM((cantidad*precio*(iva/100))) FROM comprobantes_items ci2 WHERE ci2.iva = '21' AND ci2.id_comprobante_fk = ?), 0) AS totalIva21,
               IFNULL((SELECT SUM((cantidad*precio)) FROM comprobantes_items ci2 WHERE ci2.iva = '10.5' AND ci2.id_comprobante_fk = ?), 0) AS totalNetoIva105,
               IFNULL((SELECT SUM((cantidad*precio)) FROM comprobantes_items ci2 WHERE ci2.iva = '21' AND ci2.id_comprobante_fk = ?), 0) AS totalNetoIva21
        FROM comprobantes_items ci  
        WHERE ci.id_comprobante_fk = ?
    `, [id,id,id,id,id,id])
}

exports.insertItemVenta = o => {
    return queryMYSQL(`
        INSERT INTO comprobantes_items (id_comprobante_fk, id_articulo_fk, id_tarea_fk, id_tarea_presupuesto_fk, 
                                    id_umed_fk, descripcion, precio, total, iva, cantidad, dto, es_adicional)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `, [o.id_comprobante_fk, o.id_articulo_fk, o.id_tarea_fk, o.id_tarea_presupuesto_fk, o.id_umed_fk, o.descripcion, 
        o.precio, o.total, o.iva, o.cantidad, o.dto, o.esAdicional])

}

exports.getTareasProyectoFact = id => {
	return queryMYSQL(`
        SELECT pd.id, pd.cantidad, pd.id_tarea_fk, pd.tarea, pd.precio, IFNULL(SUM(ci.cantidad), 0) AS cantFacturado
        FROM proyectos_detalles pd
        LEFT JOIN comprobantes_items ci ON ci.id_tarea_presupuesto_fk = pd.id AND ci.es_adicional = 0
        WHERE pd.id_proyectotitulo_fk = ? 
        GROUP BY pd.id
        -- HAVING cantFacturado < cantidad
    `, [id])
}

exports.getTareaComprobanteItemsById = (idComprobante, idTarea) => {
	return queryMYSQL(`
        SELECT * 
        FROM comprobantes_items 
        WHERE id_comprobante_fk = ? AND id_tarea_fk = ?
    `, [idComprobante, idTarea])
}

exports.getTareaProyectoByIdFact = id => {
	return queryMYSQL(`
        SELECT pd.id , pd.cantidad, pd.tarea, pd.precio, IFNULL(SUM(ci.cantidad), 0) AS cantFacturado
        FROM proyectos_detalles pd
        LEFT JOIN comprobantes_items ci ON ci.id_tarea_presupuesto_fk = pd.id AND ci.es_adicional = 0
        WHERE pd.id = ?
    `, [id])
}

exports.deleteItem = id => {
	return queryMYSQL(`
        DELETE FROM comprobantes_items 
        WHERE id = ?
    `, [id])
}

exports.getAllVentasByRangoFechas = o => {
	return queryMYSQL(`
        SELECT c.id, e.cuit AS cuitEmpresa, e.razon_social AS empresaTxt, c.fecha_comprobante, 
               cl.razon_social AS clienteTxt, cae, tc.descripcion AS tipoComprobanteTxt, 
               c.numero AS nroComprobanteTxt, IFNULL(SUM(ci.total), 0) AS total
        FROM comprobantes c
        LEFT JOIN comprobantes_items ci ON ci.id_comprobante_fk = c.id 
        LEFT JOIN clientes cl ON cl.id = c.id_cliente_fk
        LEFT JOIN empresas e ON e.id = c.id_empresa_fk
        LEFT JOIN tipos_comprobantes tc ON tc.id = c.id_tipo_comp_fk 
        WHERE fecha_comprobante BETWEEN ? AND ? AND 
              c.id_proveedor_fk = 0 AND 
              c.id_cliente_fk != 0 
              ${o.empresa != 't' ? 'AND e.id = ?' : ''}
        GROUP BY c.id
    `, [o.desde, o.hasta, o.empresa])
}

// exports.updatePostAfip = o => {
// 	return queryMYSQL(`
//          update comprobantes set
//         puerto = ?,
//         numero = ?, 
//         cae = ?, 
//         cae_vence = ?,
//         iva0 = ?,
//         iva27 = ?,
//         iva21 = ?,
//         iva1 = ?,
//         neto0 = ?,
//         neto0 = ?
//         where id = ?
//     `, [o.cae, o.fechacae, o.punto_venta,  o.nro_compro, o.ImpTotal, o.ImpTotConc, o.ImpNeto, o.ImpOpEx, o.ImpIVA, o.ImpTrib, o.id ])
// }
exports.updatePostAfip = (cae, caeFecha, ptoVenta, nroFactura, idComprobante) => {
	return queryMYSQL(`
        UPDATE comprobantes 
        SET cae=?, cae_vence=?, puerto=?, numero=? 
        WHERE id=?
    `, [cae, caeFecha, ptoVenta, nroFactura, idComprobante])
}

// exports.getComprobantesByCliente = idCliente => {
//     return queryMYSQL(`
//         SELECT c.id, c.punto_venta, LPAD(c.punto_venta,5,'0') AS puntoVentaTxt, LPAD(c.numero,8,'0') AS numeroTxt, 
// 	           c.total, cl.razon_social AS clienteTxt, c.tipo_comp AS tipoComproTxt
//         FROM comprobantes c
//         LEFT JOIN clientes cl ON cl.id = c.id_cliente_fk 
//         LEFT JOIN tipos_comprobantes tc ON tc.id = c.id_tipo_comp_fk 
//         WHERE id_cliente_fk = ? AND c.cae > 0
//         ORDER BY c.id DESC  
//     `, [idCliente])
// }
exports.getComprobantesByCliente = (idCliente, idEmpresa) => {
    return queryMYSQL(`
        SELECT co.id, co.tipo_comp AS tipoComproTxt, 
            LPAD(co.punto_venta,5,'0') AS puntoVentaTxt, 
            LPAD(co.numero,8,'0') AS numeroTxt,
            IFNULL((SELECT SUM(rp.importe) 
                FROM recibos_comprobantes rc
                LEFT JOIN recibos r ON r.id = rc.id_recibo_fk
                LEFT JOIN recibos_pagos rp ON rp.id_recibo_fk = r.id
                WHERE rc.id_comprobante_fk = co.id), 0) AS totalPagado,
            co.total
        FROM comprobantes co
        WHERE co.id_cliente_fk = ? AND 
            co.id_empresa_fk = ? AND 
            (co.total - COALESCE((SELECT SUM(c.total) FROM comprobantes c WHERE c.id = co.id AND c.cae_vence IS NOT NULL), 0) >= 0)
    `, [idCliente, idEmpresa])
}

exports.getCompVentaTituloDatosById = idComprobante => {
    return queryMYSQL(`
        SELECT IFNULL((SELECT SUM(rp.importe) 
                FROM recibos_comprobantes rc
                LEFT JOIN recibos r ON r.id = rc.id_recibo_fk
                LEFT JOIN recibos_pagos rp ON rp.id_recibo_fk = r.id
                WHERE rc.id_comprobante_fk = co.id), 0) AS totalPagado,
            co.total
        FROM comprobantes co
        WHERE co.id = ? AND 
            (co.total - COALESCE((SELECT SUM(c.total) FROM comprobantes c WHERE c.id = co.id AND c.cae_vence IS NOT NULL), 0) >= 0)
    `, [idComprobante])
}

exports.updateComprobanteVentasById = (o, idComprobante) => {
	return queryMYSQL(`
        UPDATE comprobantes 
        SET total=?, neto=?, iva0=?, neto0=?, iva105=?, neto105=?, iva21=?, neto21=? 
        WHERE id=?
    `, [o.total, o.totalNeto, o.totalIva0, o.totalIva0, o.totalIva105, o.totalNetoIva105, o.totalIva21, o.totalNetoIva21, idComprobante])
}

exports.updateAsignarNumero = id_comprobante => {
    return queryMYSQL(`
        UPDATE comprobantes
        SET numero = (
                SELECT IFNULL(MAX(numero), 0) + 1
                FROM comprobantes
                WHERE id_punto_venta_fk = (
                    SELECT id_punto_venta_fk 
                    FROM comprobantes 
                    WHERE id = ?
                ) AND 
            id_empresa_fk = ( 
                SELECT id_empresa_fk 
                FROM comprobantes 
                WHERE id = ?
            )
        )
        WHERE id = ?
    `, [id_comprobante, id_comprobante, id_comprobante])
}

exports.updateResultArca = (cae, caeFecha, caeObs, nroFactura, idComprobante) => {
	return queryMYSQL(`
        UPDATE comprobantes 
        SET cae=?, cae_vence=?, cae_obs=?, numero=?, blindado=1 
        WHERE id=?
    `, [cae, caeFecha, caeObs, nroFactura, idComprobante])
}

exports.getCompVentaEmpresaById = idComprobante => {
	return queryMYSQL(`
        SELECT e.razon_social AS empresaTxt, e.cuit, ci.descripcion AS condicionIvaTxt, e.direccion, 
               e.email, e.fecha_inicio, e.telefono, e.imagen, l.descripcion AS localidadTxt, 
               l.cp, p.descripcion AS provinciaTxt
        FROM comprobantes c 
        LEFT JOIN empresas e ON e.id = c.id_empresa_fk 
        LEFT JOIN condiciones_iva ci ON ci.id = e.id_iva_fk 
        LEFT JOIN localidades l ON l.id = e.id_localidad_fk 
        LEFT JOIN provincias p ON p.id = l.id_provincia_fk
        WHERE c.id = ?
    `, [idComprobante])
}

exports.getCompVentaClienteById = idComprobante => {
	return queryMYSQL(`
        SELECT cl.razon_social AS clienteTxt, tda.descripcion AS tipoDocTxt, cl.nro_documento, 
               ci.descripcion AS condicionIvaTxt, cl.direccion, l.descripcion AS localidadTxt, 
               l.cp, p.descripcion AS provinciaTxt
        FROM comprobantes c
        LEFT JOIN clientes cl ON cl.id = c.id_cliente_fk 
        LEFT JOIN tipos_documentos_afip tda ON tda.id = cl.id_tipodoc_fk 
        LEFT JOIN condiciones_iva ci ON ci.id = cl.id_condicioniva_fk 
        LEFT JOIN localidades l ON l.id = cl.id_localidad_fk 
        LEFT JOIN provincias p ON p.id = l.id_provincia_fk 
        WHERE c.id = ?
    `, [idComprobante])
}

exports.exectQuery = (q, p) => {
    return queryMYSQL(q, p)
}

exports.getCondicionIvaByCliente = id => {
    return queryMYSQL(`
        SELECT ci.*
        FROM condiciones_iva ci 
        LEFT JOIN clientes c ON c.id_condicioniva_fk = ci.id 
        WHERE c.id = ?
    `, [id])
}

exports.getComprobantesByEmpresa = id => {
    return queryMYSQL(`
        SELECT pv.id, pv.punto_venta, pv.domicilio, tc.letra, 
                tc.descripcion AS tipoCompTxt, tc.codigo_afip AS tipoCompCodAfip
        FROM puntos_venta pv
        WHERE pv.id_empresa_fk = ?
        ORDER BY tc.id
    `, [id])
}

exports.getUltInternoByEmpresaTiCompPtoVenta = o => {
    return queryMYSQL(`
        SELECT IFNULL(c.numero, 0) AS ultimo
        FROM comprobantes c 
        WHERE c.id_empresa_fk = ? AND 
              c.id_tipo_comp_fk = ? AND 
              c.id_puntoventa_fk = ?
    `, [o.id_empresa_fk, o.id_tipo_comp_fk, o.id_puntoventa_fk])
}

exports.updateInterno = (numero, o) => {
    const texto = `${o.letra} - ${o.tipo_comp}`
    return queryMYSQL(`
        UPDATE comprobantes
        SET numero=?, cae=?, cae_vence=?, cae_resultado=?, cae_obs=?, blindado=1
        WHERE id=?
    `, [numero, texto, texto, texto, texto, o.id])
}








/************** CC  CLIENTES **************/

exports.getSaldobyEmpresaAndCliente = o => {
	return queryMYSQL(`
        SELECT c.id_empresa_fk, c.id_cliente_fk, 
            SUM((SELECT SUM(fi.total *((fi.iva + 100)/ 100)) FROM comprobantes_items fi WHERE fi.id_comprobante_fk = c.id)) AS importe, 
            DATE_ADD(c.fecha, INTERVAL 15 DAY) AS vencimiento, 
            IFNULL(( SELECT SUM(fi.total) FROM comprobantes_items fi WHERE fi.id_comprobante_fk = c.id), 0) AS neto, 
            IFNULL(( SELECT SUM((fi.total * fi.iva)/ 100) FROM comprobantes_items fi WHERE fi.id_comprobante_fk = c.id), 0) AS iva, 
            IFNULL(( SELECT SUM(fi.total * ((fi.iva + 100)/ 100)) FROM comprobantes_items fi WHERE fi.id_comprobante_fk = c.id), 0) AS total, 
            LPAD(c.punto_venta, 5, '0') AS puntoVentaTxt, 
            LPAD(c.numero, 8, '0') AS numeroTxt
        FROM comprobantes c 
        WHERE c.fecha < ? AND 
              c.id_empresa_fk = ? AND 
              c.id_cliente_fk = ?
    `, [o.desde, o.empresa, o.cliente])
}

exports.getListaFechasByempresaAndCliente = o => {
	return queryMYSQL(`
        SELECT c.*, cl.razon_social AS clientetxt, cl.nro_documento AS cuit, tc.descripcion AS desctipo
        FROM comprobantes c
        LEFT JOIN clientes cl ON cl.id = c.id_cliente_fk
        LEFT JOIN empresas e ON e.id = c.id_empresa_fk
        LEFT JOIN tipos_comprobantes tc ON tc.id = c.id_tipo_comp_fk
        WHERE c.id_empresa_fk = ? AND 
              c.id_cliente_fk = ? AND 
              c.fecha < ?
        ORDER BY c.fecha 
    `, [o.empresa, o.cliente, o.hasta])
}