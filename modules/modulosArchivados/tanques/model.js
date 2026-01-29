const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT t.*, a.descripcion  as  articulotxt
        FROM tanques t  
        left  join articulos a on a.id = t.id_articulo_fk
        ORDER BY t.descripcion
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT  t.*, a.descripcion  as  articulotxt
        FROM tanques t  
        left  join articulos a on a.id = t.id_articulo_fk
        WHERE t.activo = ?
        ORDER BY t.descripcion
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT t.*, a.descripcion  as  articulotxt
        FROM tanques t  
        left  join articulos a on a.id = t.id_articulo_fk
        WHERE t.id = ?
    `, [id])
}

// exports.getCapacidades = a => {
// 	return queryMYSQL(`
//         SELECT * 
//         FROM tanques  
//         WHERE activo = ?
//         ORDER BY descripcion
//     `, [a])
// }

exports.getByDesc = desc => {
    return queryMYSQL(`
        SELECT t.*, a.descripcion  as  articulotxt
        FROM tanques t  
        left  join articulos a on a.id = t.id_articulo_fk
        WHERE t.descripcion = ?
    `, [desc])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO tanques (descripcion, desc_corta, capacidad, id_articulos_fk) 
        VALUES (?,?,?)
    `, [o.descripcion, o.desc_corta, o.capacidad, o.id_articulo_fk])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE tanques 
        SET descripcion=?, desc_corta=?, capacidad=?, activo=?, id_articulo_fk =? 
        WHERE id=?
    `, [o.descripcion, o.desc_corta, o.capacidad, o.activo, o.id_articulo_fk, o.id])
}

exports.delete = id => {
    return queryMYSQL(`
        DELETE FROM tanques 
        WHERE id=?
    `, [id])
}

exports.puedoEliminarByTanque = idTanque => {
	return queryMYSQL(`
        SELECT IF(COUNT(*) > 0, 0, 1) AS puedoEliminar
        FROM gasoil 
        WHERE id_tanque_fk = ?
    `, [idTanque])
}