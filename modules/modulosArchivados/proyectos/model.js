
const { queryMYSQL } = require("../../database")

exports.getAll = () => {
	return queryMYSQL(`
        SELECT pt.*, c.razon_social AS clienteTxt, l.descripcion AS localidadTxt, pr.descripcion AS provinciaTxt, ce.descripcion AS estadoTxt
        FROM proyectos_titulos pt
        LEFT JOIN clientes c ON pt.id_cliente_fk = c.id
        LEFT JOIN localidades l ON pt.id_localidad_fk = l.id
        LEFT JOIN provincias pr ON l.id_provincia_fk = pr.id
        LEFT JOIN cotizaciones_estados ce ON ce.id = pt.id_estado_fk 
        ORDER BY pt.descripcion
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT pt.*, c.razon_social AS clienteTxt, l.descripcion AS localidadTxt, pr.descripcion AS provinciaTxt, ce.descripcion AS estadoTxt
        FROM proyectos_titulos pt
        LEFT JOIN clientes c ON pt.id_cliente_fk = c.id
        LEFT JOIN localidades l ON pt.id_localidad_fk = l.id
        LEFT JOIN provincias pr ON l.id_provincia_fk = pr.id
        LEFT JOIN cotizaciones_estados ce ON ce.id = pt.id_estado_fk 
        WHERE pt.activo = ?
        ORDER BY pt.descripcion
    `, [a])
}

exports.getById = id => {
    return queryMYSQL(`
        SELECT pt.*, ce.descripcion AS estadoTxt, l.descripcion AS localidadTxt, l.cp, pr.descripcion AS provinciaTxt, 
                pr.id AS id_provincia_fk, c.razon_social AS clienteTxt, c.nro_documento AS cuit 
        FROM proyectos_titulos pt
        LEFT JOIN clientes c ON pt.id_cliente_fk = c.id
        LEFT JOIN localidades l ON pt.id_localidad_fk = l.id
        LEFT JOIN provincias pr ON l.id_provincia_fk = pr.id
        LEFT JOIN cotizaciones_estados ce ON ce.id = pt.id_estado_fk 
        WHERE pt.id = ?
    `, [id])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO proyectos_titulos (id_cliente_fk, fecha, descripcion, desc_corta, 
                responsable, email_responsable, tel_responsable, id_localidad_fk, observacion)
        VALUES (?,?,?,?,?,?,?,?,?)
    `, [o.cliente, o.fecha, o.descripcion, o.descCorta, o.responsable, 
        o.mailRes, o.telefonoRes, o.localidad, o.observaciones])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE proyectos_titulos
        SET id_cliente_fk=?, fecha=?, descripcion=?, desc_corta=?, responsable=?, email_responsable=?, 
                tel_responsable=?, id_localidad_fk=?, observacion=?, activo=?
        WHERE id=?
    `,[o.cliente, o.fecha, o.descripcion, o.descCorta, o.responsable,  o.mailRes, 
        o.telefonoRes, o.localidad, o.observaciones, o.activo, o.id])
}

exports.delete = id => {
    return queryMYSQL(`DELETE from proyectos_titulos WHERE id=?`, [id])
}

exports.getProyectoTituloById = id => {
	return queryMYSQL(`
        SELECT pt.*, c.razon_social AS clienteTxt, l.descripcion AS localidadTxt, 
                l.cp, p.id AS id_provincia_fk, p.descripcion AS provinciaTxt, ce.descripcion AS estadoTxt
        FROM proyectos_titulos pt 
        LEFT JOIN clientes c ON c.id = pt.id_cliente_fk 
        LEFT JOIN localidades l ON l.id = pt.id_localidad_fk 
        LEFT JOIN provincias p ON p.id = l.id_provincia_fk 
        LEFT JOIN cotizaciones_estados ce ON ce.id = pt.id_estado_fk 
        WHERE pt.id = ?
    `, [id])
}

exports.getProyectoItemsById = id => {
	return queryMYSQL(`
        SELECT pd.*, u.descripcion AS unidadMedidaTxt, c.descripcion AS cargoTxt
        FROM proyectos_detalles pd 
        LEFT JOIN tareas t ON t.id = pd.id_tarea_fk 
        LEFT JOIN unmed u ON u.id = t.id_unmed_fk 
        LEFT JOIN cargos c ON c.id = pd.id_cargo_fk 
        WHERE pd.id_proyectotitulo_fk = ?
    `, [id])
}

exports.getTotalProyectoByIdTitulo = idProyectoItem => {
	return queryMYSQL(`
        SELECT IFNULL(SUM(precio), 0) AS total 
        FROM proyectos_detalles 
        WHERE id_proyectotitulo_fk = ?
    `, [idProyectoItem])
}

exports.insertItem = o => {
    return queryMYSQL(`
        INSERT INTO proyectos_detalles (id_proyectotitulo_fk, cantidad, precio, id_tarea_fk, tarea, porce_kpi, observaciones, id_cargo_fk) 
        VALUES (?,?,?,?,?,?,?,?)
    `, [o.idProyectoItem, o.cantidad, o.precio, o.idTarea, o.tarea, o.kpi, o.observaciones, o.idCargo])
}

exports.updateProyectoEstado = (estado, id) => {
    return queryMYSQL(`
        UPDATE proyectos_titulos 
        SET id_estado_fk=?
        WHERE id=?
    `, [estado, id])
}

exports.updateCotizacionEstado = (estado, id) => {
    return queryMYSQL(`
        UPDATE proyectos_titulos 
        SET id_estado_fk=?
        WHERE id=?
    `, [estado, id])
}


exports.getAllAceptados = () => {
    return queryMYSQL(`
        SELECT * 
        FROM proyectos_titulos 
        WHERE activo = 1 AND id_estado_fk = 3
    `, [])
}

exports.getByIdCliente = idCliente => {
    return queryMYSQL(`
        SELECT * 
        FROM proyectos_titulos 
        WHERE id_cliente_fk = ? AND activo = 1
    `, [idCliente])
}

exports.getByIdClienteAceptados = idCliente => {
    return queryMYSQL(`
        SELECT * 
        FROM proyectos_titulos 
        WHERE id_cliente_fk = ? AND activo = 1 AND id_estado_fk = 3
    `, [idCliente])
}

exports.getProyectoItemsEmpleadosById = (id, idCargo) => {
	return queryMYSQL(`
        SELECT pd.*, u.descripcion AS unidadMedidaTxt, c.descripcion AS cargoTxt
        FROM proyectos_detalles pd 
        LEFT JOIN tareas t ON t.id = pd.id_tarea_fk 
        LEFT JOIN unmed u ON u.id = t.id_unmed_fk 
        LEFT JOIN cargos c ON c.id = pd.id_cargo_fk 
        WHERE pd.id_proyectotitulo_fk = ? AND pd.id_cargo_fk >= ?
    `, [id, idCargo])
}