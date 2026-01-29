const { queryMYSQL } = require("../../database")


exports.getAll = () => {
let query = `SELECT pv.*, 
e.nombre as empresa, 
tc.desc_corta as cod_afip, 
tc.letra as letra, 
tc.descripcion as tipo_comprobante,
IF(tc.desc_corta IS NOT NULL, '1', '0') as tipo 
FROM puntos_venta pv 
LEFT JOIN empresas e ON pv.id_empresa_fk = e.id 
LEFT JOIN tipos_comprobantes tc ON pv.id_tipo_comprobante_fk = tc.id WHERE 1=1`;
let params = [];

return queryMYSQL(query, params);
};

exports.getByLowCost = (lowcost) => {
return queryMYSQL(
`SELECT pv.*, 
e.nombre as empresa, 
tc.desc_corta as cod_afip, 
tc.letra as letra, 
tc.descripcion as tipo_comprobante,
IF(tc.desc_corta IS NOT NULL, '1', '0') as tipo,
c.descripcion as concepto_descripcion
FROM puntos_venta pv 
LEFT JOIN empresas e ON pv.id_empresa_fk = e.id 
LEFT JOIN tipos_comprobantes tc ON pv.id_tipo_comprobante_fk = tc.id 
LEFT JOIN conceptos c ON pv.id_concepto_fk = c.id
WHERE (e.id=? OR e.id_empresa_low_fk=?)
`,
[lowcost, lowcost]
);
};

exports.getOne = ({id = null, id_empresa_fk = null, puerto = null, cod_afip = null} = {}) => {
	let params = [];
	let query = `
		SELECT pv.*, e.razon_social AS empresaTxt, c.descripcion AS cargoTxt
		FROM puntos_venta pv
		LEFT JOIN empresas e ON e.id = pv.id_empresa_fk
		LEFT JOIN cargos c ON c.id = pv.id_cargo_fk 
		WHERE 1 = 1
	`

	if(id){
		query += " AND pv.id=?"
		params.push(id)
	}

	if(id_empresa_fk){
		query += " AND pv.id_empresa_fk=?"
		params.push(id_empresa_fk)
	}

	if(puerto){
		query += " AND pv.punto_venta=?"
		params.push(puerto)
	}
	
	if(cod_afip){
		query += " AND pv.cod_afip=?"
		params.push(cod_afip)
	}

	return queryMYSQL(query, params)
}

exports.insert = o => {
	return queryMYSQL(`
		INSERT INTO puntos_venta (id_empresa_fk, punto_venta, domicilio, habilita_recibo, 
								habilita_interno, habilita_arca, habilita_manual, id_cargo_fk) 
		VALUES (?,?,?,?,?,?,?,?)
	`, [o.empresa, o.ptoVenta, o.domicilio, o.habRecibo, o.habInterno, o.habArca, o.habManual, o.cargo])
}

exports.update = o => {
	return queryMYSQL(`
		UPDATE puntos_venta 
		SET id_empresa_fk=?, punto_venta=?, domicilio=?, habilita_recibo=?, habilita_interno=?, 
			habilita_arca=?, id_cargo_fk=?, activo=? 
		WHERE id=?
	`, [o.empresa, o.ptoVenta, o.domicilio, o.habRecibo, o.habInterno, o.habArca, o.cargo, o.activo, o.id])
}

exports.delete = (id) => {
return queryMYSQL("DELETE FROM puntos_venta WHERE id=?", [id]);
};

exports.updateActivo = (id, activo) => {
return queryMYSQL("UPDATE puntos_venta SET activo=? WHERE id=?", [
activo,
id,
]);
};

exports.getPuntoVentaPresupuesto = (empresa) => {
return queryMYSQL(
"SELECT pv.* FROM puntos_venta pv LEFT JOIN tipos_comprobantes tp on pv.id_tipo_comprobante_fk=tp.id WHERE id_empresa_fk=? AND tp.letra='P'",
[empresa]
);
};

exports.getByEmpresaActivo = (empresa) => {
return queryMYSQL(
`SELECT pv.*, 
e.nombre as empresa, 
tc.desc_corta as cod_afip, 
tc.letra as letra, 
tc.descripcion as tipo_comprobante,
IF(tc.desc_corta IS NOT NULL, '1', '0') as tipo 
FROM puntos_venta pv 
LEFT JOIN empresas e ON pv.id_empresa_fk = e.id 
LEFT JOIN tipos_comprobantes tc ON pv.id_tipo_comprobante_fk = tc.id WHERE id_empresa_fk=? AND pv.activo=1`,
[empresa]
);
};

