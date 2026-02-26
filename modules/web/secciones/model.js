const { queryMYSQL } = require("../../../database")

exports.getAllActivas = () => {
    return queryMYSQL(`
        SELECT *
        FROM secciones
        WHERE activo = 1
        ORDER BY orden ASC
    `, [])
}

exports.getById = id => {
    return queryMYSQL(`
        SELECT id, titulo, descripcion
        FROM secciones
        WHERE id = ? AND activo = 1
    `, [id])
}

exports.getSubSeccionesBySeccionId = seccionId => {
    return queryMYSQL(`
        SELECT id, titulo, descripcion, orden
        FROM sub_secciones
        WHERE id_seccion_fk = ?
        ORDER BY orden ASC
    `, [seccionId])
}
