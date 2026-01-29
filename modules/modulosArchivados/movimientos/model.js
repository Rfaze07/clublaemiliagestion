const { queryMYSQL } = require("../../database")





exports.execQuery = (q, p) => {
    return queryMYSQL(q, p)
}


exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO movimientos (tipo, motivo, fecha, id_usuario_creador_fk) 
        VALUES (?,?,?,?)
    `, [o.tipo, o.motivo, o.fecha, o.id_usuario_creador_fk])
}

exports.delete = id => {
    return queryMYSQL(`DELETE FROM movimientos WHERE id = ?`, [id])
}



exports.blindar = id => {
    return queryMYSQL(`
        UPDATE movimientos SET
        blindado = 1
        WHERE id = ?
    `, [id])
}

exports.desblindar = id => {
    return queryMYSQL(`
        UPDATE movimientos SET
        blindado = 0
        WHERE id = ?
    `, [id])
}

exports.insertarProducto = o => {
    return queryMYSQL(`
        INSERT INTO movimientos_detalle (id_movimiento_fk, id_producto_fk, cantidad) 
        VALUES (?,?,?)
    `, [o.idMovimiento, o.producto, o.cantidad])
}


exports.getMovimientosDetalleByMovimiento = idMovimiento => {
    return queryMYSQL(`
        SELECT md.*, p.descripcion AS descProducto
        FROM movimientos_detalle md
        JOIN productos p ON md.id_producto_fk = p.id
        WHERE md.id_movimiento_fk = ?
    `, [idMovimiento])
}