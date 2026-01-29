const { queryMYSQL } = require("../../database")


exports.execQuery = (q, p) => {
    return queryMYSQL(q, p)
}

exports.getAll = () => {
	return queryMYSQL(`
        SELECT a.*, p.titulo AS modulo, c.descripcion AS cargoTxt
        FROM alertas a
        LEFT JOIN alertas_modulos am ON am.id = a.id_moduloalerta_fk
        LEFT JOIN pantallas p ON p.id = am.id_modulo_fk 
        LEFT JOIN cargos c ON c.id = a.id_cargo_fk 
        ORDER BY a.descripcion
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT a.*, p.titulo AS modulo, c.descripcion AS cargoTxt
        FROM alertas a
        LEFT JOIN alertas_modulos am ON am.id = a.id_moduloalerta_fk
        LEFT JOIN pantallas p ON p.id = am.id_modulo_fk 
        LEFT JOIN cargos c ON c.id = a.id_cargo_fk 
        WHERE a.activo = ?
        ORDER BY a.descripcion
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT a.*, p.titulo AS modulo, c.descripcion AS cargoTxt
        FROM alertas a
        LEFT JOIN alertas_modulos am ON am.id = a.id_moduloalerta_fk
        LEFT JOIN pantallas p ON p.id = am.id_modulo_fk 
        LEFT JOIN cargos c ON c.id = a.id_cargo_fk 
        WHERE a.id = ?
        ORDER BY a.descripcion
    `, [id])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO alertas (id_moduloalerta_fk, descripcion, id_cargo_fk, activo_inicio, activo_popup) 
        VALUES (?,?,?,?,?)
    `, [o.moduloAlerta, o.descripcion, o.cargo, o.activoInicio, o.activoPopup])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE alertas 
        SET id_moduloalerta_fk=?, descripcion=?, id_cargo_fk=?, activo_inicio=?, activo_popup=?, activo=? 
        WHERE id=?
    `, [o.moduloAlerta, o.descripcion, o.cargo, o.activoInicio, o.activoPopup, o.activo, o.id])
}

exports.delete = id => {
    return queryMYSQL(`
        DELETE FROM alertas WHERE id=?
    `, [id])
}




/*********************************
    MODULOS - ALERTAS | INICIO
*********************************/
exports.getAllModulosAlarmaActivos = () => {
    return queryMYSQL(`
        SELECT am.id, p.titulo AS modulo
        FROM alertas_modulos am 
        LEFT JOIN pantallas p ON p.id = am.id_modulo_fk 
        WHERE am.activo = 1 AND p.activa = 1
    `, [])
}

exports.getAlertasByCargo = idCargo => {
    return queryMYSQL(`
        SELECT * FROM alertas WHERE id_cargo_fk = ?
    `, [idCargo])
}

exports.getProximosVencimientos = () => {
    return queryMYSQL(`
        SELECT v.id, v.id_tipodocumentacion_fk, v.fecha_vencimiento, d.descripcion AS documentacionTxt, 
            IFNULL(CONCAT(e.apellido, ', ', e.nombre), '') AS empleadoTxt, 
            IFNULL(CONCAT(tv.descripcion, ' - ', vh.patente), '') AS vehiculoTxt, 
            DATE_ADD(v.fecha_vencimiento, INTERVAL d.dias_vigencia DAY) as fechaProxVenc,
            CASE 
                WHEN d.id_tipodocumentacion_fk = 1 THEN em.razon_social 
                WHEN d.id_tipodocumentacion_fk = 2 THEN CONCAT(m.descripcion, ' (', vh.patente, ')')
                WHEN d.id_tipodocumentacion_fk = 3 THEN CONCAT(e.apellido, ', ', e.nombre)
            END AS entidadTxt
        FROM vencimientos v
        LEFT JOIN documentacion d ON d.id  = v.id_documentacion_fk 
        LEFT JOIN vehiculos vh ON vh.id = v.id_vehiculo_fk 
        LEFT JOIN empleados e ON e.id = v.id_empleado_fk 
        LEFT JOIN empresas em ON em.id = v.id_empresa_fk 
        LEFT JOIN marcas m ON m.id = vh.id_marca_fk 
        LEFT JOIN tipos_vehiculos tv ON tv.id = vh.id_tipovehiculo_fk
        WHERE CURDATE() >= DATE_SUB(v.fecha_vencimiento, INTERVAL d.dias_alarma DAY) 
              AND d.activo = 1 
              AND v.activo = 1
    `, [])
}

exports.getRenovarProximo = id => {
    return queryMYSQL(`
        SELECT DATE_ADD(v.fecha_vencimiento, INTERVAL d.dias_vigencia DAY) AS nuevaVigencia, 
            d.descripcion AS documentacionTxt, 
            CASE 
                WHEN d.id_tipodocumentacion_fk = 1 THEN em.razon_social 
                WHEN d.id_tipodocumentacion_fk = 2 THEN CONCAT(m.descripcion, ' (', vh.patente, ')')
                WHEN d.id_tipodocumentacion_fk = 3 THEN CONCAT(e.apellido, ', ', e.nombre)
            END AS entidadTxt
    FROM vencimientos v
    LEFT JOIN documentacion d ON d.id = v.id_documentacion_fk 
    LEFT JOIN vehiculos vh ON vh.id = v.id_vehiculo_fk 
    LEFT JOIN empleados e ON e.id = v.id_empleado_fk 
    LEFT JOIN empresas em ON em.id = v.id_empresa_fk 
    LEFT JOIN marcas m ON m.id = vh.id_marca_fk 
    WHERE v.id = ?
    `, [id])
}