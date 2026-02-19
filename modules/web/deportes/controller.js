const model = require('./model')

exports.getLista = async (req, res) => {
    try {
        res.render('web/deportes/views/index', {
            pagename: "Deportes",
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.getListaAjax = async (req, res) => {
    try {
        let data = await model.getAll()
        if (!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No hay deportes cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}
