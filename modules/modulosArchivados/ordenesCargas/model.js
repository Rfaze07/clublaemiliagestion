const { queryMYSQL } = require("../../database")


exports.getAll = () => {
	return queryMYSQL(`
       SELECT oc.*, 
            (SELECT oce.descripcion
            FROM ordenes_cargas_estados_historico oceh 
            LEFT JOIN ordenes_cargas_estados oce ON oce.id = oceh.id_estado_fk 
            WHERE oceh.id_ordencarga_fk = oc.id
            ORDER BY oceh.fecha_real DESC 
            LIMIT 1) AS estadoTxt
        FROM ordenes_cargas oc
        GROUP BY oc.id 
    `, [])
}

// exports.getAllbyActivo = a => {
// 	return queryMYSQL(`
//         SELECT oc.*
//         FROM ordenes_cargas oc
//         ORDER BY oc.fecha DESC
//     `, [a])
// }

exports.getById = id => {
	return queryMYSQL(`
        SELECT oc.*, oce.descripcion AS estadoOrdenCarga
        FROM ordenes_cargas oc
        LEFT JOIN ordenes_cargas_estados_historico oceh ON oceh.id_ordencarga_fk = oc.id 
        LEFT JOIN ordenes_cargas_estados oce ON oce.id = oceh.id_estado_fk 
        WHERE oc.id = ?
    `, [id])
}

exports.getDocumentacionActivoByIdTipoDoc = id => {
	return queryMYSQL(`
        SELECT * 
        FROM documentacion 
        WHERE id_tipodocumentacion_fk = ? AND activo = 1
    `, [id])
}

exports.getEstadosDisponiblesByIdOrdenCarga = id => {
    return queryMYSQL(`
        SELECT oce.id, oce.descripcion
        FROM ordenes_cargas_estados oce 
        WHERE oce.id > (SELECT id_estado_fk 
                        FROM ordenes_cargas_estados_historico 
                        WHERE id_ordencarga_fk = ? 
                        ORDER BY fecha_real DESC 
                        LIMIT 1)
    `, [id])
}

exports.insertEstadoOC = (idOrdenCarga, estado, unica) => {
    return queryMYSQL(`
        INSERT INTO ordenes_cargas_estados_historico (id_ordencarga_fk, id_estado_fk, fecha_real, id_unica_fk)
        VALUES (?,?,NOW(),?)
    `, [idOrdenCarga, estado, unica])
}

exports.updateBorrado = (unica, idOrdenCarga) => {
    return queryMYSQL(`
        UPDATE ordenes_cargas_estados_historico 
        SET borrado = 1, id_unica_fk=?
        WHERE id = (SELECT id
                    FROM ordenes_cargas_estados_historico
                    WHERE id_ordencarga_fk = ?
                    ORDER BY fecha_real DESC
                    LIMIT 1)
    `, [unica, idOrdenCarga])
}

