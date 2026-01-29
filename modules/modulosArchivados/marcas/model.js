const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT * 
        FROM marcas 
        ORDER BY descripcion
    `, [])
}

exports.getAllbyActivo = (a) => {
	return queryMYSQL(`
        SELECT * 
        FROM marcas 
        WHERE activo = ?
        ORDER BY descripcion
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM marcas  
        WHERE id = ?
    `, [id])
}

exports.getByDesc = async desc => {
    return queryMYSQL(`
        SELECT * 
        FROM marcas c 
        WHERE d.descripcion = ?
    `, [desc])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO marcas (descripcion, desc_corta) 
        VALUES (?,?)
    `, [o.descripcion, o.desc_corta])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE marcas 
        SET descripcion=?, desc_corta = ?, activo=? 
        WHERE id=?
    `, [o.descripcion, o.desc_corta, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM marcas WHERE id = ?
    `, [id])
}