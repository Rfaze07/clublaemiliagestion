const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT * 
        FROM conceptos 
        ORDER BY descripcion
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT *, if(tipo = "i", "Ingreso", "Egreso") as tipoTxt
        FROM conceptos 
        WHERE activo = ?
        ORDER BY descripcion
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM conceptos  
        WHERE id = ?
    `, [id])
}

exports.getByDesc = async desc => {
    return queryMYSQL(`
        SELECT *
        FROM conceptos c
        WHERE d.descripcion = ?
    `, [desc])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO conceptos (descripcion, desc_corta, tipo, activo_flujo, editable) 
        VALUES (?,?,?,?,?)
    `, [o.descripcion, o.descCorta, o.tipo, o.activoFlujo, o.editable])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE conceptos 
        SET descripcion=?, desc_corta=?, activo=?, tipo=?, activo_flujo=?, editable=? 
        WHERE id=?
    `, [o.descripcion, o.descCorta, o.activo, o.tipo, o.activoFlujo, o.editable, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM conceptos 
        WHERE id = ?
    `, [id])
}