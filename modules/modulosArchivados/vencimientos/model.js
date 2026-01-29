const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT v.*, td.descripcion AS tipoDocumentacionTxt, 
            IFNULL(CONCAT(e.apellido, ', ', e.nombre), '') AS empleadoTxt, 
            IFNULL(CONCAT(tv.descripcion, ' - ', vh.patente), '') AS vehiculoTxt, 
            d.descripcion AS documentacionTxt, 
            CURDATE() >= DATE_SUB(v.fecha_vencimiento, INTERVAL d.dias_alarma DAY) AS paraRenovar 
        FROM vencimientos v 
        LEFT JOIN tipos_documentacion td ON td.id =v.id_tipodocumentacion_fk 
        LEFT JOIN empleados e ON e.id = v.id_empleado_fk 
        LEFT JOIN vehiculos vh ON vh.id = v.id_vehiculo_fk 
        LEFT JOIN tipos_vehiculos tv ON tv.id = vh.id_tipovehiculo_fk 
        LEFT JOIN documentacion d ON d.id = v.id_documentacion_fk
        WHERE v.eliminado = 0 
        ORDER BY v.fecha_vencimiento ASC
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT v.*, td.descripcion AS tipoDocumentacionTxt, 
            IFNULL(CONCAT(e.apellido, ', ', e.nombre), '') AS empleadoTxt, 
            IFNULL(CONCAT(tv.descripcion, ' - ', vh.patente), '') AS vehiculoTxt, 
            d.descripcion AS documentacionTxt, 
            CURDATE() >= DATE_SUB(v.fecha_vencimiento, INTERVAL d.dias_alarma DAY) AS paraRenovar 
        FROM vencimientos v 
        LEFT JOIN tipos_documentacion td ON td.id =v.id_tipodocumentacion_fk 
        LEFT JOIN empleados e ON e.id = v.id_empleado_fk 
        LEFT JOIN vehiculos vh ON vh.id = v.id_vehiculo_fk 
        LEFT JOIN tipos_vehiculos tv ON tv.id = vh.id_tipovehiculo_fk 
        LEFT JOIN documentacion d ON d.id = v.id_documentacion_fk
        WHERE v.activo = ? AND v.eliminado = 0 
        ORDER BY v.fecha_vencimiento ASC
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT v.*, td.descripcion AS tipoDocumentacionTxt, 
            IFNULL(CONCAT(e.apellido, ', ', e.nombre), '') AS empleadoTxt, 
            IFNULL(CONCAT(tv.descripcion, ' - ', vh.patente), '') AS vehiculoTxt, 
            d.descripcion AS documentacionTxt 
        FROM vencimientos v 
        LEFT JOIN tipos_documentacion td ON td.id =v.id_tipodocumentacion_fk 
        LEFT JOIN empleados e ON e.id = v.id_empleado_fk 
        LEFT JOIN vehiculos vh ON vh.id = v.id_vehiculo_fk 
        LEFT JOIN tipos_vehiculos tv ON tv.id = vh.id_tipovehiculo_fk 
        LEFT JOIN documentacion d ON d.id = v.id_documentacion_fk
        WHERE v.id = ? AND v.eliminado = 0
    `, [id])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO vencimientos (id_tipodocumentacion_fk, id_empleado_fk, id_vehiculo_fk, id_documentacion_fk, 
                                    descripcion, observaciones, fecha_vencimiento, fecha_real, id_unica_fk) 
        VALUES (?,?,?,?,?,?,?,NOW(),?)
    `, [o.tipoDocumentacion, o.empleado, o.vehiculo, o.documentacion, o.descripcion, o.observaciones, o.fechaVenc, o.unica])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE vencimientos 
        SET id_tipodocumentacion_fk=?, id_empleado_fk=?, id_vehiculo_fk=?, id_documentacion_fk=?, 
            descripcion=?, observaciones=?, fecha_vencimiento=?, id_unica_fk=?, activo=? 
        WHERE id=?
    `, [o.tipoDocumentacion, o.empleado, o.vehiculo, o.documentacion, 
        o.descripcion, o.observaciones, o.fechaVenc, o.unica, o.activo, o.id])
}

exports.updateRenovacion = id => {
    return queryMYSQL(`
        UPDATE vencimientos SET activo = 0 WHERE id = ?
    `, [id])
}

exports.delete = async id => {
    return queryMYSQL(`
        UPDATE vencimientos 
        SET activo = 0, eliminado = 1 
        WHERE id = ?
    `, [id])
}