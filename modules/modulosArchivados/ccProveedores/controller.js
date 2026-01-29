const mComprobantes = require("../comprobantes/model")
const utils = require('../../public/js/utils')


exports.getLista = async (req, res) => {
	try {
		res.render("ccProveedores/views/lista", {
			pagename: "C/c Proveedores",
			permisos: req.session.user.permisos
		})
	} catch (error) {
		console.log(error)
		res.redirect('/inicio')
	}
}

exports.getListaAjax = async (req, res) => {
	try {
		console.log(req.body)

		if(String(req.body.empresa).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la empresa' })
		if(String(req.body.cliente).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el cliente' })
		if(String(req.body.hasta).trim().length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la fecha hasta' })
	
		req.body.hasta = utils.changeDateYMD(req.body.hasta)
	
		let datos=[], totalDebe=0, totalHaber=0


		//================================= COMPROBANTES =================================

		let paramsComprob = [req.body.hasta],
			queryComprob = `
				SELECT c.*, p.razon_social AS proveedorTxt, p.cuit
				FROM comprobantes c
				LEFT JOIN proveedores p ON p.id = c.id_proveedor_fk 
				LEFT JOIN empresas e ON e.id = c.id_empresa_fk
				WHERE c.id_proveedor_fk > 0 AND c.fecha_comprobante < ?
			`
		if(req.body.empresa != 't'){
			queryComprob += ` AND c.id_empresa_fk = ?`
			paramsComprob.push(req.body.empresa)
		}
		
		if(req.body.proveedor != 't'){
			queryComprob += ` AND c.id_proveedor_fk = ?`
			paramsComprob.push(req.body.proveedor)
		}

		queryComprob += ` ORDER BY c.fecha`
		const comprobantes = await mComprobantes.execQuery(queryComprob, paramsComprob)
		// console.log(comprobantes)
		for(let a= 0; a<comprobantes.length; a++){
			totalDebe += parseFloat(comprobantes[a].total)
			let obj = {
				id: comprobantes[a].id, 
				fecha: comprobantes[a].fecha_comprobante, 
				puntoVenta: String(comprobantes[a].punto_venta).padStart(5, '0'),
				numeroTxt: String(comprobantes[a].numero).padStart(8, '0'),
				tipo: comprobantes[a].desctipo, 
				debe: parseFloat(comprobantes[a].total), 
				haber: 0
			}
			datos.push(obj)
		}


		//================================= RECIBOS =================================

		let paramsRecibos = [req.body.hasta],
			queryRecibos = `
				SELECT rp.*, r.fecha_recibo, r.punto_venta, r.numero
				FROM recibos_comprobantes rc
				LEFT JOIN recibos r ON r.id = rc.id_recibo_fk 
				LEFT JOIN recibos_pagos rp ON rp.id_recibo_fk = r.id
				LEFT JOIN comprobantes c ON c.id = rc.id_comprobante_fk 
				LEFT JOIN clientes cl ON cl.id = c.id_cliente_fk  
				WHERE r.fecha_recibo < ?
			`
		if(req.body.empresa != 't'){
			queryRecibos += ` AND r.id_empresa_fk = ?`
			paramsRecibos.push(req.body.empresa)
		}
		
		if(req.body.cliente != 't'){
			queryRecibos += ` AND r.id_cliente_fk = ?`
			paramsRecibos.push(req.body.cliente)
		}

		queryRecibos += ` GROUP BY r.id`
		const recibos = await mComprobantes.execQuery(queryRecibos, paramsRecibos)
		// console.log(recibos)
		for(let a= 0; a<recibos.length; a++){
			totalHaber += parseFloat(recibos[a].importe)
			let obj = {
				id: recibos[a].id,
				fecha: recibos[a].fecha_recibo,
				puntoVenta: String(recibos[a].punto_venta).padStart(5, '0'),
				numeroTxt: String(recibos[a].numero).padStart(8, '0'),
				tipo: "Recibo",
				debe: 0, 
				haber: parseFloat(recibos[a].importe)
			}
			datos.push(obj)
		}



		//================================= SALDOS =================================

		let paramsSaldos = [req.body.hasta, req.body.hasta],
			querySaldos = `
				SELECT SUM(c.total) - SUM(rp.importe) AS total
				FROM comprobantes c 
				LEFT JOIN clientes cl ON cl.id = c.id_cliente_fk 
				LEFT JOIN recibos r ON r.id_cliente_fk = cl.id
				LEFT JOIN recibos_pagos rp ON rp.id_recibo_fk = r.id 
				WHERE r.fecha_recibo < ? OR c.fecha_comprobante < ?
			`
		if(req.body.empresa != 't'){
			querySaldos += ` AND r.id_empresa_fk = ? AND c.id_empresa_fk = ?`
			paramsSaldos.push(req.body.empresa)
			paramsSaldos.push(req.body.empresa)
		}
		
		if(req.body.cliente != 't'){
			querySaldos += ` AND r.id_cliente_fk = ? AND c.id_cliente_fk = ?`
			paramsSaldos.push(req.body.cliente)
			paramsSaldos.push(req.body.cliente)
		}
		const saldos = await mComprobantes.execQuery(querySaldos, paramsSaldos)



		datos.sort((a, b) => {  
			if (a.fecha < b.fecha) return -1
			if (a.fecha > b.fecha) return 1
			return 0
		})
	
		if(datos.length == 0) return res.send({ status: false, icon: 'error', title: 'Error', text: 'No se encontraron resultados para los filtros seleccionados' })
		res.send({ status: true, datos, debe: totalDebe, haber: totalHaber, saldo: saldos[0].total })

	} catch (error) {
		console.log(error)
		res.send({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
	}
}