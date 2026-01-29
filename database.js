const MYSQL = require("mysql2");

//Pool
let connectionMYSQL = null;


//MYSQL
const configMYSQL = {
  user: process.env.DB_MYSQL_USER,
  password: process.env.DB_MYSQL_PASSWORD,
  host: process.env.DB_MYSQL_SERVER,
  port: process.env.DB_MYSQL_PORT || 3306,
  database: process.env.DB_MYSQL_NAME,
  dateStrings: true,
};

exports.initConnectionMYSQL = () => {
  return new Promise(async (resolve, reject) => {
    try {
      connectionMYSQL = await MYSQL.createPool(configMYSQL);
      resolve();
    } catch (er) {
      reject(er);
    }
  });
};

exports.getConnectionMYSQL = () => {
  return connectionMYSQL;
};


/**
 *
 * @param {string} sqlStr String sql. Utilizar placeholders '?' para insertar los parámetros. ejemplo: select * from tab where campo = ? and campo2 = ?
 * @param {array} params Array de valores. ejemplo: ['abc', 123, 'hola']. Deben estar en orden.
 * @returns Devuelve una promise con los resultados o el error
 *
 */

exports.queryMYSQL = (sqlStr, params) => {
  return new Promise((resolve, reject) => {
    console.log(sqlStr, params);
    connectionMYSQL.query(sqlStr, params, (err, rows, fields) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
