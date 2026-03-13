const { queryMYSQL } = require("../../../database")

exports.getNoticias = () => {
    return queryMYSQL(`
        SELECT id, titulo, subtitulo, descripcion, imagen_url, fecha
        FROM noticias
        ORDER BY fecha DESC, id DESC
        LIMIT 5
    `, [])
}

exports.getDeportes = () => {
    return queryMYSQL(`
        SELECT id, nombre, descripcion, horarios, profesores, icono
        FROM deportes
        ORDER BY nombre ASC
    `, [])
}
