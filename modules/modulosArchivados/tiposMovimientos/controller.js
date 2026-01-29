const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")


// exports.getLista = async (req, res) => {
//     try {
//         res.render('ordenesTrabajosTipos/views/lista', {
//             pagename: "Tipos de órdenes de trabajos",
//             permisos: req.session.user.permisos
//         })
//     } catch (error) {
//         console.log(error)
//         res.redirect('/inicio')
//     }
// }

// exports.getListaAjax = async (req, res) => {
//     try {
//         const data = req.body.activo == 't' ? await model.getAll() : await model.getAllbyActivo(req.body.activo)
//         if(!data.length) return res.json({ status: false, icon:"warning", title: "Alerta", text: "No existen registros cargados" })
//         res.json({ status: true, data })
//     } catch (error) {
//         console.log(error)
//         return res.json({ status: false, con:"", title: "Error", text: "Hubo un error al procesar la solicitud" })
//     }
// }

exports.getListaSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllbyActivo(1)
        if(!data.length) return res.json({ status: false, icon:"warning", title: "Alerta", text: "No existen tipos de órdenes de trabajo cargados" })
        return res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}

// exports.postAlta = async (req, res) => {
//     try {
//         const validaciones = await ValidarCampos(req.body)
//         if(!validaciones.status) return res.json(validaciones)

//         let resInsert = await model.insert(req.body)
//         if(!resInsert.affectedRows) return res.json({ status: false, icon:"error", title: "Error", text: "Hubo un error al procesar la solicitud" })
//         await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "OT tipos", acc: "a", registro: resInsert.insertId })
//         res.json({ status: true, icon:"success", title: "Éxito", text: "Solicitud procesada correctamente" })
//     } catch (error) {
//         console.log(error)
//         return res.json({ status: false, icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
//     }
// }

// exports.getById = async (req, res) => {    
//     const data = await model.getById(req.body.id)
//     if(!data.length) return res.json({ status: false, icon:'error', title: "Error", text: "No existen registros cargados" })
//     res.json({ status: true, data: data[0] })
// }

// exports.postModificar = async (req, res) => {
//     try {
//         const validaciones = await ValidarCampos(req.body)
//         if(!validaciones.status) return res.json(validaciones)

//         let result = await model.update(req.body)
//         if(result.affectedRows == 0) return res.json({ status: false, icon:'error', title: "Error", text: "Hubo un error al procesar la solicitud" })
//         await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "OT tipos", acc: "m", registro: req.body.id })
//         return res.json({ status: true, icon: "success", title: "Éxito", text: "Solicitud procesada correctamente" })
//     } catch (error) {
//         console.log(error)
//         return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
//     }
// }

// exports.postEliminar = async (req, res) => {
//     try {
//         // let result = await model.delete(req.body.id)
//         // if(result.affectedRows == 0) return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
//         // await eventos.insertarEvento({ usuario: req.session.user.id, tabla: "Rubros", acc: "b", registro: req.body.id })            
//         return res.json({ status: true, icon: "error", title: "error", text: "Falta vinculacion" })
//     } catch (error) {
//         console.log(error)
//         return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
//     }
// }

// const ValidarCampos = o => {
//     return new Promise((resolve, reject) => {
//         if(String(o.descripcion).trim().length == 0) return res.json({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la descripción' })
//         if(String(o.descripcion).trim().length >= 100) return res.json({ status: false, icon:'error', title: 'Error', text: 'La descripcion superó la cantidad permitida. (Máx.: 100)' })
//         if(String(o.desc_corta).trim().length == 0) return res.json({ status: false, icon:'error', title: 'Error', text: 'Debe ingresar la descripcion corta' })
//         if(String(o.desc_corta).trim().length >= 5) return res.json({ status: false, icon:'error', title: 'Error', text: 'La descripcion corta superó la cantidad permitida. (Máx.: 5)' })
        
//         o.activo = utils.changeToBoolean(o.activo)
//         o.desc_corta = o.desc_corta.toUpperCase()

//         return resolve({ status: true })
//     })
// }