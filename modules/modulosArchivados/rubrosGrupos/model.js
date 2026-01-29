const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT * 
        FROM rubros_grupos 
        ORDER BY descripcion
    `, [])
}

exports.getAllbyActivo = (a) => {
	return queryMYSQL(`
        SELECT * 
        FROM rubros_grupos 
        WHERE activo = ?
        ORDER BY descripcion
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM rubros_grupos  
        WHERE id = ?
    `, [id])
}

exports.getByDesc = async desc => {
    return queryMYSQL(`select * from rubros_grupos c where d.descripcion = ?`, [desc])
}

exports.insert = o => {
    return queryMYSQL(`INSERT INTO rubros_grupos (descripcion, codigo) VALUES (?,?)`, [o.descripcion, o.codigo])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE rubros_grupos 
        SET descripcion=?, codigo = ?, activo=? 
        WHERE id=?
    `, [o.descripcion, o.codigo, o.activo, o.id])
}

exports.delete = id => {
    return queryMYSQL(`
        DELETE FROM rubros_grupos 
        WHERE id = ?
    `, [id])
}

exports.puedoEliminarByRubro = id => {
	return queryMYSQL(`
        SELECT IF(COUNT(*) > 0, 0, 1) AS puedoEliminar
        FROM rubros 
        WHERE id_rubro_grupo_fk = ?
    `, [id])
}