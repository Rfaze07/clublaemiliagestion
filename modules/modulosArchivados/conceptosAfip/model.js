const { queryMYSQL } = require("../../database")


exports.getAllActivos = () => {
    return queryMYSQL(`
        SELECT id, descripcion AS concepto 
        FROM conceptos_afip 
        WHERE activo = 1
        ORDER BY id
    `, [])
}