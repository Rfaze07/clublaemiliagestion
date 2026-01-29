const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT ot.*, v.patente, m.descripcion AS marcaTxt, v.id_tipovehiculo_fk, ott.descripcion AS otTipoTxt, 
                ote.descripcion AS otEstadoTxt, s.usuario
        FROM ordenes_trabajos ot 
        LEFT JOIN ordenes_trabajos_tipos ott ON ott.id = ot.id_tipoot_fk 
        LEFT JOIN ordenes_trabajos_estados ote ON ote.id = ot.id_estadoot_fk 
        LEFT JOIN secr s ON s.unica = ot.id_usuario_fk 
        LEFT JOIN vehiculos v ON v.id = ot.id_vehiculo_fk 
        LEFT JOIN marcas m ON m.id = v.id_marca_fk 
        ORDER BY ot.fecha DESC
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT ot.*, v.patente, m.descripcion AS marcaTxt, v.id_tipovehiculo_fk, ott.descripcion AS otTipoTxt, 
                ote.descripcion AS otEstadoTxt, s.usuario
        FROM ordenes_trabajos ot 
        LEFT JOIN ordenes_trabajos_tipos ott ON ott.id = ot.id_tipoot_fk 
        LEFT JOIN ordenes_trabajos_estados ote ON ote.id = ot.id_estadoot_fk 
        LEFT JOIN secr s ON s.unica = ot.id_usuario_fk 
        LEFT JOIN vehiculos v ON v.id = ot.id_vehiculo_fk 
        LEFT JOIN marcas m ON m.id = v.id_marca_fk 
        WHERE ot.activo = ? 
        ORDER BY ot.fecha DESC
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT ot.*, LPAD(ot.id, 11, '0') AS nroOT, v.patente, m.descripcion AS marcaTxt, 
                tv.descripcion AS tipoVehiculoTxt, v.id_tipovehiculo_fk, 
                ott.descripcion AS otTipoTxt, ote.descripcion AS otEstadoTxt, s.usuario,
                e.nro_legajo, e.apellido, e.nombre, e.id_puesto_fk
        FROM ordenes_trabajos ot 
        LEFT JOIN ordenes_trabajos_tipos ott ON ott.id = ot.id_tipoot_fk 
        LEFT JOIN ordenes_trabajos_estados ote ON ote.id = ot.id_estadoot_fk 
        LEFT JOIN secr s ON s.unica = ot.id_usuario_fk 
        LEFT JOIN vehiculos v ON v.id = ot.id_vehiculo_fk 
        LEFT JOIN tipos_vehiculos tv ON tv.id = v.id_tipovehiculo_fk 
        LEFT JOIN marcas m ON m.id = v.id_marca_fk
        LEFT JOIN empleados e ON e.id = ot.id_empleado_fk 
        LEFT JOIN puestos p ON p.id = e.id_puesto_fk   
        WHERE ot.id = ?
    `, [id])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO ordenes_trabajos (fecha_creado, fecha, id_tipoot_fk, id_vehiculo_fk, 
                            id_empleado_fk, responsable, id_usuario_fk, id_estadoot_fk, observaciones) 
        VALUES (NOW(),?,?,?,?,?,?,?,?)
    `, [o.fecha, o.tipoOT, o.vehiculo, o.idEmpleado, o.responsable, o.usuario, o.estadoOT, o.observaciones])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE ordenes_trabajos 
        SET fecha=?, id_tipoot_fk=?, id_vehiculo_fk=?, id_empleado_fk=?, responsable=?, 
            id_usuario_fk=?, id_estadoot_fk=?, observaciones=?, activo=? 
        WHERE id=?
    `, [o.fecha, o.tipoOT, o.vehiculo, o.idEmpleado, o.responsable, o.usuario, 
        o.estadoOT, o.observaciones, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM ordenes_trabajos 
        WHERE id = ?
    `, [id])
}

exports.updateBlindarById = id => {
    return queryMYSQL(`
        UPDATE ordenes_trabajos 
        SET blindado = 1, id_estadoot_fk = 2 
        WHERE id=?
    `, [id])
}


exports.getByTipoOT = id =>{
    return queryMYSQL(`
        SELECT * FROM ordenes_trabajos 
        WHERE id_tipoot_fk = ?
    `, [id])
}





// ======================  MOVIMIENTOS  =========================================

exports.getMovimientosByIdOT = id => {
    return queryMYSQL(`
        SELECT om.id, om.cantidad, r.descripcion AS repuestoTxt, 
                IFNULL(u.descripcion, '') AS ubicacionTxt, i.descripcion AS imputacionTxt, 
                IFNULL(om.kms_iniciales, '') AS kmsIniciales, IFNULL(om.kms_totales, '') AS kmsTotales, IFNULL(rf.nro_serie, '') AS fichaTxt
        FROM ot_movimientos om
        LEFT JOIN repuestos r ON r.id = om.id_repuesto_fk 
        LEFT JOIN ubicaciones u ON u.id = om.id_ubicacion_fk 
        LEFT JOIN tipos_movimientos tm ON tm.id = om.id_tipomovimiento_fk 
        LEFT JOIN depositos d ON d.id = om.id_deposito_fk 
        LEFT JOIN vehiculos v ON v.id = om.id_vehiculo_fk 
        LEFT JOIN imputaciones i ON i.id = om.id_imputacion_fk 
        LEFT JOIN repuestos_ficha rf ON rf.id = om.id_repuesto_ficha_fk
        WHERE om.id_ordentrabajo_fk = ?
    `, [id])
}

