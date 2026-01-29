const { queryMYSQL } = require("../../database")


exports.getProvincias = async () => {
    return queryMYSQL(`
        SELECT * 
        FROM provincias 
        ORDER BY descripcion
    `)
}

exports.getProvinciaById = async id => {
    return queryMYSQL(`
        SELECT * 
        FROM provincias 
        WHERE id = ?
    `, [id])
}