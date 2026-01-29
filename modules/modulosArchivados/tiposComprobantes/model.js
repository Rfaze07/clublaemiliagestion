const { queryMYSQL } = require("../../database")


exports.getAll = async ({ activo = null } = {}) => {
    let query = "SELECT * FROM tipos_comprobantes"
    let params = []
    if(activo){
        query += " WHERE activo=?"
        params.push(activo)
    }
    return await queryMYSQL(query, params)
}

exports.getById = async id => {
    return await queryMYSQL(`
        SELECT * 
        FROM tipos_comprobantes 
        WHERE id=?
    `, [id])
}

exports.getByCondicionVenta = async id_condicion_venta => {
    return await queryMYSQL(`
        SELECT tc.*, cvtc.predeterminado
        FROM tipos_comprobantes tc
        LEFT JOIN condicion_venta_tipo_comprobante cvtc ON cvtc.id_tipo_comprobante_fk = tc.id
        WHERE cvtc.id_condicion_venta_fk = ?
    `, [id_condicion_venta])
}

exports.getDisponiblesByCondicion = async condicion => {
    return await queryMYSQL(`
        SELECT tc.*
        FROM tipos_comprobantes tc
        WHERE tc.id NOT IN (
            SELECT cvtc.id_tipo_comprobante_fk
            FROM condicion_venta_tipo_comprobante cvtc
            WHERE cvtc.id_condicion_venta_fk = ?
        ) AND tc.activo = 1
    `, [condicion])
}