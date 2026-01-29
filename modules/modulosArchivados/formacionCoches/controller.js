const model = require('./model')
const mTiposVehiculos = require('../tiposVehiculos/model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")
const mVehiculos = require("../vehiculos/model")


exports.getLista = async (req, res) => {
    try {
        res.render('formacionCoches/views/index', {
            pagename: "Formacion Coches",
            permisos: req.session.user.permisos
        })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}


exports.getComponentesVehiculo = async(req, res) =>{
    try {
        const data = await model.getComponentesByVehiculo(req.body.id)
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        return res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}



//Componentes
