const { queryMYSQL } = require('../../../database');

exports.crear = ({ anonimo, nombre, email, mensaje }) => {
    const sql = `
        INSERT INTO quejas
        (anonimo, nombre, email, mensaje, fecha)
        VALUES (?, ?, ?, ?, NOW())
    `;

    return queryMYSQL(sql, [
        anonimo,
        nombre,
        email,
        mensaje
    ]);
};
