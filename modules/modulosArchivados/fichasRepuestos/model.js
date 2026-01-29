const { queryMYSQL } = require("../../database")


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
    return queryMYSQL(`
        SELECT rf.id, IFNULL(p.razon_social, '') AS proveedorTxt, r.codigo AS codRepuesto, 
                rf.nro_serie, rf.fecha_compra, rf.neumatico, rf.valor_compra
        FROM repuestos_ficha rf
        LEFT JOIN repuestos r ON r.id = rf.id_repuesto_fk 
        LEFT JOIN proveedores p ON p.id = rf.id_proveedor_fk 
        LEFT JOIN comprobantes c ON c.id = rf.id_comprobante_fk 
        LEFT JOIN condiciones_neumaticos cn ON cn.id = rf.id_condicion_fk 
    `, [])
}

exports.getAllActivos = () => {
    return queryMYSQL(`
        SELECT rf.id, IFNULL(p.razon_social, '') AS proveedorTxt, r.codigo AS codRepuesto, 
                rf.nro_serie, rf.fecha_compra, rf.neumatico, rf.valor_compra
        FROM repuestos_ficha rf
        LEFT JOIN repuestos r ON r.id = rf.id_repuesto_fk 
        LEFT JOIN proveedores p ON p.id = rf.id_proveedor_fk 
        LEFT JOIN comprobantes c ON c.id = rf.id_comprobante_fk 
        LEFT JOIN condiciones_neumaticos cn ON cn.id = rf.id_condicion_fk 
        WHERE rf.fecha_baja IS NULL 
    `, [])
}

exports.getById = id => {
    return queryMYSQL(`
        SELECT rf.*, IFNULL(p.razon_social, '') AS proveedorTxt, r.codigo AS codRepuesto, 
                rf.nro_serie, rf.fecha_compra, rf.neumatico, rf.valor_compra
        FROM repuestos_ficha rf
        LEFT JOIN repuestos r ON r.id = rf.id_repuesto_fk 
        LEFT JOIN proveedores p ON p.id = rf.id_proveedor_fk 
        LEFT JOIN comprobantes c ON c.id = rf.id_comprobante_fk 
        LEFT JOIN condiciones_neumaticos cn ON cn.id = rf.id_condicion_fk 
        WHERE rf.id=?
    `, [id])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO repuestos_ficha (id_repuesto_fk, id_proveedor_fk, nro_serie, chas, fecha_compra, fecha_fabricacion, 
                        fecha_baja, motivo_baja, medida_neumatico, tipo_neumatico, valor_compra, id_condicion_fk,
                        neumatico, modelo, observaciones, id_deposito_fk, id_comprobantedetalle_fk)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `, [o.repuesto, o.proveedor, o.nroSerie, o.nroChas, o.fechaCompra, o.fechaFab, 
        o.fechaBaja, o.motivoBaja, o.medidasNeu, o.tipoNeu, o.importe, o.condicion, 
        o.esNeumatico, o.modelo, o.observaciones, o.deposito, o.idComprobanteDetalle])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE repuestos_ficha 
        SET id_repuesto_fk=?, id_proveedor_fk=?, nro_serie=?, chas=?, fecha_compra=?, fecha_fabricacion=?, 
            fecha_baja=?, motivo_baja=?, medida_neumatico=?, tipo_neumatico=?, valor_compra=?, id_condicion_fk=?,
            neumatico=?, modelo=?, observaciones=?, id_deposito_fk=?
        WHERE id=?
    `, [o.repuesto, o.proveedor, o.nroSerie, o.nroChas, o.fechaCompra, o.fechaFab, 
        o.fechaBaja, o.motivoBaja, o.medidasNeu, o.tipoNeu, o.importe, o.condicion, 
        o.esNeumatico, o.modelo, o.observaciones, o.deposito, o.id])
}

exports.delete = id => {
    return queryMYSQL(`
        DELETE FROM repuestos_ficha 
        WHERE id=?
    `, [id])
}


exports.getFichasRepuestosByIdRepuestoDisp = id => {
    return queryMYSQL(`
        SELECT rf.id, rf.nro_serie
        FROM repuestos_ficha rf
        LEFT JOIN ot_movimientos om ON om.id_repuesto_fk = rf.id_repuesto_fk 
        WHERE om.id_vehiculo_fk IS NULL AND 
            rf.fecha_baja IS NULL AND 
            rf.id_repuesto_fk = ?
    `, [id])
}