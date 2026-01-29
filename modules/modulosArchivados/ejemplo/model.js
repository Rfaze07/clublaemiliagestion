//EJEMPLO
const { queryMYSQL} = require("../../database");
// const {queryMSSQL, queryMYSQL} = require("../../database");

exports.pruebaMysql = (param) => {
    return queryMYSQL("SELECT ? as mensaje",[param]);
}

// exports.pruebaMSSQL = (param,base) => {
//     return queryMSSQL("SELECT ? as mensaje",[param],base);
// }

