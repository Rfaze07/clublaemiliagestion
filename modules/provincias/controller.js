const model = require('./model')


exports.getProvincias = async (req, res) => {
    res.render('provincias/views/index', {
        pagename: "Provincias"
    })
}

exports.getListaProvincias = async (req, res) => {
    let result = await ObtenerProvincias()
    res.json(result)
}

exports.getListaSelectProvincias = async (req, res) => {
    let result = await ObtenerProvincias()
    res.json(result)
}

const ObtenerProvincias = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await model.getProvincias()
            resolve({ status: true, data })
        } catch (error) {
            console.log(error)
            resolve({ status: false, type: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        }
    })
}