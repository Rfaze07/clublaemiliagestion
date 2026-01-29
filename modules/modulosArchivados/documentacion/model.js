const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
        SELECT d.*, td.descripcion AS tipoDocumentacionTxt
        FROM documentacion d
        LEFT JOIN tipos_documentacion td ON td.id = d.id_tipodocumentacion_fk 
        ORDER BY d.descripcion
    `, [])
}

exports.getAllbyActivo = (a) => {
	return queryMYSQL(`
        SELECT d.*, td.descripcion AS tipoDocumentacionTxt
        FROM documentacion d
        LEFT JOIN tipos_documentacion td ON td.id = d.id_tipodocumentacion_fk 
        WHERE activo = ?
        ORDER BY d.descripcion
    `, [a])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT d.*, td.descripcion AS tipoDocumentacionTxt
        FROM documentacion d
        LEFT JOIN tipos_documentacion td ON td.id = d.id_tipodocumentacion_fk 
        WHERE d.id = ?
    `, [id])
}

exports.getDocumentacionActivoByIdTipoDoc = id => {
	return queryMYSQL(`
        SELECT * 
        FROM documentacion 
        WHERE id_tipodocumentacion_fk = ? AND activo = 1
    `, [id])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO documentacion (desc_corta, descripcion, observaciones, id_tipodocumentacion_fk, dias_vigencia, dias_alarma)
        VALUES (?,?,?,?,?,?)
    `, [o.descCorta, o.descripcion, o.observaciones, o.tipoDocumentacion, o.diasVigencia, o.diasAlarma])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE documentacion 
        SET desc_corta=?, descripcion=?, observaciones=?, id_tipodocumentacion_fk=?, dias_vigencia=?, dias_alarma=?, activo=? 
        WHERE id=?
    `, [o.descCorta, o.descripcion, o.observaciones, o.tipoDocumentacion, o.diasVigencia, o.diasAlarma, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM marcas WHERE id = ?
    `, [id])
}