const { queryMYSQL } = require("../../database")


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
    return queryMYSQL(`
        SELECT c.*
        FROM categorias c
        ORDER BY c.descripcion
    `, [])
}

exports.getAllbyActivo = a => {
    return queryMYSQL(`
        SELECT c.*
        FROM categorias c
        WHERE c.activo = ?
        ORDER BY c.descripcion
    `, [a])
}

exports.getById = id => {
    return queryMYSQL(`
        SELECT c.*
        FROM categorias c 
        WHERE c.id = ?
    `, [id])
}

exports.getByDesc = async desc => {
    return queryMYSQL(`
        select c.*
        FROM categorias c 
        where c.descripcion = ?
    `, [desc])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO categorias (desc_corta, descripcion) 
        VALUES (?, ?)
    `, [o.desc_corta, o.descripcion])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE categorias 
        SET desc_corta=?, descripcion=?, activo=? 
        WHERE id=?
    `, [o.desc_corta, o.descripcion, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM categorias 
        WHERE id = ?
    `, [id])
}