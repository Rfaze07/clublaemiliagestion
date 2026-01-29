const { queryMYSQL } = require("../../database")


exports.execQuery = (query, params) => {
    return queryMYSQL(query, params)
}

exports.getAll = () => {
	return queryMYSQL(`
        SELECT re.*, m.descripcion AS marcaTxt, ru.descripcion AS rubroTxt, d.descripcion AS depositoTxt
        FROM repuestos re 
        LEFT JOIN marcas m ON m.id = re.id_marca_fk 
        LEFT JOIN rubros ru ON ru.id = re.id_rubro_fk 
        LEFT JOIN depositos d ON d.id = re.id_deposito_fk 
        ORDER BY re.descripcion
    `, [])
}

exports.getAllbyActivo = a => {
	return queryMYSQL(`
        SELECT re.*, m.descripcion AS marcaTxt, ru.descripcion AS rubroTxt, d.descripcion AS depositoTxt
        FROM repuestos re 
        LEFT JOIN marcas m ON m.id = re.id_marca_fk 
        LEFT JOIN rubros ru ON ru.id = re.id_rubro_fk 
        LEFT JOIN depositos d ON d.id = re.id_deposito_fk 
        WHERE re.activo = ? 
        ORDER BY re.descripcion
    `, [a])
}

exports.getRepuestoByCodigo = codigo => {
	return queryMYSQL(`
        SELECT IF(COUNT(*) > 0, 1, 0) AS existe
        FROM repuestos 
        WHERE codigo =  ?
    `, [codigo])
}

exports.getById = id => {
	return queryMYSQL(`
        SELECT *
        FROM repuestos 
        WHERE id = ?
    `, [id])
}

exports.insert = o => {
    return queryMYSQL(`
        INSERT INTO repuestos (codigo, codigo_rep_original, descripcion, id_rubro_fk, 
                    id_marca_fk, valor, id_deposito_fk, minimo, punto_pedido, maximo, es_ficha, 
                    es_neumatico, observaciones, id_comprobantedetalle_fk) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `, [o.codigo, o.codigoOri, o.descripcion, o.rubro, o.marca, o.valor, o.deposito, 
        o.minimo, o.pedido, o.maximo, o.esFicha, o.esNeuma, o.observaciones, o.idComprobanteDetalle])
}

exports.update = o => {
    return queryMYSQL(`
        UPDATE repuestos 
        SET codigo=?, codigo_rep_original=?, descripcion=?, id_rubro_fk=?, id_marca_fk=?, id_deposito_fk=?, 
            valor=?, minimo=?, punto_pedido=?, maximo=?, es_ficha=?, es_neumatico=?, observaciones=?, activo=? 
        WHERE id = ?
    `, [o.codigo, o.codigoOri, o.descripcion, o.rubro, o.marca, o.deposito, o.valor, o.minimo, 
        o.pedido, o.maximo, o.esFicha, o.esNeuma, o.observaciones, o.activo, o.id])
}

exports.delete = id => {
    return queryMYSQL(`
        DELETE FROM repuestos 
        WHERE id = ?
    `, [id])
}

exports.deleteRepuestoFicha = id => {
    return queryMYSQL(`
        DELETE FROM repuestos_ficha 
        WHERE id_comprobantedetalle_fk = ?
    `, [id])
}

exports.puedoEliminarByRepuesto = idRepuesto => {
	return queryMYSQL(`
        SELECT IF(COUNT(*) > 0, 0, 1) AS puedoEliminar
        FROM repuestos_ficha 
        WHERE id_repuesto_fk = ?
    `, [idRepuesto])
}

exports.getAllByMarca = id =>{
    return queryMYSQL(`
        SELECT *
        FROM repuestos
        WHERE id_marca_fk = ?
        `, [id])
}