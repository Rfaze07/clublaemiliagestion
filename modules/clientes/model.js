const { queryMYSQL } = require("../../database");


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
	return queryMYSQL(`
        SELECT c.*, ci.descripcion AS descCondIvaTxt, l.descripcion AS descLocalidadTxt, p.descripcion AS descProvinciaTxt, tda.tipoDoc AS tipoDoc
        FROM clientes c
        LEFT JOIN condiciones_iva ci ON ci.id = c.id_condicioniva_fk
        LEFT JOIN localidades l on l.id = c.id_localidad_fk
        LEFT JOIN provincias p on p.id = l.id_provincia_fk
        LEFT JOIN tipos_documentos_afip tda ON tda.id = c.id_tipo_doc_fk
        ORDER BY c.activo DESC, c.razon_social
    `, [])
}

exports.getAllActivos = () => {
	return queryMYSQL(`
        SELECT c.*, ci.descripcion AS descCondIvaTxt
        FROM clientes c
        LEFT JOIN condiciones_iva ci ON ci.id = c.id_condicioniva_fk 
        WHERE c.activo = 1
    `, [])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT c.*, ci.descripcion AS descCondIvaTxt, l.descripcion AS descLocalidadTxt, p.descripcion AS descProvinciaTxt, tda.descripcion AS tipoDoc
        FROM clientes c
        LEFT JOIN condiciones_iva ci ON ci.id = c.id_condicioniva_fk
        LEFT JOIN localidades l on l.id = c.id_localidad_fk
        LEFT JOIN provincias p on p.id = l.id_provincia_fk
        LEFT JOIN tipos_documentos_afip tda ON tda.id = c.id_tipodoc_fk
        WHERE c.id=?
    `, [id])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO clientes (razon_social, id_tipodoc_fk, nro_doc, id_condicioniva_fk, id_localidad_fk, direccion, id_provincia_fk,
            mail, telefono)
        VALUES (?,?,?,?,?,?,?,?,?)
    `, [o.razonSocial, o.tipoDoc, o.nroDoc, o.condicionIva, o.localidad, o.direccion, o.provincia, o.mail, o.telefono])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE clientes 
        SET razon_social=?, id_tipodoc_fk=?, nro_doc=?, id_condicioniva_fk=?, id_localidad_fk=?, id_provincia_fk=?, direccion=?, 
            mail=?, telefono=?
        WHERE id=?
    `, [o.razonSocial, o.tipoDoc, o.nroDoc, o.condicionIva, o.localidad, o.provincia, o.direccion, o.mail, o.telefono, o.id])
}

// exports.delete = id => {
//     return db.query(`UPDATE clientes SET activo=0 WHERE id=?`, [id])
// }