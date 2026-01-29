const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT ott.*, ottt.descripcion AS otTipoTareaTxt
        FROM ordenes_trabajos_tareas ott
        LEFT JOIN ordenes_trabajos_tipos_tareas ottt ON ottt.id = ott.id_tipo_tarea_fk 
        ORDER BY ott.descripcion 
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT ott.*, ottt.descripcion AS otTipoTareaTxt
        FROM ordenes_trabajos_tareas ott
        LEFT JOIN ordenes_trabajos_tipos_tareas ottt ON ottt.id = ott.id_tipo_tarea_fk 
        WHERE ott.activo = ? 
        ORDER BY ott.descripcion 
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT ott.*, ottt.descripcion AS otTipoTareaTxt
        FROM ordenes_trabajos_tareas ott
        LEFT JOIN ordenes_trabajos_tipos_tareas ottt ON ottt.id = ott.id_tipo_tarea_fk 
        WHERE ott.id = ?
    `, [id])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO ordenes_trabajos_tareas (desc_corta, descripcion, id_tipo_tarea_fk, precio) 
        VALUES (?,?,?,?)
    `, [o.descCorta, o.descripcion, o.tipoTarea, o.precio])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE ordenes_trabajos_tareas 
        SET desc_corta=?, descripcion=?, id_tipo_tarea_fk=?, precio=?, activo=? 
        WHERE id=?
    `, [o.descCorta, o.descripcion, o.tipoTarea, o.precio, o.activo, o.id])
}

// exports.delete = async id => {
//     return queryMYSQL(`
//         DELETE FROM ordenes_trabajos_tareas 
//         WHERE id = ?
//     `, [id])
// }