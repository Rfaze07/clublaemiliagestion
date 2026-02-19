const { queryMYSQL } = require("../../../database")

exports.getAll = () => {
    return queryMYSQL(`
        SELECT id, nombre, descripcion, horarios, profesores, icono
        FROM deportes
        ORDER BY nombre ASC
    `, [])
}
