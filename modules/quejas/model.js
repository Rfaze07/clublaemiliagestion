const { queryMYSQL } = require("../../database")


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
    return queryMYSQL(`
        SELECT *
        FROM quejas
        ORDER BY fecha DESC
    `, [])
}

exports.getById = id => {
    return queryMYSQL(`
        SELECT *
        from quejas
        WHERE id = ?
    `, [id])
}
 
exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM quejas 
        WHERE id = ?
    `, [id])
}
exports.update = o => {
    return queryMYSQL(`
        UPDATE quejas 
        SET leida = ?
        WHERE id = ?
    `, [o.leida, o.id])
}