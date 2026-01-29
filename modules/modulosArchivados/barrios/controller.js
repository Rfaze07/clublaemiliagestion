//EJEMPLO
const model = require('./model');



//#region GETS
exports.getBarrios = async (req, res) => {
    const provincias = await model.getProvincias()
    res.render('barrios/views/index', {
        pagename: "Barrios",
        provincias,
        permisos: req.session.user.permisos
    })
}




exports.getListaBarrios = async (req, res) => {
    let params = [],
        query = `select c.*, l.nombre as 'localidad' from barrios c left join localidades l on c.id_localidad_fk = l.id `
    if (req.body.activo != 't') {
        params.push(req.body.activo)
        query += ` where c.activo = ?`
    }
    query += ` order by c.activo`
    let barrios = await model.getBarrios(query, params)
    res.json(barrios)
}


exports.getLocalidadesByProvincia = async (req, res) => {
    const getLocalidadesByProvincia = await model.getLocalidadesByProvincia(req.body.provincia)
    return res.json(getLocalidadesByProvincia)
}


exports.getBarrioById = async (req, res) => {
    const getBarrioById = await model.getBarrioById(req.params.id)

    const getProvincia = await model.getProvinciasByLocalidad(getBarrioById[0].id_localidad_fk)

    getBarrioById[0].idProvincia = getProvincia[0].idProvincia

    res.json(getBarrioById[0])

}

//#region POST
exports.postAlta = async (req, res) => {
    const ValidarDatos = await Validar(req.body)
    if (ValidarDatos.status === true) {
        let postAlta = await model.postAlta(req.body)
        if (postAlta.affectedRows === 1) {
            res.json({
                status: true,
                type: 'success',
                icon: 'success',
                title: 'Exito',
                text: '¡Se agrego con exito!',
            })
        } else {
            res.json({
                status: false,
                type: 'error',
                icon: 'error',
                title: 'Error!',
                text: '¡Hubo un error en modificar el barrio, intentalo nuevamente!',
            })
        }
    } else {
        res.json({
            status: false,
            type: ValidarDatos.type,
            icon: ValidarDatos.icon,
            title: ValidarDatos.title,
            text: ValidarDatos.text,
        })
    }

}


//#region UPDATE
exports.update = async (req, res) => {
    const ValidarDatos = await Validar(req.body)
    if (ValidarDatos.status === true) {
        let update = await model.update(req.body)
    
        if (update.affectedRows === 1) {
            res.json({
                status: true,
                type: 'success',
                icon: 'success',
                title: 'Exito',
                text: '¡Se modifico con exito!',
            })
        } else {
            res.json({
                status: false,
                type: 'error',
                icon: 'error',
                title: 'Error!',
                text: '¡Hubo un error en modificar el barrio, intentalo nuevamente!',
            })
        }
    } else {
        res.json({
            status: false,
            type: ValidarDatos.type,
            icon: ValidarDatos.icon,
            title: ValidarDatos.title,
            text: ValidarDatos.text,
        })
    }

}



//#region BORRAR 
exports.borrar = async (req, res) => {
    let borrar = await model.borrar(req.body.IdBarrio)
    if (borrar.affectedRows === 1) {
        res.json({
            status: true,
            type: 'success',
            icon: 'success',
            title: 'Exito',
            text: 'Se elimino con exito!',
        })
    } else {
        res.json({
            status: false,
            type: 'error',
            icon: 'error',
            title: 'Error!',
            text: 'Hubo un error en eliminar el barrio, intentalo nuevamente!',
        })
    }
}
//#region FUNCIONES
async function Validar(body) {
    let getBarrioById, getBarrioByDesc
    if (body.descripcion === "") return { status: false, type: 'error', title: 'Error', text: '¡Ingresa un descripcion!' }
    if (body.id !== undefined) {
        getBarrioById = await model.getBarrioById(body.id)
        if (getBarrioById[0].descripcion !== body.descripcion) {
            getBarrioByDesc = await model.getBarrioByDesc(body.descripcion)
            if (getBarrioByDesc.length > 0) {
                return {
                    status: false,
                    type: 'error',
                    icon: 'error',
                    title: 'Patente ya extiste!',
                    text: 'No se puede registrar este barrio por qué ya existe',
                }
            }
        }
    }else{
        getBarrioByDesc = await model.getBarrioByDesc(body.descripcion)
            if (getBarrioByDesc.length > 0) {
                return {
                    status: false,
                    type: 'error',
                    icon: 'error',
                    title: 'Patente ya extiste!',
                    text: 'No se puede registrar este barrio por qué ya existe',
                }
            }
    }
    if (body.descripcion === "") return { status: false, type: 'error', title: 'Error', text: '¡Ingresa una descripción!' };
    if (body.descCorta === "") return { status: false, type: 'error', title: 'Error', text: '¡Ingresa una descripción corta!' };
    if (body.localidad === "x") return { status: false, type: 'error', title: 'Error', text: '¡Elige una localidad válida!' };
    return { status: true }
}