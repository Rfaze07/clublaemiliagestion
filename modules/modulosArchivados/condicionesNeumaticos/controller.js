const model = require('./model')


exports.getListaActivosAjaxSelect = async (req, res) => {
    try {
        const data = await model.getAllActivos()
        if(!data.length) return res.json({ status: false, icon:"warning", title: "Alerta", text: "No existen repuestos cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}