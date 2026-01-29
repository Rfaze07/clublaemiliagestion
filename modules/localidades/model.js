const { queryMYSQL } = require("../../database")


exports.getLocalidades = async IdProvincia => {
    return queryMYSQL(`
        SELECT l.id, l.descripcion AS localidad, l.cp, p.descripcion AS provincia
        FROM localidades l
        LEFT JOIN provincias p ON p.id = l.id_provincia_fk
        WHERE l.id_provincia_fk = ? AND LENGTH(RTRIM(LTRIM(l.descripcion))) > 0
        ORDER BY l.descripcion ASC
    `,[IdProvincia])
}

exports.getLocalidadById = async id => {
    return queryMYSQL(`
        SELECT * 
        FROM localidades
        WHERE id = ?
    `,[id])
}

exports.getProvincias = async () =>{
    return queryMYSQL(`select * from provincias p order by descripcion ASC`)
}

exports.getLocalidadExiste = async o => {
    return queryMYSQL(`
        SELECT IF(COUNT(descripcion) > 0, 1, 0) AS existe
        FROM localidades
        WHERE id_provincia_fk = ? AND descripcion = ?
    `, [o.idProvincia, o.descripcion])
}

exports.getCPExiste = async o => {
    return queryMYSQL(`
        SELECT IF(COUNT(cp) > 0, 1, 0) AS existe
        FROM localidades
        WHERE cp = ?
    `, [o.cp])
}

exports.insert = async o => {
    return queryMYSQL(`
        INSERT INTO localidades (id_provincia_fk, descripcion, cp)
        VALUES (?,?,?)
    `, [o.idProvincia, o.descripcion, o.cp])
}

exports.delete = async id => {
    return queryMYSQL(`
        DELETE FROM localidades
        WHERE id = ?
    `, [id])
}

exports.getLocalidadesByProvincia = async idProvincia => {
    return queryMYSQL(`select * from localidades l where l.id_provincia = ? ORDER BY l.descripcion ASC`, [idProvincia])
}

exports.getProvinciasByLocalidad = async idLocalidad => {
    return queryMYSQL(`
        select 
            p.id as 'idProvincia' 
        from 
            localidades l 
        left join provincias p 
            on p.id = l.id_provincia where l.id = ?`, [idLocalidad])
}