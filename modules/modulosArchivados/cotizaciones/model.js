const { queryMYSQL } = require("../../database")

exports.execQuery = (q, p) => {
    return queryMYSQL(q, p)
}

exports.getAllByRangoFechas = o => {
	return queryMYSQL(`
        SELECT ct.*, c.razon_social AS clienteTxt, l.descripcion AS localidadTxt, l.cp, p.descripcion AS provinciaTxt, ce.descripcion AS estadoTxt
        FROM cotizaciones_titulos ct
        LEFT JOIN clientes c ON c.id = ct.id_cliente_fk 
        LEFT JOIN localidades l ON l.id = ct.id_localidad_fk 
        LEFT JOIN provincias p ON p.id = l.id_provincia_fk 
        LEFT JOIN cotizaciones_estados ce ON ce.id = ct.id_estado_fk 
        WHERE ct.fecha BETWEEN ? AND ?
    `, [o.desde, o.hasta])
}

exports.getAllEstadosActivos = () => {
    return queryMYSQL(`
        SELECT *
        FROM cotizaciones_estados
        WHERE activo = 1
    `, [])
}

exports.getCotizacionTituloById = id => {
	return queryMYSQL(`
        SELECT ct.*, c.razon_social AS clienteTxt, l.descripcion AS localidadTxt, 
                l.cp, p.id AS id_provincia_fk, p.descripcion AS provinciaTxt, ce.descripcion AS estadoTxt
        FROM cotizaciones_titulos ct
        LEFT JOIN clientes c ON c.id = ct.id_cliente_fk 
        LEFT JOIN localidades l ON l.id = ct.id_localidad_fk 
        LEFT JOIN provincias p ON p.id = l.id_provincia_fk 
        LEFT JOIN cotizaciones_estados ce ON ce.id = ct.id_estado_fk 
        WHERE ct.id = ?
    `, [id])
}

exports.getCotizacionItemsById = id => {
	return queryMYSQL(`
        SELECT cd.*, u.descripcion AS unidadMedidaTxt
        FROM cotizaciones_detalles cd
        LEFT JOIN tareas t ON t.id = cd.id_tarea_fk 
        LEFT JOIN unmed u ON u.id = t.id_unmed_fk 
        WHERE cd.id_cotizaciontitulo_fk = ?
    `, [id])
}

exports.getTotalCotizacionByIdTitulo = idCotizacionItem => {
	return queryMYSQL(`
        SELECT IFNULL(SUM(precio), 0) AS total 
        FROM cotizaciones_detalles 
        WHERE id_cotizaciontitulo_fk = ?
    `, [idCotizacionItem])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO cotizaciones_titulos (descripcion, fecha, id_cliente_fk, id_localidad_fk, observaciones) 
        VALUES (?,?,?,?,?)
    `, [o.descripcion, o.fecha, o.cliente, o.localidad, o.observaciones])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE cotizaciones_titulos
        SET descripcion=?, fecha=?, id_cliente_fk=?, id_localidad_fk=?, observaciones=?
        WHERE id=?
    `, [o.descripcion, o.fecha, o.cliente, o.localidad, o.observaciones, o.id])
}

exports.insertItem = o => {
    return queryMYSQL(`
        INSERT INTO cotizaciones_detalles (id_cotizaciontitulo_fk, id_tarea_fk, tarea, cantidad, porce_kpi, precio, observaciones) 
        VALUES (?,?,?,?,?,?,?)
    `, [o.idCotizacionItem, o.idTarea, o.tarea, o.cantidad, o.kpi, o.precio, o.observaciones])
}

exports.getItemsById = id => {
	return queryMYSQL(`
        SELECT cd.*, u.descripcion AS unidadMedidaTxt
        FROM cotizaciones_detalles cd
        LEFT JOIN tareas t ON t.id = cd.id_tarea_fk 
        LEFT JOIN unmed u ON u.id = t.id_unmed_fk 
        WHERE cd.id = ?
    `, [id])
}

exports.updateItem = o => {
	return queryMYSQL(`
        UPDATE cotizaciones_detalles
        SET id_tarea_fk=?, tarea=?, cantidad=?, porce_kpi=?, precio=?, observaciones=?
        WHERE id=?
    `, [o.idTarea, o.tarea, o.cantidad, o.kpi, o.precio, o.observaciones, o.id])
}

exports.delete = id => {
    return queryMYSQL(`DELETE FROM cotizaciones_detalles WHERE id=?`, [id])
}

exports.updateCotizacionEstado = (estado, id) => {
    return queryMYSQL(`
        UPDATE cotizaciones_titulos 
        SET id_estado_fk=?
        WHERE id=?
    `, [estado, id])
}

exports.updateCotizacionProyecto = (idProyecto, id) => {
    return queryMYSQL(`
        UPDATE cotizaciones_titulos 
        SET id_proyectotitulo_fk=?
        WHERE id=?
    `, [idProyecto, id])
}