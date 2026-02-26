const model = require('./model');

exports.getInscripcion = async (req, res) => {
    try {

        res.render('web/socios/views/index', {
            pagename: "Inscripción Socio",
            query: req.query   // 🔥 IMPORTANTE
        });

    } catch (error) {
        console.log(error);
        res.redirect('/inicio');
    }
};


exports.postInscripcion = async (req, res) => {

    try {

        await model.insertSocio(req.body);

        return res.redirect('/web/socios?ok=1');

    } catch (error) {

        if (error.message === "El DNI ya está registrado") {
            return res.redirect('/web/socios?dni=1');
        }

        console.log(error);
        return res.redirect('/web/socios?error=1');
    }
};