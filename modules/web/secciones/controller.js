const model = require('./model')

exports.getDetalle = async (req, res) => {
    try {
        const id = req.params.id
        const [secciones, subSecciones] = await Promise.all([
            model.getById(id),
            model.getSubSeccionesBySeccionId(id)
        ])

        if (!secciones.length) return res.redirect('/')

        res.render('web/secciones/views/detalle', {
            pagename: secciones[0].titulo,
            seccion: secciones[0],
            subSecciones
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}
