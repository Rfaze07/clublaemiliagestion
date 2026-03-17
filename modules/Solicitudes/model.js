const { queryMYSQL } = require("../../database")

exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}


exports.getAll = (desde, hasta) => {

    let where = []
    let params = []

    if (desde) {
        where.push("DATE(s.fecha_creacion) >= ?")
        params.push(desde)
    }

    if (hasta) {
        where.push("DATE(s.fecha_creacion) <= ?")
        params.push(hasta)
    }

    let sql = `
        SELECT 
            s.id,
            s.tipo_registro,
            s.nombre,
            s.apellido,
            s.dni,
            s.fecha_nacimiento,
            s.telefono,
            s.mail,
            s.deporte,
            s.fecha_creacion,
            CONCAT(t.nombre,' ',t.apellido) AS titular
        FROM socios s
        LEFT JOIN socios t
            ON s.socio_titular_id = t.id
    `

    if (where.length) {
        sql += " WHERE " + where.join(" AND ")
    }

    sql += " ORDER BY s.fecha_creacion DESC"

    return queryMYSQL(sql, params)
}



exports.getById = id => {

    return queryMYSQL(`
        SELECT 
            s.*,
            CONCAT(t.nombre,' ',t.apellido) AS titular
        FROM socios s
        LEFT JOIN socios t
            ON s.socio_titular_id = t.id
        WHERE s.id = ?
    `, [id])

}
exports.getGrupoFamiliar = (titularId) => {

    return queryMYSQL(`
        SELECT 
            s.id,
            s.tipo_registro,
            s.nombre,
            s.apellido,
            s.dni,
            s.fecha_nacimiento,
            s.telefono,
            s.mail,
            s.deporte,
            s.direccion,
            s.localidad,
            s.ocupacion,
            s.fecha_creacion,
            s.socio_titular_id,
            s.parentesco 
        FROM socios s
        WHERE 
            s.id = ?
            OR s.socio_titular_id = ?
        ORDER BY 
            s.tipo_registro DESC, s.nombre ASC
    `, [titularId, titularId]);

};