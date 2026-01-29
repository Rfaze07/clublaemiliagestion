const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT * 
        FROM ordenes_trabajos_tipos_tareas 
        ORDER BY descripcion
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT * 
        FROM ordenes_trabajos_tipos_tareas 
        WHERE activo = ?
        ORDER BY descripcion
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM ordenes_trabajos_tipos_tareas  
        WHERE id = ?
    `, [id])
}

exports.getByDesc = desc => {
    return queryMYSQL(`
        SELECT * 
        FROM ordenes_trabajos_tipos_tareas 
        WHERE descripcion = ?
    `, [desc])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO ordenes_trabajos_tipos_tareas (descripcion, desc_corta) 
        VALUES (?,?)
    `, [o.descripcion, o.desc_corta])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE ordenes_trabajos_tipos_tareas 
        SET descripcion=?, desc_corta = ?, activo=? 
        WHERE id=?
    `, [o.descripcion, o.desc_corta, o.activo, o.id])
}

exports.delete = id => {
    return queryMYSQL(`
        DELETE FROM ordenes_trabajos_tipos_tareas 
        WHERE id = ?
    `, [id])
}

exports.puedoEliminarByTipoTarea = idTipoTarea => {
	return queryMYSQL(`
        SELECT IF(COUNT(*) > 0, 0, 1) AS puedoEliminar
        FROM ordenes_trabajos_tareas 
        WHERE id_tipo_tarea_fk = ?
    `, [idTipoTarea])
}