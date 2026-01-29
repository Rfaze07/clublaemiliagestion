const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT * 
        FROM medicos 
        ORDER BY apellido
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT * 
        FROM medicos 
        WHERE activo = ?
        ORDER BY apellido
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM medicos  
        WHERE id = ?
    `, [id])
}

exports.getByMatriculaExiste = matricula => {
    return queryMYSQL(`
        SELECT IF(COUNT(*) > 0, 1, 0) AS existe
        FROM medicos 
        WHERE matricula = ?
    `, [matricula])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO medicos (matricula, nombre, apellido) 
        VALUES (?,?,?)
    `, [o.matricula, o.nombre, o.apellido])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE medicos 
        SET matricula=?, nombre=?, apellido=?, activo=? 
        WHERE id=?
    `, [o.matricula, o.nombre, o.apellido, o.activo, o.id])
}

exports.getPuedoEliminar = id => {
    return queryMYSQL(`
        SELECT *
        FROM inasistencias
        WHERE id_medico_fk = ?
    `, [id])
}

exports.delete = id => {
    return queryMYSQL(`
        DELETE FROM medicos 
        WHERE id = ?
    `, [id])
}