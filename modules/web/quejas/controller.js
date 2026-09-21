const Quejas = require('./model');
const axios = require('axios');

exports.crear = async (req, res) => {

    try {

        const {
            anonimo,
            nombre,
            email,
            mensaje
        } = req.body;

        // =========================
        // HONEYPOT
        // =========================

       if (req.body.website) {
            return res.status(400).send('Solicitud inválida.');
        }

        // =========================
        // TURNSTILE
        // =========================

        const token = req.body['cf-turnstile-response'];

        if (!token) {
            return res.status(400).send('Por favor, completá la verificación.');
        }

        const captcha = await axios.post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                secret: process.env.TURNSTILE_SECRET_KEY,
                response: token,
                remoteip: req.ip
            }
        );

        if (!captcha.data.success) {
            console.error('Turnstile rechazó la solicitud:', captcha.data);

            return res.status(403).send(
                'No se pudo verificar la solicitud. Intentá nuevamente.'
            );
        }

        // =========================
        // CREAR QUEJA
        // =========================

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