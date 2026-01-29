const { queryMYSQL } = require("../../database");

exports.getAll = () => {
	return queryMYSQL(`
        SELECT * 
        FROM ordenes_pagos op
        ORDER BY op.fecha
    `, [])
}

exports.getAllbyActivo = (a) => {
	return queryMYSQL(`
        SELECT * 
        FROM ordenes_pagos op
        where  activo = ?
        ORDER BY op.fecha
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM ordenes_pagos  op
        WHERE op.id = ?
        ORDER BY op.fecha
    `, [id])
}

exports.insert = o => {
    return queryMYSQL(`INSERT INTO ordenes_pagos (id_proveedor_fk, fecha, total, observacion, id_empresa_fk, id_usuario_fk) 
        VALUES (?, ?, ?, ?, ?, ?)`, 
        [o.id_proveedor_fk, o.fecha, o.total, o.observacion, o.id_empresa_fk, o.id_usuario_fk])
}

exports.update = o => {
    console.log('UPDATEO')
    return queryMYSQL(`
        UPDATE ordenes_pagos 
        SET id_proveedor_fk=?, desc_corta = ?, activo=? 
        WHERE id=?
    `, [o.descripcion, o.desc_corta, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`delete from ordenes_pagos where id = ?`, [id])
}

