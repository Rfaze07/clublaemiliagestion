const { queryMSSQL, queryMYSQL } = require("../../database");

//TABLAS DE VENTAM
exports.getSTOCK = async () => {
  return await queryMSSQL("SELECT * FROM STOCK");
};

exports.getMARCAS = async () => {
  return await queryMSSQL("SELECT * FROM MARCAS");
};

exports.getRUBROS = async () => {
  return await queryMSSQL("SELECT * FROM RUBROS");
};

exports.getFAMILIAS = async () => {
  return await queryMSSQL("SELECT * FROM FAMILIAS");
};

exports.getPROVEEDORES = async () => {
  return await queryMSSQL("SELECT * FROM PROVEEDORES");
};

//TABLAS DE LOGISTICA_VM

/*Familias*/
exports.getFAMILIAS_LOGISTICA = async () => {
  return await queryMYSQL("SELECT * FROM FAMILIAS");
};

exports.insertFAMILIAS_LOGISTICA = async (familia) => {
  return await queryMYSQL(
    `INSERT INTO FAMILIAS (id,descripcion,codigo) VALUES (?,?,?)`,
    [familia.codigo, familia.nombre, familia.codigo]
  );
};

exports.updateFAMILIAS_LOGISTICA = async (familia) => {
  return await queryMYSQL(
    `UPDATE FAMILIAS SET descripcion = ?,fecha_actualizacion=? , codigo = ? WHERE id = ?`,
    [familia.descripcion, familia.fecha_actualizacion, familia.codigo, familia.id]
  );
};

/*Rubros*/
exports.getRUBROS_LOGISTICA = async () => {
  return await queryMYSQL("SELECT * FROM RUBROS");
};

exports.insertRUBROS_LOGISTICA = async (rubro) => {
  return await queryMYSQL(
    `INSERT INTO RUBROS (id,descripcion,fecha_actualizacion, codigo) VALUES (?,?,?,?)`,
    [rubro.id, rubro.descripcion, rubro.fecha_actualizacion, rubro.codigo]
  );
};

exports.updateRUBROS_LOGISTICA = async (rubro) => {
  return await queryMYSQL(
    `UPDATE RUBROS SET descripcion = ?,fecha_actualizacion=?, codigo = ? WHERE id = ?`,
    [rubro.descripcion, rubro.fecha_actualizacion, rubro.codigo, rubro.id]
  );
};

/*Marcas*/
exports.getMARCAS_LOGISTICA = async () => {
  return await queryMYSQL("SELECT * FROM MARCAS");
};

exports.insertMARCAS_LOGISTICA = async (marca) => {
  return await queryMYSQL(
    `INSERT INTO MARCAS (id,descripcion,fecha_actualizacion,codigo) VALUES (?,?,?,?)`,
    [marca.id, marca.descripcion, marca.fecha_actualizacion, marca.codigo]
  );
};

exports.updateMARCAS_LOGISTICA = async (marca) => {
  return await queryMYSQL(
    `UPDATE MARCAS SET descripcion = ?,fecha_actualizacion=?, codigo = ? WHERE id = ?`,
    [marca.descripcion, marca.fecha_actualizacion, marca.codigo, marca.id]
  );
};

/*Articulos*/
exports.getARTICULOS_LOGISTICA = async () => {
  return await queryMYSQL("SELECT * FROM ARTICULOS");
};

