const { queryMYSQL } = require("../../database");

exports.getAll = () => {
	return queryMYSQL(`
        SELECT * 
        FROM medios_pagos 
        ORDER BY descripcion
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT * 
        FROM medios_pagos 
        where activo = ?
        ORDER BY descripcion
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM medios_pagos  
        WHERE id = ?
    `, [id])
}

exports.getByDesc = async desc => {
    return queryMYSQL(`select * from medios_pagos c where d.descripcion = ?`, [desc])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO medios_pagos (descripcion, desc_corta) 
        VALUES (?,?)
    `, [o.descripcion, o.desc_corta])
}

exports.update = o => {
    console.log('UPDATEO')
    return queryMYSQL(`
        UPDATE medios_pagos 
        SET descripcion=?, desc_corta = ?, activo=? 
        WHERE id=?
    `, [o.descripcion, o.desc_corta, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`delete from medios_pagos where id = ?`, [id])
}