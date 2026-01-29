const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT s.*, c.cuit, c.razon_social AS clienteTxt 
        FROM sucursales s
        LEFT JOIN clientes c ON c.id = s.id_cliente_fk
        ORDER BY s.descripcion
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT s.*, c.cuit, c.razon_social AS clienteTxt 
        FROM sucursales s
        LEFT JOIN clientes c ON c.id = s.id_cliente_fk
        WHERE s.activo = ?
        ORDER BY s.descripcion
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM sucursales  
        WHERE id = ?
    `, [id])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO sucursales (descripcion, desc_corta, direccion, id_cliente_fk) 
        VALUES (?,?,?,?)
    `, [o.descripcion, o.descCorta, o.direccion, o.cliente])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE sucursales 
        SET descripcion=?, desc_corta=?, direccion=?, id_cliente_fk=?, activo=? 
        WHERE id=?
    `, [o.descripcion, o.descCorta, o.direccion, o.cliente, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM sucursales WHERE id=?
    `, [id])
}