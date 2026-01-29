const { queryMYSQL } = require("../../database");


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

// exports.getAll = () => {
// 	return queryMYSQL(`
//         SELECT c.*, ci.descripcion AS descCondIvaTxt, l.descripcion AS localidadTxt, 
//                 l.cp, p.descripcion AS provinciaTxt
//         FROM clientes c
//         LEFT JOIN condiciones_iva ci ON ci.id = c.id_condicioniva_fk
//         LEFT JOIN localidades l ON l.id =c.id_localidad_fk
//         LEFT JOIN provincias p ON p.id = l.id_provincia_fk 
//         ORDER BY c.activo DESC, c.razon_social
//     `, [])
// }

exports.getAllActivos = () => {
	return queryMYSQL(`
        SELECT e.*, c.descripcion AS cargoTxt
        FROM empleados e
        LEFT JOIN cargos c ON c.id = e.id_cargo_fk 
        WHERE e.activo = 1
    `, [])
}

exports.getAllChoferesActivos = () => {
	return queryMYSQL(`
        SELECT e.*, c.descripcion AS cargoTxt
        FROM empleados e
        LEFT JOIN cargos c ON c.id = e.id_cargo_fk 
        WHERE e.activo = 1 AND e.id_cargo_fk = 5
        ORDER BY e.apellido
    `, [])
}

exports.getAllEmpleadosActivos = () => {
	return queryMYSQL(`
        SELECT e.*, c.descripcion AS cargoTxt
        FROM empleados e
        LEFT JOIN cargos c ON c.id = e.id_cargo_fk 
        WHERE e.activo = 1 AND e.id_cargo_fk != 5
        ORDER BY e.apellido
    `, [])
}

exports.getLastNroLegajo = () => {
	return queryMYSQL(`SELECT MAX(nro_legajo)+1 AS nroLegajo FROM empleados`, [])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT e.*, IFNULL(os.descripcion, '') AS obraSocialTxt, 
               IFNULL(c.descripcion, '') AS cargoTxt
        FROM empleados e 
        LEFT JOIN obras_sociales os ON os.id = e.id_obrasocial_fk 
        LEFT JOIN cargos c ON c.id = e.id_cargo_fk 
        WHERE e.id=?
    `, [id])
}

exports.getNroLegajoExiste = nroLegajo => {
	return queryMYSQL(`
        SELECT IF(COUNT(*) = 0, 0, 1) AS existe
        FROM empleados
        WHERE nro_legajo=?
    `, [nroLegajo])
}

exports.getDNIExiste = dni => {
	return queryMYSQL(`
        SELECT IF(COUNT(*) = 0, 0, 1) AS existe
        FROM empleados
        WHERE dni=?
    `, [dni])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO empleados (nro_legajo, nombre, apellido, dni, cuil, fecha_nac, celular, direccion, id_obrasocial_fk, 
                    os_numero, email, fecha_alta, id_cargo_fk, id_puesto_fk, id_provincia_fk, id_localidad_fk)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `, [o.nroLegajo, o.nombre, o.apellido, o.dni, o.cuil, o.fechaNac, o.telefono, o.direccion, o.obraSocial, 
        o.nroObraSocial, o.mail, o.fechaIng, o.cargo, o.puesto, o.provincia, o.localidad])
}// os_plan,  |   o.planObraSocial - SOLICITARON SACARLO

exports.update = o => {
    return queryMYSQL(`
        UPDATE empleados 
        SET nombre=?, apellido=?, dni=?, cuil=?, fecha_nac=?, celular=?, direccion=?, id_obrasocial_fk=?,
            os_numero=?, fecha_alta=?, fecha_baja=?, email=?, id_cargo_fk=?, id_puesto_fk=?, 
            id_provincia_fk=?, id_localidad_fk=?, activo=? 
        WHERE id=?
    `, [o.nombre, o.apellido, o.dni, o.cuil, o.fechaNac, o.telefono, o.direccion, o.obraSocial, o.nroObraSocial, 
        o.fechaIng, o.fechaEgr, o.mail, o.cargo, o.puesto, o.provincia, o.localidad, o.activo, o.id])
} // os_plan=?, |  o.planObraSocial

exports.updateFechaBajaActivo = id => {
    return queryMYSQL(`
        UPDATE empleados 
        SET fecha_baja=NOW(), activo=0
        WHERE id=?
    `, [id])
}

exports.updateActivarEmpleado = id => {
    return queryMYSQL(`
        UPDATE empleados 
        SET fecha_baja=null, activo=1
        WHERE id=?
    `, [id])
}

// exports.delete = id => {
//     return db.query(`UPDATE clientes SET activo=0 WHERE id=?`, [id])
// }

exports.getAllByObrasSocial = async id_obrasocial_fk => {
	return queryMYSQL(`
        SELECT e.*, c.descripcion AS cargoTxt
        FROM empleados e
        LEFT JOIN cargos c ON c.id = e.id_cargo_fk 
        WHERE e.id_obrasocial_fk = ?
    `, [id_obrasocial_fk])
}

exports.getAllByPuesto = async id_puesto_fk => {
	return queryMYSQL(`
        SELECT e.*, c.descripcion AS cargoTxt
        FROM empleados e
        LEFT JOIN cargos c ON c.id = e.id_cargo_fk 
        WHERE e.id_puesto_fk = ?
    `, [id_puesto_fk])
}