exports.insertARTICULOS_LOGISTICA = async (articulo) => {
  return await queryMYSQL(
    `INSERT INTO ARTICULOS (id,codigo1,codigo2,codigo3,nombre,alic_iva,impuesto,id_rubro_fk,id_marca_fk,fecha_actualizacion,nombre_largo,id_proveedor_fk,fecha_uc,moneda,id_familia_fk,obs,fecha_cp,comentario,segundo_reng,vence_dias,volumen,peso,precio_ref,id_centro_distr_fk) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      articulo.id,
      articulo.codigo1,
      articulo.codigo2,
      articulo.codigo3,
      articulo.nombre,
      articulo.alic_iva,
      articulo.impuesto,
      articulo.id_rubro_fk,
      articulo.id_marca_fk,
      articulo.fecha_actualizacion,
      articulo.nombre_largo,
      articulo.id_proveedor_fk,
      articulo.fecha_uc,
      articulo.moneda,
      articulo.id_familia_fk,
      articulo.obs,
      articulo.fecha_cp,
      articulo.comentario,
      articulo.segundo_reng,
      articulo.vence_dias,
      articulo.volumen,
      articulo.peso,
      articulo.precio_ref,
      articulo.id_centro_distr_fk,
    ]
  );
};

exports.updateARTICULOS_LOGISTICA = async (articulo) => {
  return await queryMYSQL(
    `UPDATE ARTICULOS SET codigo1 = ?,codigo2 = ?,codigo3 = ?,nombre = ?,alic_iva = ?,impuesto = ?,id_rubro_fk = ?,id_marca_fk = ?,fecha_actualizacion = ?,nombre_largo = ?,id_proveedor_fk = ?,fecha_uc = ?,moneda = ?,id_familia_fk = ?,obs = ?,fecha_cp = ?,comentario = ?,segundo_reng = ?,vence_dias = ?,volumen = ?,peso = ?,precio_ref = ?, id_centro_distr_fk = ? WHERE id = ?`,
    [
      articulo.codigo1,
      articulo.codigo2,
      articulo.codigo3,
      articulo.nombre,
      articulo.alic_iva,
      articulo.impuesto,
      articulo.id_rubro_fk,
      articulo.id_marca_fk,
      articulo.fecha_actualizacion,
      articulo.nombre_largo,
      articulo.id_proveedor_fk,
      articulo.fecha_uc,
      articulo.moneda,
      articulo.id_familia_fk,
      articulo.obs,
      articulo.fecha_cp,
      articulo.comentario,
      articulo.segundo_reng,
      articulo.vence_dias,
      articulo.volumen,
      articulo.peso,
      articulo.precio_ref,
      articulo.id_centro_distr_fk,
      articulo.id,
    ]
  );
};

/*Proveedores*/
exports.getPROVEEDORES_LOGISTICA = async () => {
  return await queryMYSQL("SELECT * FROM PROVEEDORES");
};

exports.insertPROVEEDORES_LOGISTICA = async (proveedor) => {
  return await queryMYSQL(
    `INSERT INTO PROVEEDORES (nume,numero,apellido,fantasia,localidad,provincia,codigo_postal,cuit,id_provincia_fk,id_localidad_fk) VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [
      proveedor.nume,
      proveedor.numero,
      proveedor.apellido,
      proveedor.fantasia,
      proveedor.localidad,
      proveedor.provincia,
      proveedor.codigo_postal,
      proveedor.cuit,
      proveedor.idProvincia,
      proveedor.idLocalidad
    ]
  );
};

exports.updatePROVEEDORES_LOGISTICA = async (proveedor) => {
  console.log(proveedor)
  return await queryMYSQL(
    `UPDATE PROVEEDORES SET numero = ?,apellido = ?,fantasia = ?,localidad = ?,provincia = ?,codigo_postal = ?,cuit = ?, fecha_actualizacion = ?,  id_provincia_fk = ?, id_localidad_fk = ? WHERE nume = ?`,
    [
      proveedor.numero,
      proveedor.apellido,
      proveedor.fantasia,
      proveedor.localidad,
      proveedor.provincia,
      proveedor.codigo_postal,
      proveedor.cuit,
      proveedor.fecha_actualizacion,
      proveedor.idProvincia,
      proveedor.idLocalidad,
      proveedor.nume
    ]
  );
};



exports.getLocalidades = async () => {
  return await queryMYSQL(`select l.*, p.nombre as 'provincia' from localidades l left join provincias p on l.id_provincia = p.id`)
}

exports.getProvincias = async () => {
  return await queryMYSQL(`select * from provincias p`)
}