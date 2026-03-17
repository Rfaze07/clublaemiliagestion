const model = require('./model')
const utils = require('../../utils')
const eventos = require("../eventos/controller")

exports.getLista = async (req, res) => {
    try {
        res.render('quejas/views/index', {
            pagename: "Quejas",
            permisos: req.session.user.permisos
        })
    }
    catch (error) {
        console.log(error)
        res.redirect('/inicio')
    }
}

exports.getListaAjax = async (req, res) => {
    try {

        let { desde, hasta, estado } = req.body

        desde = utils.changeDateYMD(desde)
        hasta = utils.changeDateYMD(hasta)

        let where = []
        let params = []

        if (desde) {
            where.push("DATE(fecha) >= ?")
            params.push(desde)
        }

        if (hasta) {
            where.push("DATE(fecha) <= ?")
            params.push(hasta)
        }

        if (estado !== undefined && estado !== "") {
            where.push("leida = ?")
            params.push(estado)
        }

        let sql = `
            SELECT *
            FROM quejas
        `

        if (where.length > 0) {
            sql += " WHERE " + where.join(" AND ")
        }

        sql += " ORDER BY fecha DESC"

        let data = await model.execQuery(sql, params)

        if (!data.length) {
            return res.json({
                status: false,
                icon: "warning",
                title: "Alerta",
                text: "No existen registros cargados"
            })
        }

        res.json({ status: true, data })

    } catch (error) {

        console.log(error)

        return res.json({
            status: false,
            icon: "error",
            title: "Error",
            text: "Hubo un error al procesar la solicitud"
        })
    }
}

exports.getByIdAjax = async (req, res) => {
    try {
        let id = req.body.id
        let data = await model.getById(id)
        return res.json({ status: true, data })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, type: 'error', text: 'Error del servidor' })
    }
}
exports.updateEstado = async (req, res) => {
    try {

        const { id, leida } = req.body

        await model.update({
            id,
            leida
        })

        return res.json({
            status: true
        })

    } catch (error) {

        console.log(error)

        return res.json({
            status: false,
            text: "Error al actualizar estado"
        })
    }
}
