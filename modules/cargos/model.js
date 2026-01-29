const { queryMYSQL } = require("../../database");

exports.getAll = () => {
	return queryMYSQL(`
        SELECT * 
        FROM cargos 
        ORDER BY descripcion
    `, [])
}

exports.getAllbyActivo = (a) => {
	return queryMYSQL(`
        SELECT * 
        FROM cargos 
        where  activo = ?
        ORDER BY descripcion
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM cargos  
        WHERE id = ?
    `, [id])
}

exports.getByDesc = async desc => {
    return queryMYSQL(`select * from cargos c where d.descripcion = ?`, [desc])
}

exports.insert = o => {
    return queryMYSQL(`INSERT INTO cargos (descripcion, desc_corta) VALUES (?,?)`, [o.descripcion, o.desc_corta])
}

exports.update = o => {
    console.log('UPDATEO')
    return queryMYSQL(`
        UPDATE cargos 
        SET descripcion=?, desc_corta = ?, activo=? 
        WHERE id=?
    `, [o.descripcion, o.desc_corta, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`delete from cargos where id = ?`, [id])
}




/**************************************************************
 * 
 *               PERMISOS/ACCESOS CARGOS
 * 
**************************************************************/

exports.verificarmenu = (id_cargo, menu) => {
	return queryMYSQL(`
        SELECT *
        FROM secr2_cargos
        WHERE id_cargo_fk=? AND menu=?
    `, [id_cargo, menu])
}

exports.insertMenu = (id_cargo, menu) => {
	return queryMYSQL(`
        INSERT INTO secr2_cargos (id_cargo_fk, menu, a, b, c, m, x)
        VALUES (?,?,0,0,0,0,0)
    `, [id_cargo, menu])
}

exports.updateAcceso = o => {
    return queryMYSQL(`
        UPDATE secr2_cargos 
        SET ${o.acceso_short}=? 
        WHERE id_cargo_fk=? AND menu=?
    `, [o.value, o.id_cargo, o.id_menu])
}

exports.getAccesosByCargo = id_cargo => {
	return queryMYSQL(`
        SELECT * 
        FROM secr2_cargos 
        WHERE id_cargo_fk = ? 
        ORDER BY menu
    `, [id_cargo])
}

exports.getLastAccesoId = id_cargo => {
	return queryMYSQL(`
        SELECT max(menu) AS menu
        FROM secr2_cargos
        WHERE id_cargo_fk = ?    
    `, [id_cargo])
}