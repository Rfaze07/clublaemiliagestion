const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT * 
        FROM tipos_vehiculos 
        ORDER BY descripcion
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT * 
        FROM tipos_vehiculos 
        WHERE activo = ?
        ORDER BY descripcion
    `, [a])
}

exports.getTipoSeleccionadoAjax = id => {
	return queryMYSQL(`
        SELECT asigna_chofer, asigna_semi
        FROM tipos_vehiculos tv
        WHERE id = ?
    `, [id])
}

exports.getTipoSeleccionadoChoferAjax = () => {
	return queryMYSQL(`
        SELECT id, desc_corta, descripcion
        FROM tipos_vehiculos tv
        WHERE asigna_chofer = 1
    `, [])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM tipos_vehiculos  
        WHERE id = ?
    `, [id])
}

exports.getByDesc = async desc => {
    return queryMYSQL(`
        SELECT * 
        FROM tipos_vehiculos c 
        WHERE d.descripcion = ?
    `, [desc])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO tipos_vehiculos (desc_corta, descripcion, ejes, largo, asigna_chofer, asigna_semi) 
        VALUES (?,?,?,?,?,?)
    `, [o.desc_corta, o.descripcion, o.ejes, o.largo, o.asignaChofer, o.asignaSemi])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE tipos_vehiculos 
        SET descripcion=?, desc_corta = ?, activo=?, ejes=?, largo=?, asigna_chofer=?, asigna_semi=?
        WHERE id=?
    `, [o.descripcion, o.desc_corta, o.activo, o.ejes, o.largo, o.asignaChofer, o.asignaSemi, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM tipos_vehiculos 
        WHERE id = ?
    `, [id])
}