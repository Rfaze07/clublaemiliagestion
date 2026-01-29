const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT * 
        FROM puestos  
        ORDER BY descripcion
    `, [])
}

exports.getAllbyActivo = (a) => {
	return queryMYSQL(`
        SELECT * 
        FROM puestos  
        WHERE activo = ?
        ORDER BY descripcion
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM puestos   
        WHERE id = ?
    `, [id])
}

exports.getByDesc = async desc => {
    return queryMYSQL(`
        SELECT * 
        FROM puestos 
        WHERE descripcion = ?
    `, [desc])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO puestos (descripcion, desc_corta) 
        VALUES (?,?)
    `, [o.descripcion, o.desc_corta])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE puestos 
        SET descripcion = ?, desc_corta = ?, activo = ? 
        WHERE id = ?
    `, [o.descripcion, o.desc_corta, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM puestos 
        WHERE id = ?
    `, [id])
}