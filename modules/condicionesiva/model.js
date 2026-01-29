const { queryMYSQL } = require("../../database")

exports.getAllActivos = () => {
	return queryMYSQL(`
        SELECT * 
        FROM condiciones_iva 
        WHERE activo = 1
        ORDER BY codigo_afip
    `, [])
}
