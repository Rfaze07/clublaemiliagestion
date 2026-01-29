const model = require('./model')


exports.getListaSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllbyActivo()
        if(!data.length) return res.json({ status: false, icon: "warning", title: "Alerta", text: "No existen registros cargados" })
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        res.json({ status: false, icon: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    }
}