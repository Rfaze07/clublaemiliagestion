const model = require("./model")


exports.getLista = async (req, res) => {
    let { activo } = req.body
    const tipos_comprobantes = await model.getAll({ activo })
    res.json(tipos_comprobantes)
}