// exports.puntoVentaExiste = o => {
// 	return queryMYSQL(`
// 		SELECT *
// 		FROM puntos_venta
// 		WHERE id_empresa_fk=? AND puerto=? AND id_tipocomprobante_fk=?
// 	`, [o.empresa, o.puerto, o.tipoComprobante])
// }

exports.getPuntosVentaByLetra = (letras, condicionVenta, empresa) => {
return queryMYSQL(
`SELECT DISTINCT pv.*, 
e.nombre as empresa, 
tc.desc_corta as cod_afip, 
tc.letra as letra, 
tc.descripcion as tipo_comprobante,
IF(tc.desc_corta IS NOT NULL, '1', '0') as tipo 
FROM puntos_venta pv 
LEFT JOIN empresas e ON pv.id_empresa_fk = e.id 
LEFT JOIN tipos_comprobantes tc ON pv.id_tipo_comprobante_fk = tc.id 
WHERE  tc.letra IN (?)
AND pv.id_empresa_fk = ? AND tc.id IN (SELECT id_tipo_comprobante_fk FROM condicion_venta_tipo_comprobante WHERE id_condicion_venta_fk = ?)`,
[letras, empresa, condicionVenta]);
};

exports.exectQuery = (query, params) => {
return queryMYSQL(query, params);
};

exports.getPuntoVentaById = id => {
	return queryMYSQL(`
		SELECT *
		FROM puntos_venta pv
		WHERE id = ?
	`, [id])
}

exports.getCodigoAfipPuntoVentaById = id => {
	return queryMYSQL(`
		SELECT *
		FROM puntos_venta pv
		WHERE id = ?
	`, [id])
}

exports.getAllPuntosVentasByEmpresaSelect = empresa => {
	return queryMYSQL(`
		SELECT pv.id, LPAD(pv.punto_venta, 5, '0') AS puntoVentaTxt, pv.domicilio, e.id_concepto_fk 
		FROM puntos_venta pv 
		LEFT JOIN empresas e ON e.id = pv.id_empresa_fk 
		WHERE pv.id_empresa_fk = ? 
		ORDER BY pv.punto_venta
	`, [empresa])
}

exports.getAllTiposComprobByEmpresaClienteSelect = empresa => {
	return queryMYSQL(`
		SELECT id, LPAD(punto_venta, 5, '0') AS puntoVentaTxt, domicilio
		FROM puntos_venta 
		WHERE id_empresa_fk = ? 
		ORDER BY punto_venta
	`, [empresa])
}

exports.getPuntoVentaByEmpresa = empresa => {
	return queryMYSQL(`
		SELECT pv.id, 
			   pv.punto_venta, 
			   LPAD(pv.punto_venta, 5, '0') AS puntoVentaTxt, 
			   pv.ultimo+1 AS ultimo, 
			   LPAD(pv.ultimo+1, 8, '0') AS ultimoTxt, 
			   pv.domicilio
		FROM puntos_venta pv
		WHERE pv.id_empresa_fk = ?
	`, [empresa])
}

exports.getPuntoVentaExisteByEmpresa = (empresa, id, ptoVenta, domicilio) => {
	return queryMYSQL(`
		SELECT IF(COUNT(*) > 0, 1, 0) AS existe, 
			   pv.punto_venta, 
			   pv.ultimo+1 AS ultimo, 
			   LPAD(pv.ultimo+1, 8, '0') AS ultimoTxt 
		FROM puntos_venta pv
		WHERE pv.id_empresa_fk = ? AND 
			  pv.id = ? AND 
			  pv.punto_venta = ? AND 
			  pv.domicilio LIKE '%${domicilio}%'
	`, [empresa, id, ptoVenta])
}

exports.updateNumeracion = (numero, id) => {
	return queryMYSQL(`
		UPDATE puntos_venta pv
		SET ultimo=?
		WHERE id=?
	`, [numero, id])
}

exports.getPuntoVentaByEmpresa = empresa => {
	return queryMYSQL(`
		SELECT id, punto_venta, domicilio, habilita_recibo 
		FROM puntos_venta pv
		WHERE id_empresa_fk =  ?
	`, [empresa])
}