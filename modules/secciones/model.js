const { queryMYSQL } = require("../../database")


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
    return queryMYSQL(`
        SELECT *
        from secciones
        ORDER BY orden ASC
    `, [])
}

exports.getById = id => {
    return queryMYSQL(`
        SELECT *
        from secciones
        WHERE id = ?
    `, [id])
}


exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO secciones (titulo, descripcion, orden) 
        VALUES (?, ?, ?)
    `, [o.titulo, o.descripcion, o.orden])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE secciones 
        SET titulo=?, descripcion=?, orden=?, activo = ?
        WHERE id=?
    `, [o.titulo, o.descripcion, o.orden, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM secciones 
        WHERE id = ?
    `, [id])
}




//=========================SubSecciones=========================

exports.getSubSeccionesBySeccionId = seccionId => {
    return queryMYSQL(`
        SELECT *
        from sub_secciones
        WHERE id_seccion_fk = ?
        ORDER BY orden ASC
    `, [seccionId])
}

exports.insertSubSeccion = o => {
    return queryMYSQL(`
        INSERT INTO sub_secciones (id_seccion_fk, titulo, descripcion, orden) 
        VALUES (?, ?, ?, ?)
    `, [o.id_seccion_fk, o.titulo, o.descripcion, o.orden])
}

exports.updateSubSeccion = o => {
    return queryMYSQL(`
        UPDATE sub_secciones
        SET titulo=?, descripcion=?, orden=?, activo = ?
        WHERE id=?
    `, [o.titulo, o.descripcion, o.orden, o.activo, o.id])
}

exports.deleteSubSeccion = async id => {
    return queryMYSQL(`
        DELETE FROM sub_secciones 
        WHERE id = ?
    `, [id])
}
