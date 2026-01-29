const { queryMYSQL } = require("../../database")


exports.execQuery = (q, p) => {
	return queryMYSQL(q, p)
}

exports.getAll = () => {
	return queryMYSQL(`
        SELECT v.*, tv.descripcion AS tipoVehiculoTxt, m.descripcion AS marcaTxt 
        FROM vehiculos v
        LEFT JOIN tipos_vehiculos tv ON tv.id = v.id_tipovehiculo_fk 
        LEFT JOIN marcas m ON m.id = v.id_marca_fk 
        ORDER BY ISNULL(v.nro_interno), v.nro_interno ASC, v.patente
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT v.*, tv.descripcion AS tipoVehiculoTxt, m.descripcion AS marcaTxt 
        FROM vehiculos v
        LEFT JOIN tipos_vehiculos tv ON tv.id = v.id_tipovehiculo_fk 
        LEFT JOIN marcas m ON m.id = v.id_marca_fk 
        WHERE v.activo = ?
        ORDER BY ISNULL(v.nro_interno), v.nro_interno ASC, v.patente
    `, [a])
}

exports.getNroInternoExiste = nroInterno => {
	return queryMYSQL(`
        SELECT IF(COUNT(*) > 0, 1, 0) AS existe
        FROM vehiculos
        WHERE nro_interno = ?
    `, [nroInterno])
}

exports.getAllCamionesbyActivo = () => {
	return queryMYSQL(`
        SELECT v.*, tv.descripcion AS tipoVehiculoTxt, m.descripcion AS marcaTxt 
        FROM vehiculos v
        LEFT JOIN tipos_vehiculos tv ON tv.id = v.id_tipovehiculo_fk 
        LEFT JOIN marcas m ON m.id = v.id_marca_fk 
        WHERE v.activo = 1 AND v.id_tipovehiculo_fk = 2 
        ORDER BY v.patente
    `, [])
}

exports.getAllSemisbyActivo = () => {
	return queryMYSQL(`
        SELECT v.*, tv.descripcion AS tipoVehiculoTxt, m.descripcion AS marcaTxt 
        FROM vehiculos v
        LEFT JOIN tipos_vehiculos tv ON tv.id = v.id_tipovehiculo_fk 
        LEFT JOIN marcas m ON m.id = v.id_marca_fk 
        WHERE v.activo = 1 AND tv.asigna_chofer = 0
        ORDER BY v.patente
    `, [])
}

exports.getById = id => {
	return queryMYSQL(`
       SELECT v.*, tv.descripcion AS tipoVehiculoTxt, m.descripcion AS marcaTxt,
              tv.asigna_chofer, tv.asigna_semi, 
              e.nro_legajo AS nroLegajoTxt, CONCAT(e.apellido, ', ', e.nombre) AS choferTxt,
              vSemi.nro_interno AS nroIntSemiTxt, 
              vSemi.patente AS patenteSemiTxt
        FROM vehiculos v
        LEFT JOIN tipos_vehiculos tv ON tv.id = v.id_tipovehiculo_fk 
        LEFT JOIN marcas m ON m.id = v.id_marca_fk 
        LEFT JOIN empleados e ON e.id = v.id_chofer_fk
        LEFT JOIN vehiculos vSemi ON vSemi.id = v.id_semi_fk
        WHERE v.id = ?
    `, [id])
}

exports.getByDesc = async desc => {
    return queryMYSQL(`
        SELECT * 
        FROM vehiculos c 
        WHERE d.descripcion = ?
    `, [desc])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO vehiculos (nro_interno, patente, id_marca_fk, id_tipovehiculo_fk, modelo, anio, 
                id_camion_fk, id_chofer_fk, id_semi_fk, ejes, tara, nro_chasis, nro_motor, 
                cargas_peligrosas, habilitado_interno, mas_datos) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `, [o.nroInterno, o.patente, o.marca, o.tipoVehiculo, o.modelo, o.anio, o.camion, o.chofer, o.semi,
        o.ejes, o.tara, o.nroChasis, o.nroMotor, o.cargasPeligrosas, o.interno, o.masDatos])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE vehiculos 
        SET patente=?, id_marca_fk=?, id_tipovehiculo_fk=?, modelo=?, anio=?, ejes=?, tara=?, id_camion_fk=?, 
                id_chofer_fk=?, id_semi_fk=?, nro_chasis=?, nro_motor=?, cargas_peligrosas=?, 
                habilitado_interno=?, mas_datos=?, activo=? 
        WHERE id=?
    `, [o.patente, o.marca, o.tipoVehiculo, o.modelo, o.anio, o.ejes, o.tara, o.camion, o.chofer, 
        o.semi, o.nroChasis, o.nroMotor, o.cargasPeligrosas, o.interno, o.masDatos, o.activo, o.id])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM vehiculos WHERE id = ?
    `, [id])
}

exports.getAllByMarca = async id_marca_fk => {
	return queryMYSQL(`
        SELECT v.*, tv.descripcion AS tipoVehiculoTxt, m.descripcion AS marcaTxt 
        FROM vehiculos v
        LEFT JOIN tipos_vehiculos tv ON tv.id = v.id_tipovehiculo_fk 
        LEFT JOIN marcas m ON m.id = v.id_marca_fk 
        WHERE v.id_marca_fk = ?
        ORDER BY v.patente
    `, [id_marca_fk])
}

exports.getAllByTipoVehiculo = async id_tipovehiculo_fk => {
	return queryMYSQL(`
        SELECT v.*, tv.descripcion AS tipoVehiculoTxt, m.descripcion AS marcaTxt 
        FROM vehiculos v
        LEFT JOIN tipos_vehiculos tv ON tv.id = v.id_tipovehiculo_fk 
        LEFT JOIN marcas m ON m.id = v.id_marca_fk 
        WHERE v.id_tipovehiculo_fk = ?
        ORDER BY v.patente
    `, [id_tipovehiculo_fk])
}

exports.getAllCamionesChoferesActivos = () => {
	return queryMYSQL(`
        SELECT v.*, tv.descripcion AS tipoVehiculoTxt, m.descripcion AS marcaTxt, 
            CONCAT(e.apellido, ', ', e.nombre) AS choferTxt
        FROM vehiculos v
        LEFT JOIN tipos_vehiculos tv ON tv.id = v.id_tipovehiculo_fk 
        LEFT JOIN marcas m ON m.id = v.id_marca_fk 
        LEFT JOIN empleados e ON e.id = v.id_chofer_fk 
        WHERE v.activo = 1 AND tv.asigna_chofer = 1 AND tv.asigna_semi = 1 AND v.id_chofer_fk > 0
        ORDER BY v.patente
    `, [])
}

exports.getChoferByIdCamion = idCamion => {
	return queryMYSQL(`
        SELECT e.id, CONCAT(e.apellido, ', ', e.nombre) AS choferTxt
        FROM vehiculos v
        LEFT JOIN empleados e ON e.id = v.id_chofer_fk 
        WHERE v.id = ?
    `, [idCamion])
}


exports.getCamionesByTipoVehiculo = idCamion => {
	return queryMYSQL(`
        SELECT id, patente, nro_interno 
        FROM vehiculos v
        WHERE id_tipovehiculo_fk = ?
    `, [idCamion])
}