exports.getMovimientoById = id => {
    return queryMYSQL(`
        SELECT om.*, r.es_neumatico 
        FROM ot_movimientos om
        LEFT JOIN repuestos r ON r.id = om.id_repuesto_fk 
        WHERE om.id = ?
    `, [id])
}

exports.insertMovimiento = o => {
    return queryMYSQL(`
        INSERT INTO ot_movimientos (id_ordentrabajo_fk, fecha_creado, fecha, cantidad, id_repuesto_fk, 
                        id_ubicacion_fk, id_tipomovimiento_fk, id_deposito_fk, id_vehiculo_fk,
                        detalles, kms_iniciales, id_imputacion_fk, id_repuesto_ficha_fk) 
        VALUES (?,NOW(),?,?,?,?,?,?,?,?,?,?,?)
    `, [o.idOrdenTrabajo, o.fecha, o.cantidad, o.repuesto, o.ubicacion, o.tipoMovimiento, 
        o.deposito, o.vehiculo, o.detalles, o.kmsIni, o.imputacion, o.ficha])
}


exports.updateMovimientosById = o => {
    return queryMYSQL(`
        UPDATE ot_tareas 
        SET fecha = ? cantidad = ?, id_repuesto_fk = ?, id_ubicacion_f = ?, id_tipomovimiento_fk = ?, id_deposito_fk = ?, id_vehiculo_fk = ?,
                        detalles = ?, kms_iniciales = ?, id_imputacion_fk = ?, id_repuesto_ficha_fk = ?
        WHERE id=?
    `, [o.fecha, o.cantidad, o.repuesto, o.ubicacion, o.tipoMovimiento, 
        o.deposito, o.vehiculo, o.detalles, o.kmsIni, o.imputacion, o.ficha, o.id])
}

exports.deleteMovimientoById = id => {
    return queryMYSQL(`
        DELETE FROM ot_movimientos 
        WHERE id = ?
    `, [id])
}

exports.getMovimientosByImputacion = id => {
    return queryMYSQL(`
        SELECT * FROM ot_movimientos
        WHERE id_imputacion_fk = ?
        `, [id])
}




// ======================  TAREAS  =========================================

exports.getTareasByIdOT = id => {
    return queryMYSQL(`
        SELECT ott.*, i.descripcion AS imputacionTxt
        FROM ot_tareas ott
        LEFT JOIN imputaciones i ON i.id = ott.id_imputacion_fk 
        WHERE ott.id_ordentrabajo_fk = ?
    `, [id])
}

exports.getTareaById = id => {
    return queryMYSQL(`
        SELECT ott.*, i.descripcion AS imputacionTxt
        FROM ot_tareas ott
        LEFT JOIN imputaciones i ON i.id = ott.id_imputacion_fk 
        WHERE ott.id = ?
    `, [id])
}

exports.insertTarea = o => {
    return queryMYSQL(`
        INSERT INTO ot_tareas (id_ordentrabajo_fk, id_tarea_fk, tarea, detalles, 
                        importe_total, realizado, id_imputacion_fk) 
        VALUES (?,?,?,?,?,?,?)
    `, [o.idOrdenTrabajo, o.idTarea, o.tarea, o.detalles, 
        o.importe, o.realizado, o.imputacion])
}

exports.updateRealizadoById = o => {
    return queryMYSQL(`
        UPDATE ot_tareas 
        SET realizado=? 
        WHERE id=?
    `, [o.estado, o.id])
}

exports.deleteTareaById = id => {
    return queryMYSQL(`
        DELETE FROM ot_tareas 
        WHERE id = ?
    `, [id])
}

// ======================  NOVEDADES  =========================================

exports.getNovedadesByIdOT = id => {
    return queryMYSQL(`
        SELECT otn.*, i.descripcion AS imputacion, v.patente as vehiculo
        FROM ordenes_trabajos_novedades otn
        LEFT JOIN imputaciones i ON i.id = otn.id_imputacion_fk
        left join vehiculos v ON v.id = otn.id_vehiculo_fk
        WHERE otn.id_ordentrabajo_fk = ?
        ORDER BY otn.descripcion 
    `, [id])
}

//Asigna OT A novedad junto con el estado
exports.updateNovedadAsignaOT = o => {
    return queryMYSQL(`
            UPDATE ordenes_trabajos_novedades 
            SET id_ordentrabajo_fk = ?,
            estado = ?
            WHERE id = ?
    `, [o.idOrdenTrabajo, o.estado, o.id])
        
}


//Actualiza Estado
exports.updateNovedadRealizado = o => {
    return queryMYSQL(`
            UPDATE ordenes_trabajos_novedades 
            SET estado = ?
            WHERE id = ?
    `, [o.estado, o.id])
        
}

//Quitar OT y Estado
exports.updateNovedadQuitaOT = id =>{
    return queryMYSQL(`
        UPDATE ordenes_trabajos_novedades
        SET id_ordentrabajo_fk = null,
        estado = null
        WHERE id = ?
        `, [id])
}

