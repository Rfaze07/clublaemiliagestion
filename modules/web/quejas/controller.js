const Quejas = require('./model');

exports.crear = async (req, res) => {
    try {
        const { anonimo, nombre, email, mensaje } = req.body;

        await Quejas.crear({
            anonimo: anonimo ? 1 : 0,
            nombre: anonimo ? null : nombre,
            email: anonimo ? null : email,
            mensaje
        });

        res.redirect('back');
    } catch (err) {
        console.error('Error en quejas:', err);
        res.status(500).send('Error al enviar la queja');
    }
};
