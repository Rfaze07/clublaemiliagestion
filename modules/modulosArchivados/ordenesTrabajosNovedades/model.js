const { queryMYSQL } = require("../../database")

exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
    return queryMYSQL(`
        SELECT otn.*, i.descripcion AS imputacion, v.patente AS vehiculo
        FROM ordenes_trabajos_novedades otn
        LEFT JOIN imputaciones i ON i.id = otn.id_imputacion_fk
        LEFT JOIN vehiculos v ON v.id = otn.id_vehiculo_fk
        ORDER BY otn.descripcion 
    `, [])
}


exports.getById = id => {
    return queryMYSQL(`
       SELECT otn.*, i.descripcion AS imputacion, v.patente AS vehiculo
        FROM ordenes_trabajos_novedades otn
        LEFT JOIN imputaciones i ON i.id = otn.id_imputacion_fk
        LEFT JOIN vehiculos v ON v.id = otn.id_vehiculo_fk
        WHERE otn.id = ?
        ORDER BY otn.descripcion 
    `, [id])
}

exports.getListaByVehiculo = idVehiculo =>{
    return queryMYSQL(`
        SELECT otn.*, i.descripcion AS imputacion, v.patente as vehiculo
        FROM ordenes_trabajos_novedades otn
        LEFT JOIN imputaciones i ON i.id = otn.id_imputacion_fk
        left join vehiculos v ON v.id = otn.id_vehiculo_fk
        WHERE otn.id_vehiculo_fk = ?
        ORDER BY otn.descripcion 
    `, [idVehiculo])
}

exports.getListaByVehiculoSinOT = idVehiculo =>{
    return queryMYSQL(`
        SELECT otn.*, i.descripcion AS imputacion, v.patente as vehiculo
        FROM ordenes_trabajos_novedades otn
        LEFT JOIN imputaciones i ON i.id = otn.id_imputacion_fk
        left join vehiculos v ON v.id = otn.id_vehiculo_fk
        WHERE otn.id_vehiculo_fk = ? and otn.id_ordentrabajo_fk is null
        ORDER BY otn.descripcion 
    `, [idVehiculo])
}


exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO ordenes_trabajos_novedades (descripcion, prioridad, id_vehiculo_fk, id_imputacion_fk, fecha, id_usuariocreador_fk, estado, observaciones) 
        VALUES (?,?,?,?,curdate(),?, 'Pendiente',?)
    `, [o.descripcion, o.prioridad, o.vehiculo, o.imputacion, o.fecha, o.usuariocreador, o.observaciones])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE ordenes_trabajos_novedades
        SET descripcion=?, prioridad=?, id_vehiculo_fk=?,  id_imputacion_fk=?, id_ordentrabajo_fk=?, fecha=?, id_usuariocreador_fk=?, estado=?, observaciones=?
        WHERE id=?
    `, [o.descripcion, o.prioridad, o.vehiculo, o.imputacion, o.ordentrabajo, o.fecha, o.usuariocreador, o.estado, o.observaciones])
}

exports.delete = async id => {
     return queryMYSQL(`
         DELETE FROM ordenes_trabajos_novedades
         WHERE id = ?
     `, [id])
 }


 exports.getByImputaciones = async id =>{
    return queryMYSQL(`
        SELECT * FROM ordenes_trabajos_novedades
        WHERE id_imputacion_fk = ?
        `, [id])
}



