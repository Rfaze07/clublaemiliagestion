const { queryMYSQL } = require("../../database")


exports.getChoferes = async (query, params) => {
    return queryMYSQL(query, params)
}

exports.getCamiones = async () => {
    return queryMYSQL(`select * from camiones c`)
}

exports.getProvincias = async () => {
    return queryMYSQL(`select * from provincias p`)
}

exports.getLocalidadesByProvincia = async IdProvincia => {
    return queryMYSQL(`select * from localidades l where id_provincia = ?`,[IdProvincia])
}

exports.getChoferByDocumento = async documento => {
    return queryMYSQL(`select * from choferes c where c.documento = ?`, [documento])
}

exports.getChoferById = async id => {
    return queryMYSQL(`select * from choferes c where c.id = ?`, [id])
}

exports.postAlta = async body => {
    return queryMYSQL(`
        insert into choferes (
            apellidoynombre, documento, direccion,  
            id_localidad_fk, id_provincia_fk, celular, 
            id_camion_fk, activo
        ) values (
            ?, ?, ?, ?, ?, ?, ?, 1
        );
        `, [body.apellidoYNombre, body.documento, body.direccion, body.localidad, body.provincia, body.celular, body.camion])
}

exports.borrar = async id => {
    return queryMYSQL(`delete from choferes where id = ?`, [id])
}

exports.update = async body => {
    console.log(body);
    return queryMYSQL(`update choferes set apellidoynombre = ?, documento = ?, direccion = ?, id_localidad_fk = ?, id_provincia_fk = ?, celular = ?, id_camion_fk = ?, activo = ? where id = ?;
`, [body.apellidoYNombre, body.documento, body.direccion, body.localidad, body.provincia, body.celular, body.camion,body.activo,body.id])
}