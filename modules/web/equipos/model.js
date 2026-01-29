const { queryMYSQL } = require("../../../database")


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
    return queryMYSQL(`
       SELECT 
            e.*
            from equipos e
            WHERE e.activo = 1
        ORDER BY e.nombre ASC;
    `, [])
}

exports.getJugadoresByEquipo = (id_equipo) => {
    return queryMYSQL(`
       SELECT
            j.*,
            e.nombre AS equipo
        FROM jugadores j
        LEFT JOIN equipos e ON j.id_equipo_fk = e.id
        WHERE j.id_equipo_fk = ? and j.activo = 1
        ORDER BY j.dorsal ASC, j.nombre ASC;
    `, [id_equipo])
}