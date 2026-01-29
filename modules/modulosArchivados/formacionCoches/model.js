const { queryMYSQL } = require("../../database")


exports.execQuery = (q, p) => {
    return queryMYSQL(q, p)
}




/*
exports.getComponentesByVehiculo = (id) => {
  return queryMYSQL(
    `
       SELECT
    ultimos.vehiculo_id,
    r.descripcion AS repuesto_descripcion,
    rf.nro_serie,
    m.descripcion AS marca,
    CASE
        WHEN rf.neumatico = 1 THEN u.descripcion
        ELSE NULL
    END AS ubicacion
FROM (
    SELECT
        om.id_vehiculo_fk AS vehiculo_id,
        om.id_repuesto_fk,
        MAX(om.fecha) AS ultima_fecha
    FROM ot_movimientos om
    GROUP BY om.id_vehiculo_fk, om.id_repuesto_fk
) ultimos
JOIN ot_movimientos om ON
    om.id_vehiculo_fk = ultimos.vehiculo_id AND
    om.id_repuesto_fk = ultimos.id_repuesto_fk AND
    om.fecha = ultimos.ultima_fecha
JOIN repuestos r ON om.id_repuesto_fk = r.id
LEFT JOIN repuestos_ficha rf ON rf.id_repuesto_fk = r.id
LEFT JOIN marcas m ON r.id_marca_fk = m.id
LEFT JOIN ubicaciones u ON om.id_ubicacion_fk = u.id
WHERE om.id_vehiculo_fk =?;

        `,
    [id]
  );
};
*/



exports.getComponentesByVehiculo = (id) => {
  return queryMYSQL(
    `
        SELECT om.id_vehiculo_fk AS vehiculo_id, r.descripcion AS repuesto_descripcion, rf.nro_serie,
        CASE 
        WHEN rf.neumatico = 1 THEN u.descripcion
        ELSE NULL
        END AS ubicacion,
        m.descripcion AS marca
        FROM ot_movimientos om
        JOIN repuestos r ON om.id_repuesto_fk = r.id
        LEFT JOIN repuestos_ficha rf ON rf.id_repuesto_fk = r.id
        LEFT JOIN ubicaciones u ON om.id_ubicacion_fk = u.id
        LEFT JOIN marcas m ON r.id_marca_fk = m.id
        LEFT JOIN ordenes_trabajo ot.id = ot_idordentrabajo_fk
        WHERE ot.id_vehiculo_fk = ?
        `,
    [id]
  );
};




/*
exports.getComponentesByVehiculo = id =>{
    return queryMYSQL(`
        select r.*, m.descripcion as marcaTxt, v.id, u.descripcion as ubicacionTxt
        from repuestos r
        inner join ot_movimientos ot on  r.id = ot.id_repuesto_fk
        inner join vehiculos v on v.id = ot.id_vehiculo_fk
        left join ubicaciones u on u.id = ot.id_ubicacion_fk
        inner join marcas m on m.id = r.id_marca_fk
        where v.id = ?
        `, [id])
}
        */


//------------------COMPONENTES------------------------------
