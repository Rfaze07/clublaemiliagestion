const { queryMYSQL } = require("../../database")


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
    return queryMYSQL(`
        SELECT *
        from deportes
        ORDER BY nombre DESC
    `, [])
}

exports.getById = id => {
    return queryMYSQL(`
        SELECT *
        from deportes
        WHERE id = ?
    `, [id])
}


exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO deportes (nombre, descripcion, horarios, profesores, icono) 
        VALUES (?, ?, ?, ?, ?)
    `, [o.nombre, o.descripcion, o.horarios, o.profesores, o.icono || null])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE deportes 
        SET nombre=?, descripcion=?, horarios=?, profesores=?, icono=? 
        WHERE id=?
    `, [o.nombre, o.descripcion, o.horarios, o.profesores, o.icono || null, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM deportes 
        WHERE id = ?
    `, [id])
}