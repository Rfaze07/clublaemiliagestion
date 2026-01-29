const { queryMYSQL } = require("../../database")


exports.getAllActivos = () => {
    return queryMYSQL(`
        SELECT id, descripcion AS tipoDoc, codigo_afip AS codigoAfip
        FROM tipos_documentos_afip
        WHERE activo = 1
        ORDER BY descripcion
    `, [])
}