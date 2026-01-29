const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT * 
        FROM enfermedades 
        ORDER BY descripcion
    `, [])
}

exports.getAllbyActivo = (a) => {
	return queryMYSQL(`
        SELECT * 
        FROM enfermedades 
        WHERE activo = ?
        ORDER BY descripcion
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM enfermedades  
        WHERE id = ?
    `, [id])
}

exports.getByDesc = async desc => {
    return queryMYSQL(`
        SELECT * 
        FROM enfermedades 
        WHERE descripcion = ?
    `, [desc])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO enfermedades (descripcion) 
        VALUES (?)
    `, [o.descripcion])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE enfermedades 
        SET descripcion=?, activo=? 
        WHERE id=?
    `, [o.descripcion, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM enfermedades 
        WHERE id = ?
    `, [id])
}