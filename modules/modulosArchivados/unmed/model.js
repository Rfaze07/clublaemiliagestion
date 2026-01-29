//EJEMPLO
const { queryMYSQL } = require("../../database");

exports.getAll = () => {
	return queryMYSQL(`
        SELECT * 
        FROM unmed 
        ORDER BY descripcion
    `, [])
}

exports.getAllbyActivo = (a) => {
	return queryMYSQL(`
        SELECT * 
        FROM unmed 
        where activo = ?
        ORDER BY descripcion
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM unmed  
        WHERE id = ?
    `, [id])
}

exports.getByDesc = async desc => {
    return queryMYSQL(`select * from unmed c where d.descripcion = ?`, [desc])
}

exports.insert = o => {
    return queryMYSQL(`INSERT INTO unmed (descripcion, desc_corta) VALUES (?,?)`, [o.descripcion, o.desc_corta])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE unmed 
        SET descripcion=?, desc_corta = ?, activo=? 
        WHERE id=?
    `, [o.descripcion, o.desc_corta, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`delete from unmed where id = ?`, [id])
}



