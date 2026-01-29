const { queryMYSQL } = require("../../database");

exports.insert = async (data) => {
  return await queryMYSQL(
    "INSERT INTO eventos(tabla,id_usuario_fk,observacion) values(?,?,?)",
    [data.tabla, data.id_usuario_fk, data.observacion]
  );
};
