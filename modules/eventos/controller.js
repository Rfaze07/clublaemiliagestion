const mEventos = require("./model");

//Se puede mandar una accion, o el mensaje personalizado directamente. Si se manda la accion, se arma el mensaje automaticamente.
exports.insertarEvento = async ({
  usuario = 0,
  tabla,
  acc,
  registro = null,
  mensaje = null,
} = {}) => {
  let accion = acc == "a" ? "alta" : acc == "m" ? "modificar" : acc == "b" ? "Eliminar" : "otro";

  let obs = "";

  if (mensaje) obs = mensaje;
  else
    obs = `Usuario id ${usuario} realizó la acción ${accion} en la tabla ${tabla}.`;

  if (registro) {
    obs += ` Id registro afectado: ${registro}`;
  }

  try {
    await mEventos.insert({tabla: tabla, id_usuario_fk: usuario,  observacion: obs });
  } catch (error) {
    console.error(error);
  }
}