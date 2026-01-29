const { queryMYSQL } = require("../../database")


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
	return queryMYSQL(`
        SELECT j.*, e.nombre as equipo
        FROM jugadores j
        LEFT JOIN equipos e ON j.id_equipo_fk = e.id
        ORDER BY j.nombre
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT j.*, e.nombre as equipo
        FROM jugadores j
        LEFT JOIN equipos e ON j.id_equipo_fk = e.id
        WHERE j.activo = 1
        ORDER BY j.nombre
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT j.*, e.nombre as equipo
        FROM jugadores j
        LEFT JOIN equipos e ON j.id_equipo_fk = e.id
        WHERE j.id = ?
    `, [id])
}

exports.getByDesc = async desc => {
    return queryMYSQL(`
        select j.*, e.nombre as equipo
        FROM jugadores j
        LEFT JOIN equipos e ON j.id_equipo_fk = e.id
        where j.nombre = ?
    `, [desc])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO jugadores (nombre, id_equipo_fk, dorsal) 
        VALUES (?, ?, ?)
    `, [o.nombre, o.id_equipo_fk, o.dorsal])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE jugadores 
        SET nombre=?, id_equipo_fk=?, dorsal=?, activo=? 
        WHERE id=?
    `, [o.nombre, o.id_equipo_fk, o.dorsal, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM jugadores 
        WHERE id = ?
    `, [id])
}