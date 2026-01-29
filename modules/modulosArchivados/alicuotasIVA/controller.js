const model = require('./model')


exports.getListaSelectAjax = async (req, res) => {
    try {
        const data = await model.getAllActivos()
        res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Error al obtener las alícuotas de IVA' })
    }
}

exports.getByIdAjax = async (req, res) => {
    try {
        const data = await model.getValorAlicuotaIvaById(req.body.id)
        res.json({ status: true, data: data[0].valor })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Error al obtener las alícuotas de IVA' })
    }
}