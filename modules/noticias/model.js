const { queryMYSQL } = require("../../database")


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
    return queryMYSQL(`
        SELECT *
        from noticias
        ORDER BY fecha DESC
    `, [])
}

exports.getById = id => {
    return queryMYSQL(`
        SELECT *
        from noticias
        WHERE id = ?
    `, [id])
}


exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO noticias (titulo, subtitulo, descripcion, fecha) 
        VALUES (?, ?, ?, NOW())
    `, [o.titulo, o.subtitulo, o.descripcion])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE noticias 
        SET titulo=?, subtitulo=?, descripcion=? 
        WHERE id=?
    `, [o.titulo, o.subtitulo, o.descripcion, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM noticias 
        WHERE id = ?
    `, [id])
}