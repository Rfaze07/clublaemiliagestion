const { queryMYSQL } = require("../../database")


exports.getAllTableroProyectosAceptados = () => {
	return queryMYSQL(`
        SELECT pd.id,
                eh.fecha_real AS fechaHoraTxt,
                CONCAT(e.apellido, ', ', e.nombre) AS empleadoTxt, 
                eh.descripcion AS horaDescTxt, 
                horas AS horasTrabajadas, 
                SUM(t.cantidad) AS horasTareas, 
                t.descripcion AS tareaTxt, 
                pd.id_cargo_fk, 
                c2.descripcion AS cargoTxt,
                CONCAT('(', pt.desc_corta, ') ', pt.descripcion) AS proyectoTxt
        FROM empleados_horas eh 
        LEFT JOIN tareas t ON t.id = eh.id_tarea_fk 
        LEFT JOIN proyectos_titulos pt ON pt.id = eh.id_proyecto_fk 
        LEFT JOIN proyectos_detalles pd ON pd.id_proyectotitulo_fk = pt.id AND pd.id_tarea_fk = t.id 
        LEFT JOIN empleados e ON e.id = eh.id_empleado_fk 
        LEFT JOIN clientes c ON c.id = eh.id_cliente_fk 
        LEFT JOIN cargos c2 ON c2.id = pd.id_cargo_fk 
        WHERE pt.id_estado_fk = 3 
        GROUP BY t.id 
    `, [])
}

exports.getAllTableroEstadosFechas = o => {
	return queryMYSQL(`
        SELECT pt.id, 
                CONCAT('(', pt.desc_corta, ') ', pt.descripcion) AS proyectoTxt,  
                pt.fecha AS fechaProyecto, 
                SUM(eh.horas) AS horasTrabajadas, 
                SUM(t.cantidad) AS horasTareas, 
                c.razon_social AS clienteTxt 
        FROM empleados_horas eh 
        LEFT JOIN proyectos_titulos pt ON pt.id = eh.id_proyecto_fk 
        LEFT JOIN empleados e ON e.id = eh.id_empleado_fk 
        LEFT JOIN clientes c ON c.id = eh.id_cliente_fk 
        LEFT JOIN tareas t ON t.id = eh.id_tarea_fk 
        WHERE eh.fecha BETWEEN ? AND ? 
        GROUP BY pt.id 
    `, [o.desde, o.hasta])
}

exports.postModificarCargo = o => {
	return queryMYSQL(`
        UPDATE proyectos_detalles
        SET id_cargo_fk=?
        WHERE id=?
    `, [o.idCargo, o.id])
}