const { queryMYSQL } = require("../../database")


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
	return queryMYSQL(`
        SELECT e.*
        FROM equipos e
        ORDER BY e.nombre
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT e.*
        FROM equipos e
        WHERE e.activo = 1
        ORDER BY e.nombre
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT e.*
        FROM equipos e 
        WHERE e.id = ?
    `, [id])
}

exports.getByDesc = async desc => {
    return queryMYSQL(`
        select e.*
        FROM equipos e 
        where e.nombre = ?
    `, [desc])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO equipos (nombre) 
        VALUES (?)
    `, [o.nombre])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE equipos 
        SET nombre=?,  activo=? 
        WHERE id=?
    `, [o.nombre, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM equipos 
        WHERE id = ?
    `, [id])
}