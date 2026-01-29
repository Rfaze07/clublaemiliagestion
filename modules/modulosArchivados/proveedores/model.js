
const { queryMYSQL } = require("../../database");


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
	return queryMYSQL(`
        SELECT p.*, ci.descripcion AS descCondIvaTxt, l.descripcion AS localidadTxt, 
                l.cp, pr.descripcion AS provinciaTxt
        FROM proveedores p
        LEFT JOIN condiciones_iva ci ON ci.id = p.id_condicioniva_fk
        LEFT JOIN localidades l ON l.id = p.id_localidad_fk
        LEFT JOIN provincias pr ON pr.id = l.id_provincia_fk 
        ORDER BY p.activo DESC, p.razon_social
    `, [])
}

exports.getAllActivos = () => {
	return queryMYSQL(`
        SELECT p.*, ci.descripcion AS descCondIvaTxt
        FROM proveedores p
        LEFT JOIN condiciones_iva ci ON ci.id = p.id_condicioniva_fk
        WHERE p.activo = 1
    `, [])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT p.*, pr.id AS id_provincia_fk 
        FROM proveedores p
        LEFT JOIN localidades l ON l.id = p.id_localidad_fk
        LEFT JOIN provincias pr ON pr.id = l.id_provincia_fk 
        WHERE p.id=?
    `, [id])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO proveedores (razon_social, nombre_fantasia, cuit, id_condicioniva_fk, id_localidad_fk, 
                                 direccion, mail, telefono, contacto, fecha_alta, observaciones)
        VALUES (?,?,?,?,?,?,?,?,?,NOW(),?)
    `, [o.razonSocial, o.nombreFantasia, o.cuit, o.condicionIva, o.localidad, 
        o.direccion, o.mail, o.telefono, o.contacto, o.observaciones])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE proveedores 
        SET razon_social=?, nombre_fantasia=?, cuit=?, id_condicioniva_fk=?, id_localidad_fk=?, direccion=?, 
            mail=?, telefono=?, contacto=?, observaciones=?, activo=? 
        WHERE id=?
    `, [o.razonSocial, o.nombreFantasia, o.cuit, o.condicionIva, o.localidad, o.direccion, o.mail, 
        o.telefono, o.contacto, o.observaciones, o.activo, o.id])
}

// exports.delete = id => {
//     return db.query(`UPDATE clientes SET activo=0 WHERE id=?`, [id])
// }