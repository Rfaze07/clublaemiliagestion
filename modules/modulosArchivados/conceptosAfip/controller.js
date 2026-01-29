const model = require('./model')


exports.getListaActivosAjax = async (req, res) => {
    try {
        let data = await model.getAllActivos()
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen conceptos activos" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}