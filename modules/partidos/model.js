const { queryMYSQL } = require("../../database")


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
	return queryMYSQL(`
        SELECT p.*, eA.nombre as equipoA, eB.nombre as equipoB
        FROM partidos p
        LEFT JOIN equipos eA ON p.id_equipoA_fk = eA.id
        LEFT JOIN equipos eB ON p.id_equipoB_fk = eB.id
        ORDER BY p.fecha_hora DESC
    `, [])
}


exports.getById = id => {
	return queryMYSQL(`
        SELECT p.*, eA.nombre as equipoA, eB.nombre as equipoB
        FROM partidos p
        LEFT JOIN equipos eA ON p.id_equipoA_fk = eA.id
        LEFT JOIN equipos eB ON p.id_equipoB_fk = eB.id
        WHERE p.id = ?
    `, [id])
}



exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO partidos (fecha_hora, id_equipoA_fk, id_equipoB_fk) 
        VALUES (?, ?, ?)
    `, [o.fecha_hora, o.id_equipoA_fk, o.id_equipoB_fk])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE partidos 
        SET fecha_hora=?, id_equipoA_fk=?, id_equipoB_fk=?
        WHERE id=?
    `, [o.fecha_hora, o.id_equipoA_fk, o.id_equipoB_fk, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM partidos 
        WHERE id = ?
    `, [id])
}

exports.updateEstado = (id, estado, puntosA, puntosB) => {
    return queryMYSQL(`
        UPDATE partidos
        SET estado=?, puntosA=?, puntosB=?
        WHERE id=?
    `, [estado, puntosA, puntosB, id])
}

exports.updatePuntos = (id, puntosA, puntosB) => {
    return queryMYSQL(`
        UPDATE partidos
        SET puntosA=?, puntosB=?
        WHERE id=?
    `, [puntosA, puntosB, id])
}


exports.insertarEvento = (o) => {
    return queryMYSQL(`
        INSERT INTO eventos_partido (id_partido_fk, id_jugador_fk, evento, valor, periodo, tiempo_restante, fecha_hora) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    `, [o.id_partido_fk, o.id_jugador_fk, o.evento, o.valor, o.periodo, o.tiempo_restante])
}

exports.deshacerUltimoEvento = (id_partido_fk) => {
    return queryMYSQL(`
        DELETE FROM eventos_partido
        WHERE id_partido_fk = ?
        ORDER BY id DESC
        LIMIT 1
    `, [id_partido_fk])
}

exports.getEventosByPartido = (id_partido_fk) => {
    return queryMYSQL(`
        SELECT ep.*, j.nombre AS jugador, e.nombre AS equipo
        FROM eventos_partido ep
        LEFT JOIN jugadores j ON ep.id_jugador_fk = j.id
        LEFT JOIN equipos e ON j.id_equipo_fk = e.id
        WHERE ep.id_partido_fk = ?
        ORDER BY ep.fecha_hora ASC
    `, [id_partido_fk])
}
