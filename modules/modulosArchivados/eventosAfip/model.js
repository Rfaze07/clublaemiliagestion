const { queryMYSQL } = require("../../database")

exports.insert = (error, obs, objeto_enviado, resultado) => {
  return queryMYSQL(`
      INSERT INTO eventos_afip (fecha, error, observaciones, objeto_enviado, resultado)
      VALUES (NOW(),?,?,?,?)
  `, [error, obs, objeto_enviado, resultado])
}