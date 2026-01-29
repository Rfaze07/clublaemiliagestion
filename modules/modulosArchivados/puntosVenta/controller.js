const model = require("./model")
const mComprobantes = require("../comprobantes/model")
const mEmpresas = require("../empresas/model")
const mCargos = require("../cargos/model")
const eventos = require("../eventos/controller")
const utils = require("../../utils")


exports.getLista = async (req, res) => {
	const empresas = await mEmpresas.getEmpresas()
	const cargos = await mCargos.getAllbyActivo(1)

	res.render("puntosVenta/views/lista", {
		pagename: "Puntos de venta",
		permisos: req.session.user.permisos,
		empresas, cargos
	})
}

exports.getListaAjax = async (req, res) => {
	let params=[],
		query = `
			SELECT pv.*, e.razon_social AS empresaTxt
			FROM puntos_venta pv 
			LEFT JOIN empresas e ON pv.id_empresa_fk = e.id 
			WHERE 1=1 
		`
	if(req.body.empresa != "t") {
		query += " AND e.id = ?"
		params.push(req.body.empresa)
	}

	const data = await model.exectQuery(query, params)
	if (!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
	res.json({ status: true, data })
}

exports.postAlta = async (req, res) => {
  	try {
		const validacion = await ValidarCampos(req.body)
		if(!validacion.status) return res.json(validacion)

		req.body.habManual = 0 // SE HARDCODEA, FALTA PENSARLO Y VALIDAR EN LA FUNCION CORREGIR

		const resultInsert = await model.insert(req.body)
		if(resultInsert.affectedRows == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
		await eventos.insertarEvento({ usuario: req.session.user.id, acc: "a", registro: resultInsert.insertId, tabla: 'puntos_venta' })
		res.json({status: true, icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

	} catch (error) {
		console.error(error)
		res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
	}
}

exports.postModificar = async (req, res) => {
	try {
		const validacion = await ValidarCampos(req.body)
		if(!validacion.status) return res.json(validacion)

		const resultUpdate = await model.update(req.body)
		if(resultUpdate.affectedRows == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
		await eventos.insertarEvento({ usuario: req.session.user.id, acc: "a", registro: resultUpdate.insertId, tabla: 'puntos_venta' })
		res.json({status: true, icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })

	} catch (error) {
		console.error(error)
		res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
	}
}

exports.getById = async (req, res) => {
	try {
		const punto_venta = await model.getOne({ id: req.params.id })
		res.json(punto_venta[0])
	} catch (error) {
		console.log(error)
		res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
	}
}

exports.postEliminar = async (req, res) => {
	let { id } = req.body
	let comprobantes = await mComprobantes.getByPuntoVenta(id)
	if(comprobantes.length > 0) return res.json({ status: false, type: "error", title: "Error", text: "El punto de venta no puede ser eliminado porque tiene comprobantes asociados" })

	await model.delete(id)
	await eventos.insertarEvento({ usuario: req.session.user.id, acc: "b", registro: id, tabla: 'puntos_venta' })
	res.json({ status: true, type: "success", title: "Éxito", text: "Punto de venta eliminado" })
}

exports.postActivo = async (req, res) => {
	let { id, activo } = req.body
	await model.updateActivo(id, activo)
	await eventos.insertarEvento({ usuario: req.session.user.id, acc: "m", registro: id, tabla: 'puntos_venta' })
	res.json({ status: true, type: "success", title: "Éxito", text: "Punto de venta modificado" })
}

exports.getPuntoDeVentaP = async (req, res) => {
	const punto_venta = await model.getPuntoVentaPresupuesto(req.params.empresa)
	res.json(punto_venta[0])
}

const ValidarCampos = o => {
	return new Promise((resolve, reject) => {
		if(o.empresa.trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar la empresa' })
		if(isNaN(o.ptoVenta)) resolve({ status: false, icon: 'error', title: 'Error', text: 'El punto de venta no es válido' })
		if(o.ptoVenta.trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el punto de venta' })
		if(o.ptoVenta.trim().length > 5) resolve({ status: false, icon: 'error', title: 'Error', text: 'El punto de venta no puede superar los 5 caracteres' })
		if(o.ptoVenta == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'El punto de venta debe ser mayor a cero' })
		if(o.ptoVenta > 99998) resolve({ status: false, icon: 'error', title: 'Error', text: 'El punto de venta no puede ser mayor a 99998' })
		if(o.domicilio.trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el domicilio' })
		if(o.domicilio.trim().length > 50) resolve({ status: false, icon: 'error', title: 'Error', text: 'El domicilio no puede superar los 50 caracteres' })
		if(o.cargo.trim().length == 0) resolve({ status: false, icon: 'error', title: 'Error', text: 'Debe seleccionar el cargo' })

		o.ptoVenta = parseInt(o.ptoVenta)
		o.habRecibo = utils.changeToBoolean(o.habRecibo)
		o.habInterno = utils.changeToBoolean(o.habInterno)
		o.habArca = utils.changeToBoolean(o.habArca)
		o.habManual = utils.changeToBoolean(o.habManual)
		o.activo = utils.changeToBoolean(o.activo)

		if(o.habInterno == 0 && o.habArca == 0) resolve({ status: false, icon: "error", title: "Error", text: "Debe seleccionar al menos una (Habilita interno o habilita ARCA)" })
		// MODIFICAR CUANDO SE HABILITE EL MODO MANUAL
		// if(o.habInterno == 0 && o.habArca == 0 && o.habManual == 0) resolve({ status: false, icon: "error", title: "Error", text: "Debe seleccionar al menos una (Habilita interno, habilita ARCA o habilita manual)" })

		resolve({ status: true })
	})
}

exports.postListaSelectAjax = async (req, res) => {
	try {
		if(String(req.body.id).trim().length > 0){
			const data = await model.getAllPuntosVentasByEmpresaSelect(req.body.id)
			if(data.length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "No existen puntos de venta para la empresa seleccionada" })
			res.json({ status: true, data })
		}else{
			res.json({ status: true, data: [] })
		}
	} catch (error) {
		console.log(error)
		return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
	}
}

exports.postPuntoVentaSelectAjax = async (req, res) => {
	try {
		if(String(req.body.id).trim().length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al obtener el punto de venta" })

		const data = await model.getAllPuntosVentasByEmpresaSelect(req.body.id)
		if(data.length == 0) return res.json({ status: false, icon: "error", title: "Error", text: "No existen puntos de venta para la empresa seleccionada" })
		res.json({ status: true, data })

	} catch (error) {
		console.log(error)
		return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
	}
}





// FUNCIONES GLOBALES

exports.getNumeracion = async (req, res) => {
	try {
		const punto_venta = await model.getOne({ id: req.params.id })
		res.json(punto_venta[0])
	} catch (error) {
		console.log(error)
		res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
	}
}