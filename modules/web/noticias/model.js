const { queryMYSQL } = require("../../../database")


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
    return queryMYSQL(`
        SELECT *
        FROM noticias n
        ORDER BY n.fecha DESC, n.id DESC
    `, [])
}
