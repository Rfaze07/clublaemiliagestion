const { queryMYSQL } = require("../../../database")

exports.getNoticias = () => {
    return queryMYSQL(`
        SELECT id, titulo, subtitulo, descripcion, imagen_url, fecha
        FROM noticias
        ORDER BY fecha DESC, id DESC
    `, [])
}
