const { queryMYSQL } = require("../../database")


exports.getAllbyRangoFechas = (desde, hasta) => {
	return queryMYSQL(`
        SELECT g.*, CONCAT(e.apellido, ', ', e.nombre) AS choferTxt, v.patente, t.descripcion AS tanqueTxt, 
                m.descripcion AS marcaTxt, IFNULL(s.usuario, '') AS usuarioTxt
        FROM gasoil g
        LEFT JOIN empleados e ON e.id = g.id_chofer_fk 
        LEFT JOIN vehiculos v ON v.id = g.id_vehiculo_fk 
        LEFT JOIN marcas m ON m.id = v.id_marca_fk 
        LEFT JOIN tanques t ON t.id = g.id_tanque_fk 
        LEFT JOIN secr s ON s.unica = g.id_unica_fk 
        WHERE DATE_FORMAT(g.fecha_hora, "%Y-%m-%d") BETWEEN ? AND ?
        ORDER BY fecha_hora DESC
    `, [desde, hasta])
}

exports.getUltimoNroVale = () => {
    return queryMYSQL(`SELECT IFNULL(MAX(nro_vale), 0)+1 AS utlNroVale FROM gasoil`, [])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO gasoil (nro_vale, id_chofer_fk, id_vehiculo_fk, litros, km, historico_lts, 
                            fecha_hora, id_unica_fk, id_tanque_fk, observaciones) 
        VALUES (?,?,?,?,?,?,?,?,?,?)
    `, [o.nroVale, o.chofer, o.camion, o.litros, o.odometro, o.ltsHistorico, 
        o.fechaHora, o.user, o.tanque, o.observaciones])
}

exports.getPuedoEliminar = id => {
    return queryMYSQL(`
        SELECT *
        FROM gasoil g
        WHERE id_vehiculo_fk = ?
        ORDER BY id DESC, fecha_hora DESC
        LIMIT 1
    `, [id])
}

exports.delete = id => {
    return queryMYSQL(`
        DELETE FROM gasoil WHERE id = ?
    `, [id])
}