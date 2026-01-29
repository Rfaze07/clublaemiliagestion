//EJEMPLO
const model = require('./model');

exports.getChoferes = async (req, res) => {
    // let testMysql = await model.pruebaMysql("hola");

    const camiones = await model.getCamiones()
    const provincias = await model.getProvincias()
    /*
        OBTENER PROVINCIAS / CAMIONES

     */
    res.render('choferes/views/index', {
        pagename: "Choferes",
        camiones,
        provincias,
        permisos: req.session.user.permisos
    })
}

exports.getLocalidadesByProvincia = async (req, res) => {
    const getLocalidadesByProvincia = await model.getLocalidadesByProvincia(req.body.provincia)
    return res.json(getLocalidadesByProvincia)
}

exports.getListaChoferes = async (req, res) => {
    let params = [],
        query = `select c.*, l.nombre as 'localidad', p.nombre as 'provincia', cm.dominio as 'camion' from choferes c 
            left join localidades l on l.id = c.id_localidad_fk
            left join provincias p on p.id = c.id_provincia_fk
            left join camiones cm on cm.id = c.id_camion_fk`
    if (req.body.activo != 't') {
        params.push(req.body.activo)
        query += ` where c.activo = ?`
    }
    query += ` order by c.activo`
    let choferes = await model.getChoferes(query, params)
    res.json(choferes)
}



exports.getChoferById = async (req, res) => {
    const getChoferById = await model.getChoferById(req.params.id)
    res.json(getChoferById[0])

}

//#region POST
exports.postAlta = async (req, res) => {
    const ValidarDatos = await Validar(req.body);
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
                text: '¡Hubo un error en modificar el chofer, intentalo nuevamente!',
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
                text: '¡Hubo un error en modificar el chofer, intentalo nuevamente!',
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
    let { IdChofer } = req.body
    try {
        let borrar = await model.borrar(IdChofer)
        console.log(borrar)
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
                text: 'Hubo un error en eliminar el chofer, intentalo nuevamente',
            })
        }
        
    } catch (error) {
        console.error(error)
        res.json({
            status: false,
            type: 'error',
            icon: 'error',
            title: 'Error!',
            text: 'No se puede eliminar este chofer, por que tiene un celular vinculado',
        })
    }
}
//#region FUNCIONES
async function Validar(body) {
    let getChoferById, getChoferByDocumento
    if (body.apellidoYNombre === "") return { status: false, type: 'error', title: 'Error', text: '¡Ingresa un nombre y apellido!' }
    if (body.documento === "") return { status: false, type: 'error', title: 'Error', text: '¡Ingresa un documento!' }
    if (body.id !== undefined) {
        getChoferById = await model.getChoferById(body.id)
        if (getChoferById[0].documento !== body.documento) {
            getChoferByDocumento = await model.getChoferByDocumento(body.documento)
            if (getChoferByDocumento.length === 1) {
                return {
                    status: false,
                    type: 'error',
                    icon: 'error',
                    title: 'Chofer ya existe!',
                    text: 'No se puede registrar este chofer por qué ya existe',
                }
            }
        }
    } else {
        getChoferByDocumento = await model.getChoferByDocumento(body.documento)
        if (getChoferByDocumento.length > 0) {
            return {
                status: false,
                type: 'error',
                icon: 'error',
                title: 'Chofer ya existe!',
                text: 'No se puede registrar este chofer por qué ya existe',
            }
        }
    }
    if (body.direccion.trim() === "") return { status: false, type: 'error', title: 'Error', text: '¡Ingresa una dirección!' }
    if (body.provincia === null || body.provincia === "") return { status: false, type: 'error', title: 'Error', text: '¡Selecciona una provincia!' }
    if (body.localidad === null || body.localidad === "") return { status: false, type: 'error', title: 'Error', text: '¡Selecciona una localidad!' }
    if (body.celular === "") return { status: false, type: 'error', title: 'Error', text: '¡Ingresa un número de celular!' }
    if (body.camion === null || body.camion === "") return { status: false, type: 'error', title: 'Error', text: '¡Selecciona un camión!' }
    return { status: true }
}