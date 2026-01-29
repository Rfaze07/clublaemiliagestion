const model = require('./model')


exports.getLocalidades = async (req, res) => {
    const provincias = await model.getProvincias()
    res.render('localidades/views/index', {
        pagename: "Localidades",
        permisos: req.session.user.permisos,
        provincias
    })
}

exports.getLocalidadesProvincia = async (req, res) => {
    let localidades = await ObtenerLocalidadesByIdProvincia(req.body.IdProvincia)
    res.json(localidades)
}

exports.getLocalidadesSelectProvincia = async (req, res) => {
    let localidades = await ObtenerLocalidadesByIdProvincia(req.body.id)
    res.json(localidades)
}

const ObtenerLocalidadesByIdProvincia = async idProvincia => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await model.getLocalidades(idProvincia)
            resolve({ status: true, data })
        } catch (error) {
            console.log(error)
            resolve({ status: false, type: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        }
    })
}

exports.postAlta = async (req, res) => {
    try {
        if(req.body.descripcion.length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar una descripción' })
        if(req.body.cp.length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Debe ingresar el código postal' })
        if(req.body.cp.length > 6) return res.json({ status: false, icon: 'error', title: 'Error', text: 'El código postal supera el límite de caracteres (Máx: 6)' })

        let locExiste = await model.getLocalidadExiste(req.body)
        let cpExiste  = await model.getCPExiste(req.body)
    
        if(locExiste[0].existe > 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'La localidad ingresada ya existe!' })
        if(cpExiste[0].existe > 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'El código postal ya existe!' })
    
        let resInsert = await model.insert(req.body)
        if(resInsert.affectedRows > 0) return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}

exports.postEliminar = async (req, res) => {
    try {
        let resDelete = await model.delete(req.body.id)
        if(resDelete.affectedRows > 0) return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}