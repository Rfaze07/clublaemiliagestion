const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT * 
        FROM ordenes_cargas_estados oce
        ORDER BY oce.descripcion
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT * 
        FROM ordenes_cargas_estados oce
        WHERE oce.activo = ?
        ORDER BY oce.descripcion
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM ordenes_cargas_estados  
        WHERE id = ?
    `, [id])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO ordenes_cargas_estados (descripcion, desc_corta) 
        VALUES (?,?)
    `, [o.descripcion, o.descCorta])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE ordenes_cargas_estados 
        SET descripcion=?, desc_corta=?, activo=? 
        WHERE id=?
    `, [o.descripcion, o.descCorta, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM ordenes_cargas_estados WHERE id=?
    `, [id])
}