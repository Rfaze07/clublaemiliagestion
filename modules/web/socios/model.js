const db = require('../../../database');

exports.insertSocio = async (data) => {

    // ✅ Validación básica
    if (!data.nombre || !data.apellido || !data.dni) {
        throw new Error("Datos obligatorios faltantes");
    }

    // ✅ Verificar DNI duplicado
    const existe = await db.queryMYSQL(
        "SELECT id FROM socios WHERE dni = ?",
        [data.dni]
    );

    if (existe.length > 0) {
        throw new Error("El DNI ya está registrado");
    }

    // ✅ Insertar socio titular
    const sql = `
        INSERT INTO socios
        (tipo_registro, fue_socio, tipo_socio, nombre, apellido,
         fecha_nacimiento, dni, direccion, localidad, ocupacion, mail, telefono, deporte)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await db.queryMYSQL(sql, [
        'titular',
        data.fueSocio,
        data.tipoSocio,
        data.nombre,
        data.apellido,
        data.fechaNacimiento,
        data.dni,
        data.direccion,
        data.localidad,
        data.ocupacion,
        data.mail,
        data.telefono,
        data.deporte
    ]);

    const socioId = result.insertId;

// ✅ Insertar familiares en la misma tabla
if (data.grupoFamiliar && data.grupoFamiliar.toLowerCase() === "si") {

    for (let i = 1; i <= 4; i++) {

        const nombre = data[`nombreFamiliar${i}`];
        const apellido = data[`apellidoFamiliar${i}`];
        const fechaNacimiento = data[`fechaNacimientoFamiliar${i}`];
        const dni = data[`dniFamiliar${i}`];

        if (nombre && nombre.trim() !== "") {

            await db.queryMYSQL(
                `INSERT INTO socios
                 (tipo_registro, socio_titular_id, nombre, apellido, fecha_nacimiento, dni)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    'familiar',
                    socioId,
                    nombre,
                    apellido || null,
                    fechaNacimiento || null,
                    dni || null
                ]
            );
        }
    }
}

    return true;
};