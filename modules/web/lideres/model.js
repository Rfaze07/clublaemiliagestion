const { queryMYSQL } = require("../../../database")


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
    return queryMYSQL(`
        SELECT *
        FROM noticias n
        ORDER BY n.fecha DESC, n.id DESC
    `, [])
}

exports.getMayoresGoleadores = () => {
    return queryMYSQL(`
         select j.nombre AS jugador, e.nombre as equipo, SUM(ep.valor) as puntosTotales
        from eventos_partido ep
        left join jugadores j on j.id = ep.id_jugador_fk
        left join equipos e on e.id = j.id_equipo_fk 
        WHERE ep.evento = 'puntos'
        GROUP BY j.id
        ORDER BY puntosTotales DESC
        LIMIT 10`, [])
}

exports.getMayoresAsistidores = () => {
    return queryMYSQL(`
         select j.nombre AS jugador, e.nombre as equipo, SUM(ep.valor) as asistenciasTotales
        from eventos_partido ep
        left join jugadores j on j.id = ep.id_jugador_fk
        left join equipos e on e.id = j.id_equipo_fk
        WHERE ep.evento = 'asistencias'
        GROUP BY j.id
        ORDER BY asistenciasTotales DESC
        LIMIT 10`, [])
}

exports.getMayoresReboteadores = () => {
    return queryMYSQL(`
         select j.nombre AS jugador, e.nombre as equipo, SUM(ep.valor) as rebotesTotales
        from eventos_partido ep
        left join jugadores j on j.id = ep.id_jugador_fk
        left join equipos e on e.id = j.id_equipo_fk
        WHERE ep.evento = 'rebotes'
        GROUP BY j.id
        ORDER BY rebotesTotales DESC
        LIMIT 10`, [])
}

exports.getMayoresPegadores = () => {
    return queryMYSQL(`
            select j.nombre AS jugador, e.nombre as equipo, SUM(ep.valor) as faltasTotales
            from eventos_partido ep
            left join jugadores j on j.id = ep.id_jugador_fk
            left join equipos e on e.id = j.id_equipo_fk
            WHERE ep.evento = 'faltas' or ep.evento = 'falta_tecnica' or ep.evento = 'falta_antideportiva'
            GROUP BY j.id
            ORDER BY faltasTotales DESC
            LIMIT 10`, [])
}
