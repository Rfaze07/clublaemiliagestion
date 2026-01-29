const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT * 
        FROM viajes_estados_oc oce
        ORDER BY oce.descripcion
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT * 
        FROM viajes_estados_oc oce
        WHERE oce.activo = ?
        ORDER BY oce.descripcion
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM viajes_estados_oc  
        WHERE id = ?
    `, [id])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO viajes_estados_oc (descripcion, desc_corta, color) 
        VALUES (?,?,?)
    `, [o.descripcion, o.descCorta, o.color])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE viajes_estados_oc 
        SET descripcion=?, desc_corta=?, color=?, activo=? 
        WHERE id=?
    `, [o.descripcion, o.descCorta, o.color, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM viajes_estados_oc WHERE id=?
    `, [id])
}