const model = require('./model')

exports.getLista = async (req, res) => {

    try {

        res.render('Solicitudes/views/index', {
            pagename: "Solicitudes",
            permisos: req.session.user.permisos
        })

    } catch (error) {

        console.log(error)

        res.redirect('/inicio')

    }

}



exports.getListaAjax = async (req, res) => {

    try {

        const { desde, hasta } = req.body

        let data = await model.getAll(desde, hasta)

        if (!data.length) {

            return res.json({
                status: false,
                text: "No existen solicitudes"
            })

        }

        res.json({
            status: true,
            data
        })

    } catch (error) {

        console.log(error)

        res.json({
            status: false,
            text: "Error al cargar solicitudes"
        })

    }

}



exports.getByIdAjax = async (req, res) => {

    try {

        const id = req.body.id;

        // 🔹 1. Traer registro clickeado
        let registro = await model.getById(id);

        if (!registro || !registro.length) {
            return res.json({
                status: false,
                text: "Solicitud no encontrada"
            });
        }

        registro = registro[0];

        // 🔹 2. Determinar titular
        let titularId = registro.tipo_registro === "titular"
            ? registro.id
            : registro.socio_titular_id;

        // 🔹 3. Traer grupo completo
        let grupo = await model.getGrupoFamiliar(titularId);

        // 🔹 4. Separar titular y familiares
        let titular = grupo.find(g => g.tipo_registro === "titular");
        let familiares = grupo.filter(g => g.tipo_registro === "familiar");

        res.json({
            status: true,
            data: {
                titular,
                familiares
            }
        });

    } catch (error) {

        console.log(error);

        res.json({
            status: false,
            text: "Error del servidor"
        });

    }

};