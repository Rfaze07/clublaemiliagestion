const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT i.*, ti.descripcion AS tipoInasistenciaTxt, 
            CONCAT(e.apellido, ', ', e.nombre) AS empleadoTxt,
            CONCAT(m.apellido, ', ', m.nombre) AS medicoTxt,
            en.descripcion AS enfermedadTxt,
            p.descripcion AS puestoTxt, 
            SUM(IFNULL(i.dias, 0) + IFNULL((SELECT SUM(dias) AS dias FROM certificados_empleados ce WHERE i.id = ce.id_inasistencia_fk), 0)) AS diasTot
        --     DATEDIFF((
        --         SELECT ce2.fecha_certificado 
        --         FROM certificados_empleados ce2 
        --         WHERE ce2.id_inasistencia_fk = i.id 
        --         GROUP BY ce2.id_inasistencia_fk 
        --         ORDER BY ce2.fecha_certificado DESC 
        --     ), i.fecha) AS diasTot
        FROM inasistencias i 
        LEFT JOIN tipos_inasistencias ti ON ti.id = i.id_tipoinasistencia_fk 
        LEFT JOIN empleados e ON e.id = i.id_empleado_fk 
        LEFT JOIN puestos p ON p.id = e.id_puesto_fk 
        LEFT JOIN enfermedades en ON en.id = i.id_enfermedad_fk 
        LEFT JOIN medicos m ON m.id = i.id_medico_fk 
        ORDER BY i.fecha DESC
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT i.*, ti.descripcion AS tipoInasistenciaTxt, 
            CONCAT(e.apellido, ', ', e.nombre) AS empleadoTxt,
            CONCAT(m.apellido, ', ', m.nombre) AS medicoTxt,
            en.descripcion AS enfermedadTxt,
            p.descripcion AS puestoTxt, 
            SUM(IFNULL(i.dias, 0) + IFNULL((SELECT SUM(dias) AS dias FROM certificados_empleados ce WHERE i.id = ce.id_inasistencia_fk), 0)) AS diasTot
        --     DATEDIFF((
        --         SELECT ce2.fecha_certificado 
        --         FROM certificados_empleados ce2 
        --         WHERE ce2.id_inasistencia_fk = i.id 
        --         GROUP BY ce2.id_inasistencia_fk 
        --         ORDER BY ce2.fecha_certificado DESC 
        --     ), i.fecha) AS diasTot
        FROM inasistencias i 
        LEFT JOIN tipos_inasistencias ti ON ti.id = i.id_tipoinasistencia_fk 
        LEFT JOIN empleados e ON e.id = i.id_empleado_fk 
        LEFT JOIN puestos p ON p.id = e.id_puesto_fk 
        LEFT JOIN enfermedades en ON en.id = i.id_enfermedad_fk 
        LEFT JOIN medicos m ON m.id = i.id_medico_fk 
        WHERE i.activo = ?
        ORDER BY i.fecha DESC
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT i.*, ti.descripcion AS tipoInasistenciaTxt, 
            CONCAT(e.apellido, ', ', e.nombre) AS empleadoTxt,
            CONCAT(m.apellido, ', ', m.nombre) AS medicoTxt, 
            SUM(IFNULL(i.dias, 0) + IFNULL((SELECT SUM(dias) AS dias FROM certificados_empleados ce WHERE i.id = ce.id_inasistencia_fk), 0)) AS diasTot,
            en.descripcion AS enfermedadTxt
        FROM inasistencias i 
        LEFT JOIN tipos_inasistencias ti ON ti.id = i.id_tipoinasistencia_fk 
        LEFT JOIN empleados e ON e.id = i.id_empleado_fk 
        LEFT JOIN enfermedades en ON en.id = i.id_enfermedad_fk 
        LEFT JOIN medicos m ON m.id = i.id_medico_fk 
        WHERE i.id = ?
    `, [id])
}

exports.getCertificadosByIdInasistencia = id => {
	return queryMYSQL(`
        SELECT ce.*, CONCAT(m.apellido, ', ', m.nombre) AS medicoTxt
        FROM certificados_empleados ce
        LEFT JOIN medicos m ON m.id = ce.id_medico_fk 
        WHERE ce.id_inasistencia_fk = ?
    `, [id])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO inasistencias (fecha, fecha_real, id_puesto_fk, id_empleado_fk, dias, 
                                id_tipoinasistencia_fk, id_enfermedad_fk, id_medico_fk, observaciones)
        VALUES (?,NOW(),?,?,?,?,?,?)
    `, [o.fecha, o.puesto, o.empleado, o.dias, o.tipoInasistencia, 
        o.enfermedad, o.medico, o.observaciones])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE inasistencias 
        SET fecha=?, id_puesto_fk=?, id_empleado_fk=?, dias=?, id_tipoinasistencia_fk=?, 
            id_enfermedad_fk=?, id_medico_fk=?, observaciones=?, activo=? 
        WHERE id=?
    `, [o.fecha, o.puesto, o.empleado, o.dias, o.tipoInasistencia, 
        o.enfermedad, o.medico, o.observaciones, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM marcas WHERE id = ?
    `, [id])
}

exports.getAllEmpleadosByPuestos = puesto => {
	return queryMYSQL(`
        SELECT id, nombre, apellido, nro_legajo 
        FROM empleados
        WHERE id_puesto_fk = ?
    `, [puesto])
}

exports.getAllEmpleadosActivos = para => {
	return queryMYSQL(`
        SELECT * 
        FROM empleados 
        WHERE id_cargo_fk ${ para == 'c' ? '=':'!=' } 5 AND activo = 1
    `, [])
}

exports.getAllByEnfermedad = async id_enfermedad_fk => {
	return queryMYSQL(`
        SELECT i.* 
        FROM inasistencias i
        WHERE i.id_enfermedad_fk = ?
    `, [id_enfermedad_fk])
}

exports.insertCertificado = o => {
    return queryMYSQL(`
        INSERT INTO certificados_empleados (id_inasistencia_fk, fecha_certificado, fecha_alta, dias, diagnostico, id_medico_fk)
        VALUES (?,?,?,?,?,?)
    `, [o.idInasistencia, o.fechaCert, o.fecha, o.dias, o.observaciones, o.medico])
}

exports.updateCertificado = o => {
    return queryMYSQL(`
        UPDATE certificados_empleados 
        SET id_inasistencia_fk=?, fecha_certificado=?, fecha_alta=?, dias=?, diagnostico=?, id_medico_fk=? 
        WHERE id=?
    `, [o.idInasistencia, o.fechaCert, o.fecha, o.dias, o.observaciones, o.medico, o.id])
}

exports.deleteCertificado = id => {
    return queryMYSQL(`
        DELETE FROM certificados_empleados 
        WHERE id=?
    `, [id])
}