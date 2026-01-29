const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT * 
        FROM depositos 
        ORDER BY descripcion
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT * 
        FROM depositos 
        WHERE activo = ?
        ORDER BY descripcion
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM depositos  
        WHERE id = ?
    `, [id])
}

exports.getByDesc = async desc => {
    return queryMYSQL(`
        SELECT * 
        FROM depositos c 
        WHERE d.descripcion = ?
    `, [desc])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO depositos (descripcion, desc_corta, ubicacion, observaciones) 
        VALUES (?,?, ?, ?)
    `, [o.descripcion, o.desc_corta, o.ubicacion, o.observacion])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE depositos 
        SET descripcion=?, desc_corta = ?, activo=?, ubicacion=?, observaciones=?
        WHERE id=?
    `, [o.descripcion, o.desc_corta, o.activo, o.ubicacion, o.observacion, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM depositos WHERE id = ?
    `, [id])
}

exports.puedoEliminarByDeposito = idDeposito => {
	return queryMYSQL(`
        SELECT IF(COUNT(*) > 0, 0, 1) AS puedoEliminar
        FROM repuestos 
        WHERE id_deposito_fk = ?
    `, [idDeposito])
}