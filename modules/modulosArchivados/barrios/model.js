//EJEMPLO
const { queryMYSQL } = require("../../database");
// const {queryMSSQL, queryMYSQL} = require("../../database");

// exports.pruebaMysql = (param) => {
//     return queryMYSQL("SELECT ? as mensaje",[param]);
// }

// exports.pruebaMSSQL = (param,base) => {
//     return queryMSSQL("SELECT ? as mensaje",[param],base);
// }

//#region GETS

exports.getBarrios = async (query, params) => {
    return queryMYSQL(query, params)
}


exports.getLocalidadesByProvincia = async idProvincia => {
    return queryMYSQL(`select * from localidades l where l.id_provincia = ?`, [idProvincia])
}

exports.getProvincias = async () => {
    return queryMYSQL(`select * from provincias p`)
}

exports.getBarrioByDesc = async desc => {
    return queryMYSQL(`select * from barrios d where d.descripcion = ?`, [desc])
}

exports.getBarrioById = async id => {
    return queryMYSQL(`select * from barrios b where b.id = ?`, [id])
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



//#region POST
exports.postAlta = async body => {
    return queryMYSQL(`
            insert into barrios (descripcion,desc_corta,id_localidad_fk,activo) values (?,?,?,1)
        `, [body.descripcion, body.descCorta, body.localidad])
}


// #region BORRAR
exports.borrar = async id => {
    return queryMYSQL(`delete from barrios where id = ?`, [id])
}


//#region UPDATE
exports.update = async body => {
    console.table(body);
    return queryMYSQL(`update barrios set descripcion = ?, desc_corta = ?, id_localidad_fk = ?, activo = ? where id = ?; `, [body.descripcion, body.descCorta, body.localidad, body.activo, body.id])
}