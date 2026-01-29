const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT * 
        FROM imputaciones i
        ORDER BY i.descripcion 
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT * 
        FROM imputaciones i
        WHERE activo = ? 
        ORDER BY i.descripcion 
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM imputaciones 
        WHERE id = ?
    `, [id])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO imputaciones (descripcion, desc_corta) 
        VALUES (?,?)
    `, [o.descripcion, o.desc_corta])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE imputaciones 
        SET descripcion=?, desc_corta=?, activo=? 
        WHERE id=?
    `, [o.descripcion, o.desc_corta, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM imputaciones 
        WHERE id = ?
    `, [id])
}