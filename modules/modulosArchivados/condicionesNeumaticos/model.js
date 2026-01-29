const { queryMYSQL } = require("../../database")


exports.getAllActivos = () => {
    return queryMYSQL(`
        SELECT *
        FROM condiciones_neumaticos 
        WHERE activo = 1
        ORDER BY id 
    `, [])
}