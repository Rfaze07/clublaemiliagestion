const { queryMYSQL } = require("../../database")


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
	return queryMYSQL(`
        SELECT r.*
        FROM rubros r
        ORDER BY r.descripcion
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT r.*
        FROM rubros r
        WHERE r.activo = 1
        ORDER BY r.descripcion
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT r.*
        FROM rubros r 
        WHERE r.id = ?
    `, [id])
}

exports.getByDesc = async desc => {
    return queryMYSQL(`
        select r.*
        FROM rubros r 
        where r.descripcion = ?
    `, [desc])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO rubros (descripcion, desc_corta) 
        VALUES (?,?)
    `, [o.descripcion, o.desc_corta])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE rubros 
        SET descripcion=?, desc_corta=?, activo=? 
        WHERE id=?
    `, [o.descripcion, o.desc_corta, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM rubros 
        WHERE id = ?
    `, [id])
}