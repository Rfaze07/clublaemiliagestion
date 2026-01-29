const { queryMYSQL } = require("../../database")

// GENERAL
exports.execQuery = (q,p) => {
	return queryMYSQL(q, p)
}

// Reporte de Stock

exports.getReporteStock = () => {
	const query = `
	SELECT 
		p.id AS id_producto,
		p.Desc_Producto,
		r.descripcion AS rubro,
		mar.descripcion AS marca,
		um.desc_corta AS unidad_medida,
		p.stockMinimo,
		p.activo,
		-- Cantidades totales
		IFNULL(SUM(CASE WHEN c.id_proveedor_fk <> 0 THEN ci.cantidad ELSE 0 END), 0) AS total_compras,
		IFNULL(SUM(CASE WHEN c.id_cliente_fk <> 0 THEN ci.cantidad ELSE 0 END), 0) AS total_ventas,
		IFNULL(SUM(CASE WHEN m.tipo = 0 and m.blindado = 1 THEN md.cantidad ELSE 0 END), 0) AS total_ingresos,
		IFNULL(SUM(CASE WHEN m.tipo = 1 and m.blindado = 1 THEN md.cantidad ELSE 0 END), 0) AS total_egresos,
		-- Cálculo de stock final
		(
			IFNULL(SUM(CASE WHEN c.id_proveedor_fk <> 0 THEN ci.cantidad ELSE 0 END), 0)
			- IFNULL(SUM(CASE WHEN c.id_cliente_fk <> 0 THEN ci.cantidad ELSE 0 END), 0)
			+ IFNULL(SUM(CASE WHEN m.tipo = 0 THEN md.cantidad ELSE 0 END), 0)
			- IFNULL(SUM(CASE WHEN m.tipo = 1 THEN md.cantidad ELSE 0 END), 0)
		) AS stock_actual
	FROM productos p
	LEFT JOIN comprobantes_items ci ON p.id = ci.id_producto_fk
	LEFT JOIN comprobantes c ON ci.id_comprobante_fk = c.id
	LEFT JOIN movimientos_detalle md ON p.id = md.id_producto_fk
	LEFT JOIN movimientos m ON md.id_movimiento_fk = m.id
	LEFT JOIN rubros r ON p.id_rubro_fk = r.id
	LEFT JOIN marcas mar ON p.id_marca_fk = mar.id
	LEFT JOIN unmed um ON p.id_unmed_fk = um.id
	GROUP BY p.id, p.Desc_Producto
	ORDER BY p.Desc_Producto;

	`
	return queryMYSQL(query, [])
}
