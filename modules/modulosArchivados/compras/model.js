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
        INSERT INTO comprobantes(id_proveedor_fk, fecha, total, id_empresa_fk)
        VALUES(?, ?, ?, ?)
    `, [o.proveedor, o.fecha, o.total, o.empresa])
}

exports.insertComprobanteItems = (idComprobante, items) => {
    let values = items.map(i => `(${idComprobante}, ${i.id}, ${i.cantidad}, ${i.precio}, ${i.total})`).join(', ')
    return queryMYSQL(`
        INSERT INTO comprobantes_items(id_comprobante_fk, id_producto_fk, cantidad, precio, total)
        VALUES ${values}
    `)
}


exports.getComprobanteById = (id) => {
    return queryMYSQL(`
        SELECT .razon_social as empresaTxt, e.cuit as cuitEmpresa, e.direccion as direccionEmpresa, e.telefono as telefonoEmpresa,  tc.descripcion as tipo_comprobante, c.numero, c.punto_venta, c.fecha, c.total,
    pro.razon_social as proveedorTxt, pro.cuit as cuitProveedor, pro.direccion as direccionProveedor, pro.telefono1 as telefonoProveedor
        FROM comprobantes c
        LEFT JOIN proveedores pro ON pro.id = c.id_proveedor_fk
        LEFT JOIN condiciones_iva ci ON ci.id = pro.id_condicioniva_fk
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

exports.updateCostosProductos = (productos) => {
    //actualizar tambien el iva de los productos
    let cases = productos.map(p => `WHEN id = ${p.id} THEN ${p.precio}`).join(' ')
    let ids = productos.map(p => p.id).join(', ')
    return queryMYSQL(`
        UPDATE productos
        SET Costo = CASE
            ${cases}
        END,
        id_alicuota_iva_fk = CASE
            ${productos.map(p => `WHEN id = ${p.id} THEN ${p.iva}`).join(' ')}
        END
        WHERE id IN (${ids})
    `)
}