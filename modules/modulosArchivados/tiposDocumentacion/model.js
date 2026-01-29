const { queryMYSQL } = require("../../database")


exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT * 
        FROM tipos_documentacion 
        WHERE activo = ?
        ORDER BY descripcion
    `, [a])
}