exports.updateChofer = o => {
    return queryMYSQL(`
        UPDATE ordenes_cargas 
        SET id_chofer_fk=?, chofer=?, id_camion_fk=?, camion=?, id_semi_fk=?, semi=? 
        WHERE id=?
    `, [o.idChofer, o.chofer, o.idCamion, o.camion, o.idSemi, o.semi, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM marcas WHERE id = ?
    `, [id])
}

exports.getAllByUnmed = async id_unmed_fk => {
	return queryMYSQL(`
       SELECT oc.*
        FROM ordenes_cargas oc
        where oc.id_unmed_fk = ?
    `, [id_unmed_fk])
}

exports.getAllByEstadosOrdenes = async id_estado_fk => {
	return queryMYSQL(`
       SELECT oce.descripcion
        FROM ordenes_cargas_estados_historico oceh 
        LEFT JOIN ordenes_cargas_estados oce ON oce.id = oceh.id_estado_fk 
        WHERE oceh.id_estado_fk = ?
        
            
    `, [id_estado_fk])
}



//=====================================================
//          PASO 1: ORDEN DE CARGA
//=====================================================

exports.insert1 = o => {
    return queryMYSQL(`
        INSERT INTO ordenes_cargas (fecha_carga, hora_carga, id_empresa_fk, id_cliente_fk, cliente, id_envio, 
                id_provincia_origen_fk, provincia_origen, id_localidad_origen_fk, localidad_origen, 
                localidad_origen_cp, id_provincia_destino_fk, provincia_destino, id_localidad_destino_fk, 
                localidad_destino, localidad_destino_cp, observaciones, fecha_real, id_unica_fk)
        VALUES (?,?,1,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),?)
    `, [o.fechaCarga, o.horaCarga, o.cliente, o.clienteTxt, o.idEnvio, 
        o.provinciaO, o.provinciaOTxt, o.localidadO, o.localidadesOTxt, 
        o.cpO, o.provinciaD, o.provinciaDTxt, o.localidadD, 
        o.localidadesDTxt, o.cpD, o.observaciones, o.unica])
}

exports.update1 = o => {
    return queryMYSQL(`
        UPDATE ordenes_cargas 
        SET fecha_carga=?, hora_carga=?, id_empresa_fk=?, id_cliente_fk=?, cliente=?, id_envio=?, 
            id_provincia_origen_fk=?, provincia_origen=?, id_localidad_origen_fk=?, localidad_origen=?, 
            localidad_origen_cp=?, id_provincia_destino_fk=?, provincia_destino=?, id_localidad_destino_fk=?, 
            localidad_destino=?, localidad_destino_cp=?, observaciones=?, activo=? 
        WHERE id=?
    `, [o.fechaCarga, o.horaCarga, o.cliente, o.clienteTxt, o.idEnvio, 
        o.provinciaO, o.provinciaOTxt, o.localidadO, o.localidadesOTxt, 
        o.cpO, o.provinciaD, o.provinciaDTxt, o.localidadD, 
        o.localidadesDTxt, o.cpD, o.observaciones, o.unica. o.activo, o.id])
}


//=====================================================
//          PASO 2: PRODUCTOS
//=====================================================

exports.getListaProductosAjax = idOrdenCarga => {
    return queryMYSQL(`
        SELECT ocp.*, u.descripcion AS uniMedTxt
        FROM ordenes_cargas_productos ocp
        LEFT JOIN unmed u ON u.id = ocp.id_unmed_fk 
        WHERE ocp.id_ordencarga_fk = ?
    `, [idOrdenCarga])
}

exports.getProductoById = id => {
    return queryMYSQL(`
        SELECT * 
        FROM ordenes_cargas_productos 
        WHERE id = ?
    `, [id])
}

exports.getProductoExisteByIdOrdenCarga = (id, idOrdenCarga) => {
    return queryMYSQL(`
        SELECT * 
        FROM ordenes_cargas_productos 
        WHERE id_producto_fk = ? AND id_ordencarga_fk = ?
    `, [id, idOrdenCarga])
}

exports.insert2 = o => {
    return queryMYSQL(`
        INSERT INTO ordenes_cargas_productos (id_ordencarga_fk, cantidad, id_producto_fk, 
                                            producto, desc_corta, id_unmed_fk, observaciones)
        VALUES (?,?,?,?,?,?,?)
    `, [o.idOrdenCarga, o.cantidad, o.producto, o.productoTxt, 
        o.descProducto, o.uniMed, o.observaciones])
}

exports.update2 = o => {
    return queryMYSQL(`
        UPDATE ordenes_cargas_productos
        SET cantidad=?, id_producto_fk=?, producto=?, desc_corta=?, id_unmed_fk=?, observaciones=?
        WHERE id=?
    `, [o.cantidad, o.producto, o.productoTxt, o.descProducto, o.uniMed, o.observaciones, o.id])
}

exports.delete2 = id => {
    return queryMYSQL(`
        DELETE FROM ordenes_cargas_productos 
        WHERE id=?
    `, [id])
}




//=====================================================
//          PASO 2: PRODUCTOS
//=====================================================

exports.getListaRepartosAjax = idOrdenCarga => {
    return queryMYSQL(`
        SELECT ocr.id, ocr.orden, p.descripcion AS provinciaTxt, l.descripcion AS localidadTxt, l.cp 
        FROM ordenes_cargas_repartos ocr 
        LEFT JOIN provincias p ON p.id = ocr.id_provincia_fk 
        LEFT JOIN localidades l ON l.id = ocr.id_localidad_fk
        WHERE ocr.id_ordencarga_fk = ?
    `, [idOrdenCarga])
}

exports.getUltOrdenReparto = idOrdenCarga => {
    return queryMYSQL(`
        SELECT IFNULL(MAX(orden), 0)+1 AS ultimo 
        FROM ordenes_cargas_repartos 
        WHERE id_ordencarga_fk = ?
    `, [idOrdenCarga])
}

exports.getRepartoById = id => {
    return queryMYSQL(`
        SELECT * 
        FROM ordenes_cargas_repartos 
        WHERE id = ?
    `, [id])
}

exports.getRepartoExisteByIdOrdenCarga = id => {
    return queryMYSQL(`
        SELECT * 
        FROM ordenes_cargas_productos 
        WHERE id = ?
    `, [id])
}

exports.insert3 = o => {
    return queryMYSQL(`
        INSERT INTO ordenes_cargas_repartos (id_ordencarga_fk, orden, id_provincia_fk, id_localidad_fk, observaciones)
        VALUES (?,?,?,?,?)
    `, [o.idOrdenCarga, o.orden, o.provincia, o.localidad, o.observaciones])
}

exports.update3 = o => {
    return queryMYSQL(`
        UPDATE ordenes_cargas_repartos
        SET orden=?, id_provincia_fk=?, id_localidad_fk=?, observaciones=?
        WHERE id=?
    `, [o.orden, o.provincia, o.localidad, o.observaciones, o.id])
}

exports.delete3 = id => {
    return queryMYSQL(`
        DELETE FROM ordenes_cargas_repartos 
        WHERE id=?
    `, [id])
}