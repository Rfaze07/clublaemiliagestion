const { queryMYSQL } = require("../../database")


// exports.getAll = () => {
// 	return queryMYSQL(`
//         SELECT * 
//         FROM ordenes_trabajos_tipos ott
//         ORDER BY ott.descripcion 
//     `, [])
// }

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT * 
        FROM tipos_movimientos
        WHERE activo = ? 
        ORDER BY descripcion 
    `, [a])
}

// exports.getById = id => {
// 	return queryMYSQL(`
//         SELECT *
//         FROM ordenes_trabajos_tipos 
//         WHERE id = ?
//     `, [id])
// }

// exports.insert = o => {
//     return queryMYSQL(`
//         INSERT INTO ordenes_trabajos_tipos (descripcion, desc_corta) 
//         VALUES (?,?)
//     `, [o.descripcion, o.desc_corta])
// }

// exports.update = o => {
//     return queryMYSQL(`
//         UPDATE ordenes_trabajos_tipos 
//         SET descripcion=?, desc_corta=?, activo=? 
//         WHERE id=?
//     `, [o.descripcion, o.desc_corta, o.activo, o.id])
// }

// exports.delete = async id => {
//     return queryMYSQL(`
//         DELETE FROM ordenes_trabajos_tipos 
//         WHERE id = ?
//     `, [id])
// }