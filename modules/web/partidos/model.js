const { queryMYSQL } = require("../../../database")


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
    return queryMYSQL(`
       SELECT 
            p.*,
            eA.nombre AS equipoA,
            eB.nombre AS equipoB,
            (
                SELECT COALESCE(SUM(e.valor), 0)
                FROM eventos_partido e
                LEFT JOIN jugadores j ON e.id_jugador_fk = j.id
                WHERE e.id_partido_fk = p.id
                AND e.evento = 'puntos'
                AND j.id_equipo_fk = p.id_equipoA_fk
            ) AS puntosEquipoA,
            (
                SELECT COALESCE(SUM(e.valor), 0)
                FROM eventos_partido e
                LEFT JOIN jugadores j ON e.id_jugador_fk = j.id
                WHERE e.id_partido_fk = p.id
                AND e.evento = 'puntos'
                AND j.id_equipo_fk = p.id_equipoB_fk
            ) AS puntosEquipoB,
            ( SELECT e.periodo
              FROM eventos_partido e
              WHERE e.id_partido_fk = p.id
              ORDER BY e.periodo DESC
              LIMIT 1) as periodoActual
        FROM partidos p	
        LEFT JOIN equipos eA ON p.id_equipoA_fk = eA.id
        LEFT JOIN equipos eB ON p.id_equipoB_fk = eB.id
        ORDER BY p.fecha_hora ASC;
    `, [])
}


exports.getById = (idPartido) => {
    return queryMYSQL(`
        SELECT p.*, eA.nombre as equipoA, eB.nombre as equipoB
        FROM partidos p
        LEFT JOIN equipos eA ON p.id_equipoA_fk = eA.id
        LEFT JOIN equipos eB ON p.id_equipoB_fk = eB.id
        WHERE p.id = ?
    `, [idPartido])
}

exports.getEstadisticasPorPartido = (idPartido) => {
    return queryMYSQL(`
          SELECT 
            j.dorsal,
            j.nombre,
            e.nombre AS equipo,
            SUM(CASE WHEN ep.evento = 'puntos' AND ep.valor = 1 THEN 1 ELSE 0 END) AS TL,
            SUM(CASE WHEN ep.evento = 'puntos' AND ep.valor = 2 THEN 1 ELSE 0 END) AS T2,
            SUM(CASE WHEN ep.evento = 'puntos' AND ep.valor = 3 THEN 1 ELSE 0 END) AS T3,
            SUM(CASE WHEN ep.evento = 'rebotes' THEN 1 ELSE 0 END) AS REB,
            SUM(CASE WHEN ep.evento = 'faltas' THEN 1 ELSE 0 END) AS FAL,
            SUM(CASE WHEN ep.evento = 'asistencias' THEN 1 ELSE 0 END) AS AST,
            SUM(CASE WHEN ep.evento = 'puntos' THEN ep.valor ELSE 0 END) AS PTS,
            e.id AS idEquipo
        FROM partidos p
        INNER JOIN jugadores j 
            ON j.id_equipo_fk IN (p.id_equipoA_fk, p.id_equipoB_fk)
        LEFT JOIN equipos e 
            ON e.id = j.id_equipo_fk
        LEFT JOIN eventos_partido ep 
            ON ep.id_jugador_fk = j.id
            AND ep.id_partido_fk = p.id   -- 👈 filtra eventos del partido pero mantiene jugadores sin eventos
        WHERE p.id = ?   -- 👈 partido seleccionado
        GROUP BY 
            j.dorsal,
            j.nombre,
            e.nombre,
            e.id
        ORDER BY 
            e.nombre,
            j.dorsal,
            j.nombre
    `, [idPartido])
}

exports.getPeriodoActual = (idPartido) => {
    return queryMYSQL(`
        SELECT 
            MAX(ep.periodo) AS periodoActual
        FROM eventos_partido ep
        WHERE ep.id_partido_fk = ?
    `, [idPartido])
}
