const { queryMYSQL } = require("../../database")


exports.getAllListaByRangoFechas = (o, idEmpleado) => {
	return queryMYSQL(`
        SELECT eh.id, eh.descripcion, eh.horas, c.cuit, c.razon_social AS clienteTxt, 
                pt.desc_corta AS proyectoTxt, ehe.descripcion AS estadoTxt
        FROM empleados_horas eh
        LEFT JOIN clientes c ON c.id = eh.id_cliente_fk 
        LEFT JOIN proyectos_titulos pt ON pt.id = eh.id_proyecto_fk 
        LEFT JOIN empleados_horas_estados ehe ON ehe.id = eh.id_estadohoras_fk 
        WHERE eh.fecha BETWEEN ? AND ? AND id_empleado_fk = ? 
        ORDER BY eh.fecha DESC
    `, [o.desde, o.hasta, idEmpleado])
}

exports.getAllEstadosActivos = () => {
	return queryMYSQL(`
        SELECT *
        FROM empleados_horas_estados
        WHERE activo = 1
    `, [])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT eh.id, eh.fecha, eh.descripcion, eh.horas, c.cuit, c.razon_social AS clienteTxt, 
                pt.desc_corta AS proyectoTxt, pd.tarea AS tareaTxt, ehe.descripcion AS estadoTxt
        FROM empleados_horas eh
        LEFT JOIN clientes c ON c.id = eh.id_cliente_fk 
        LEFT JOIN proyectos_titulos pt ON pt.id = eh.id_proyecto_fk 
        LEFT JOIN proyectos_detalles pd ON pd.id_proyectotitulo_fk = eh.id_proyecto_fk
        LEFT JOIN empleados_horas_estados ehe ON ehe.id = eh.id_estadohoras_fk 
        WHERE eh.id = ?
    `, [id])
}

exports.insert = (o, idEmpleado) => {
    return queryMYSQL(`
        INSERT INTO empleados_horas (fecha, fecha_real, descripcion, id_cliente_fk, id_proyecto_fk, 
                        id_presupuesto_fk, id_tarea_fk, horas, id_empleado_fk, id_estadohoras_fk)
        VALUES (?,NOW(),?,?,?,0,?,?,?,1)
    `, [o.fecha, o.descripcion, o.cliente, o.proyecto, o.tarea, o.horas, idEmpleado])
}

// exports.update = o => {
//     return queryMYSQL(`
//         UPDATE rubros 
//         SET descripcion=?, desc_corta = ?, activo=? 
//         WHERE id=?
//     `, [o.descripcion, o.desc_corta, o.activo, o.id])
// }

// exports.delete = async id => {
//     return queryMYSQL(`delete from rubros where id = ?`, [id])
// }