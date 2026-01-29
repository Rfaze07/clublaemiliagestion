const { queryMYSQL } = require("../../database")


exports.getAllActivos = () => {
    return queryMYSQL(`
        SELECT id, descripcion
        FROM alicuotas_iva 
        WHERE activo = 1
        ORDER BY valor
    `, [])
}

exports.getValorAlicuotaIvaById = id => {
    return queryMYSQL(`
        SELECT valor
        FROM alicuotas_iva 
        WHERE id = ?
    `, [id])
}