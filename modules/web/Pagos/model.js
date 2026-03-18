const { queryMYSQL } = require('../../../database')

exports.getAll = () => {
    return queryMYSQL(`
        SELECT clave, valor
        FROM parametros
        ORDER BY clave
    `, [])
}