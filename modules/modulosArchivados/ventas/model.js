const { queryMYSQL } = require("../../database");


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
    return queryMYSQL(`
        SELECT c.*, ci.descripcion AS descCondIvaTxt
        FROM clientes c
        LEFT JOIN condiciones_iva ci ON ci.id = c.id_condicioniva_fk
        ORDER BY c.activo DESC, c.razon_social
    `, [])
}

exports.insertComprobante = (o) => {
    return queryMYSQL(`
        INSERT INTO comprobantes(id_cliente_fk, fecha, total, numero, id_empresa_fk, id_puntoventa_fk, id_tipo_comp_fk, punto_venta)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)
    `, [o.cliente, o.fecha, o.total, o.numero, o.empresa, o.id_puntoventa_fk, o.tipoComprobante, o.puntoVenta])
}

exports.insertComprobanteItems = (idComprobante, items) => {
    let values = items.map(i => `(${idComprobante}, ${i.id}, ${i.cantidad}, ${i.precio}, ${i.total})`).join(', ')
    return queryMYSQL(`
        INSERT INTO comprobantes_items(id_comprobante_fk, id_producto_fk, cantidad, precio, total)
        VALUES ${values}
    `)
}


exports.getUltimoNumero = (idEmpresa, idPuntoVenta, idTipoComprobante) => {
    return queryMYSQL(`
        SELECT MAX(numero) AS ultimoNumero
        FROM comprobantes
        WHERE id_empresa_fk = ? AND id_puntoventa_fk = ? AND id_tipo_comp_fk = ?
    `, [idEmpresa, idPuntoVenta, idTipoComprobante])
}


exports.getComprobanteById = (id) => {
    return queryMYSQL(`
        SELECT e.razon_social as empresaTxt, e.cuit as cuitEmpresa, e.direccion as direccionEmpresa, e.telefono as telefonoEmpresa,  tc.descripcion as tipo_comprobante, c.numero, c.punto_venta, c.fecha, c.total,
	cli.razon_social as clienteTxt, cli.cuit as cuitCliente, cli.direccion as direccionCliente, cli.telefono1 as telefonoCliente 
        FROM comprobantes c
        LEFT JOIN clientes cli ON cli.id = c.id_cliente_fk
        LEFT JOIN condiciones_iva ci ON ci.id = cli.id_condicioniva_fk
        LEFT JOIN empresas e ON e.id = c.id_empresa_fk
        left join tipos_comprobantes tc on c.id_tipo_comp_fk = tc.id
        where c.id = ?
    `, [id])
}
exports.getComprobanteItemsByIdComprobante = (idComprobante) => {
    return queryMYSQL(`
        SELECT ci.*, p.Cod_Producto, p.Desc_Producto, u.desc_corta AS unidad
        FROM comprobantes_items ci
        LEFT JOIN productos p ON p.id = ci.id_producto_fk
        LEFT JOIN unmed u ON u.id = p.id_unmed_fk
        WHERE ci.id_comprobante_fk = ?
    `, [idComprobante])
}