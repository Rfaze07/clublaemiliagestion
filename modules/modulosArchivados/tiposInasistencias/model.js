const { queryMYSQL } = require("../../database")


exports.getAllbyActivo = () => {
	return queryMYSQL(`
        SELECT * 
        FROM tipos_inasistencias 
        WHERE activo = 1
        ORDER BY descripcion
    `, [])
}