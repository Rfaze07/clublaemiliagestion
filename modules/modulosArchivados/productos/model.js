const { queryMYSQL } = require("../../database")


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}


exports.getAll = () => {
	return queryMYSQL(`
        SELECT p.*, CONCAT(u.desc_corta, ' - ', u.descripcion) AS unidadMedidaTxt 
        FROM productos p 
        LEFT JOIN unmed u ON u.id = p.id_unmed_fk 
        ORDER BY desc_producto
    `, [])
}

exports.getAllbyActivo = (a) => {
	return queryMYSQL(`
        SELECT p.*, CONCAT(u.desc_corta, ' - ', u.descripcion) AS unidadMedidaTxt, al.valor as porcIva
        FROM productos p 
        LEFT JOIN unmed u ON u.id = p.id_unmed_fk 
        LEFT JOIN alicuotas_iva al ON al.id = p.id_alicuota_iva_fk
        WHERE p.activo = ? 
        ORDER BY desc_producto
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT p.* , al.valor as porcIva
        FROM productos p
        LEFT JOIN alicuotas_iva al ON al.id = p.id_alicuota_iva_fk
        WHERE p.id = ?
    `, [id])
}

exports.getByDesc = async desc => {
    return queryMYSQL(`select * from productos c where d.desc_producto = ?`, [desc])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO productos (Cod_Producto,Desc_Producto, id_unmed_fk, id_marca_fk, id_rubro_fk, id_alicuota_iva_fk, costo, porcentaje, activo, stockMinimo) 
        VALUES (?,?,?,?,?,?,?,?,1,?)
    `, [o.codBarras, o.descripcion, o.unidadMedida, o.marca, o.rubro, o.alicuota, o.costo, o.porcentaje, o.stockMinimo])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE productos 
        SET Cod_Producto=?, Desc_Producto=?, id_unmed_fk=?, id_marca_fk=?, id_rubro_fk=?, id_alicuota_iva_fk=?, Costo=?, Porcentaje=?, activo=?, stockMinimo=?
        WHERE id=?
    `, [o.codBarras, o.descripcion, o.unidadMedida, o.marca, o.rubro, o.alicuota, o.costo, o.porcentaje, o.activo, o.stockMinimo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`delete from productos where id = ?`, [id])
}

exports.getAllByUnmed = async id_unmed_fk => {
	return queryMYSQL(`
        SELECT p.*, CONCAT(u.desc_corta, ' - ', u.descripcion) AS unidadMedidaTxt 
        FROM productos p 
        LEFT JOIN unmed u ON u.id = p.id_unmed_fk 
        where  p.id_unmed_fk = ?
        ORDER BY descripcion
    `, [id_unmed_fk])
}

exports.getProductosByIdComprobanteCompra = async idComprobante => {
    return queryMYSQL(`
        SELECT ci.*, p.Desc_Producto, p.Cod_Producto, p.Porcentaje, p.Costo, al.valor as porcIva
        FROM comprobantes_items ci
        LEFT JOIN productos p ON p.id = ci.id_producto_fk
        LEFT JOIN alicuotas_iva al ON al.id = p.id_alicuota_iva_fk
        WHERE ci.id_comprobante_fk = ?
    `, [idComprobante])
}
