const model = require('./model')
const mTanques = require('../tanques/model')
const utils = require('../../public/js/utils')
const main = require('../../public/js/main')
const { stat } = require('fs')

exports.getReporteStock = async (req, res) => {
    try {
        res.render('reportes/views/reporteStock', {
            pagename: "Reporte de Stock",
            permisos: req.session.user.permisos
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getReporteStockAjax = async (req, res) => {
    try {
        let params=[], 
            query = `
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
    WHERE 1=1
    `
        if(req.body.filtroActivo && req.body.filtroActivo != 't'){
            query += ' AND p.activo = ? '
            params.push(req.body.filtroActivo)
        }
        if(req.body.filtroRubro && req.body.filtroRubro != 't'){
            query += ' AND p.id_rubro_fk = ? '
            params.push(req.body.filtroRubro)
        }
        if(req.body.filtroMarca && req.body.filtroMarca != 't'){
            query += ' AND p.id_marca_fk = ? '
            params.push(req.body.filtroMarca)
        }

        if(req.body.filtroStockMinimo && req.body.filtroStockMinimo != 't'){
            query += 'GROUP BY p.id, p.Desc_Producto HAVING 1=1 '
            switch(req.body.filtroStockMinimo){
                case 'b': query += ' AND ( (IFNULL(SUM(CASE WHEN c.id_proveedor_fk <> 0 THEN ci.cantidad ELSE 0 END), 0) - IFNULL(SUM(CASE WHEN c.id_cliente_fk <> 0 THEN ci.cantidad ELSE 0 END), 0) + IFNULL(SUM(CASE WHEN m.tipo = 0 THEN md.cantidad ELSE 0 END), 0) - IFNULL(SUM(CASE WHEN m.tipo = 1 THEN md.cantidad ELSE 0 END), 0)) < p.stockMinimo ) '; break;
                case 'm': query += ' AND ( (IFNULL(SUM(CASE WHEN c.id_proveedor_fk <> 0 THEN ci.cantidad ELSE 0 END), 0) - IFNULL(SUM(CASE WHEN c.id_cliente_fk <> 0 THEN ci.cantidad ELSE 0 END), 0) + IFNULL(SUM(CASE WHEN m.tipo = 0 THEN md.cantidad ELSE 0 END), 0) - IFNULL(SUM(CASE WHEN m.tipo = 1 THEN md.cantidad ELSE 0 END), 0)) = p.stockMinimo ) '; break;
                case 'a': query += ' AND ( (IFNULL(SUM(CASE WHEN c.id_proveedor_fk <> 0 THEN ci.cantidad ELSE 0 END), 0) - IFNULL(SUM(CASE WHEN c.id_cliente_fk <> 0 THEN ci.cantidad ELSE 0 END), 0) + IFNULL(SUM(CASE WHEN m.tipo = 0 THEN md.cantidad ELSE 0 END), 0) - IFNULL(SUM(CASE WHEN m.tipo = 1 THEN md.cantidad ELSE 0 END), 0)) > p.stockMinimo ) '; break;
                default: break;
            }   
        } else {
            query += 'GROUP BY p.id, p.Desc_Producto '
        }

        let query2 = `
              SELECT m.descripcion, COUNT(p.id) as totalMarca
              FROM productos p
              LEFT JOIN marcas m ON p.id_marca_fk = m.id
              WHERE 1=1
              GROUP BY p.id_marca_fk        
        `

        const cantPorMarcas = await model.execQuery(query2, [])

        let query3 = `
              SELECT r.descripcion, COUNT(p.id) as totalRubro
              FROM productos p
              LEFT JOIN rubros r ON p.id_rubro_fk = r.id
              WHERE 1=1
              GROUP BY p.id_rubro_fk        
        `
        const cantPorRubros = await model.execQuery(query3, [])
        
        query += ' ORDER BY p.Desc_Producto; '

        let data = await model.execQuery(query, params)
        res.json({ status: true, data, cantPorMarcas, cantPorRubros })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}


exports.getReporteVentas = async (req, res) => {
    try {
        res.render('reportes/views/reporteVentas', {
            pagename: "Reporte de Ventas",
            permisos: req.session.user.permisos
        })
    }
    catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getReporteVentasAjax = async (req, res) => {
    try {
        let params=[],
            query = `
            SELECT 
                c.id,
                c.fecha,
                cl.razon_social AS cliente,
                LPAD(c.numero, 8, '0') AS numero,
                c.total
            FROM comprobantes c
            LEFT JOIN clientes cl ON c.id_cliente_fk = cl.id
            WHERE c.id_cliente_fk IS NOT NULL and (c.id_proveedor_fk IS NULL or c.id_proveedor_fk = 0)
            and c.fecha BETWEEN ? AND ?
            `
        params.push(utils.changeDateYMD(req.body.desde))
        params.push(utils.changeDateYMD(req.body.hasta))
        query += ' ORDER BY c.fecha DESC; '

        const ventas = await model.execQuery(query, params)

        if (ventas.length == 0) {
            return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        }

        return res.json({ status: true, ventas })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

