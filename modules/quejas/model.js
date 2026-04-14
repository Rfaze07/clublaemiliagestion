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

exports.countUnread = (desde, hasta) => {
    let where = ['leida = 0']
    let params = []

    if (desde) {
        where.push('DATE(fecha) >= ?')
        params.push(desde)
    }

    if (hasta) {
        where.push('DATE(fecha) <= ?')
        params.push(hasta)
    }

    return queryMYSQL(`
        SELECT COUNT(*) AS total
        FROM quejas
        WHERE ${where.join(' AND ')}
    `, params)
}