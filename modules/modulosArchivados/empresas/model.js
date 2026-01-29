const { queryMYSQL } = require("../../database")


exports.getEmpresas = () => {
    return queryMYSQL(`
        SELECT e.*, 
               p.descripcion AS provincia, 
               l.descripcion AS localidad
        FROM empresas e
        LEFT JOIN localidades l ON l.id = e.id_localidad_fk
        LEFT JOIN provincias p ON p.id = l.id_provincia_fk
    `)
}

exports.getAllActivas = () => {
    return queryMYSQL(`
        SELECT e.*, 
               p.descripcion AS provincia, 
               l.descripcion AS localidad
        FROM empresas e
        LEFT JOIN localidades l ON l.id = e.id_localidad_fk
        LEFT JOIN provincias p ON p.id = l.id_provincia_fk
        WHERE e.activo = 1
    `)
}

exports.getEmpresasbyId = (id) => {
    return queryMYSQL(`
        SELECT *
        FROM empresas
        WHERE id = ?
    `, [id])
}

exports.getLetraFEByEmpresa = id => {
    return queryMYSQL(`
        SELECT letra_fe
        FROM empresas
        WHERE id = ?
    `, [id])
}

exports.getCondicionesIva = () => {
    return queryMYSQL(`
        SELECT * 
        FROM condicion_iva ci
    `)
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE empresas 
        SET razon_social=?, cuit=?, direccion=?, email=?, datos=?, id_iva_fk=?, id_concepto_fk=?, fecha_inicio=?, 
            telefono=?, id_localidad_fk=?, modo_fe=?, token_fe=?, imagen=?, activo=?
        WHERE id=?
    `, [o.razonSocial, o.cuit, o.direccion, o.email, o.datos, o.condicionIva, o.concepto, o.fechaIniAct, 
        o.telefono, o.localidad, o.modo, o.token, o.imagen, o.activo, o.id])
}

exports.deleteImagen = id => {
    return queryMYSQL(`
        UPDATE empresas 
        SET imagen = NULL 
        WHERE id = ?
    `, [id])
}