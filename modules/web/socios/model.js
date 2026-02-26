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

    // ✅ Insertar socio
    const sql = `
        INSERT INTO socios
        (fue_socio, tipo_socio, grupo_familiar, nombre, apellido, edad,
         fecha_nacimiento, dni, direccion, localidad, ocupacion, mail, telefono, deporte)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await db.queryMYSQL(sql, [
        data.fueSocio,
        data.tipoSocio,
        data.grupoFamiliar,
        data.nombre,
        data.apellido,
        data.edad,
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

    // ✅ Insertar familiares (1 a 4)
    if (data.grupoFamiliar && data.grupoFamiliar.toLowerCase() === "si") {

        for (let i = 1; i <= 4; i++) {

            const nombre = data[`nombreFamiliar${i}`];
            const apellido = data[`apellidoFamiliar${i}`];
            const edad = data[`edadFamiliar${i}`];
            const dni = data[`dniFamiliar${i}`];

            if (nombre && nombre.trim() !== "") {

                await db.queryMYSQL(
                    `INSERT INTO grupo_familiar 
                     (socio_id, nombre, apellido, edad, dni)
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                        socioId,
                        nombre,
                        apellido || null,
                        edad || null,
                        dni || null
                    ]
                );
            }
        }
    }

    return true;
};