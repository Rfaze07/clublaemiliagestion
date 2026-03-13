const { queryMYSQL } = require("../../database")


exports.getAll = () => {
    return queryMYSQL(`
        SELECT *
        FROM parametros
        ORDER BY clave ASC
    `, [])
}

exports.getById = id => {
    return queryMYSQL(`
        SELECT *
        FROM parametros
        WHERE id = ?
    `, [id])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE parametros
        SET valor = ?
        WHERE id = ?
    `, [o.valor, o.id])
}
