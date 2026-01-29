const mUsuarios = require("../usuarios/model")
//const mAlertas = require("../alertas/model")
const mEventos = require("../eventos/model")
//const mVencimientos = require("../vencimientos/model")
const bcrypt = require("bcryptjs")
const utils = require('../../utils')


exports.getInicio = async (req, res) => {
    res.render('index/views/inicio', {
        pagename: 'Inicio'
    })
}

exports.getLogin = async (req, res) => {
    res.render('login')
}

exports.postLogin = async (req, res) => {
    const { user, pass } = req.body

    if (!user.length || !pass.length) return res.json({ icon: "error", title: "Error", text: 'Complete los campos' })

    if(user == process.env.DEV_USER && pass == process.env.DEV_PASSWORD){
        req.session.user = {
            id: 0,
            nombre: process.env.DEV_USER,
            grupo: 0,
            mail: '',
            usuario: {},
            developer : true,
            nivel : 'Developer',
            id_cargo_fk: 1,
            cargoTxt: 'Developer'
        }
        
        req.session.auth = true
        req.session.save()
        console.log('\n ---------------- USUARIO ----------------\n', req.session.user, '\n')
        return res.json({ status: true })
    }
    
    const usuario = await mUsuarios.getByName(user)
    if (!usuario.length) return res.json({ icon: 'error', title: 'Error', text: 'Usuario o clave incorrectos' })
    const result = await comparePassword(pass, usuario[0].clave)
    if (!result) return res.json({ icon: "error", title: "Error", text: 'Usuario o clave incorrectos' })
    if (usuario[0].activa == 0) return res.json({ icon: "error", title: "Error", text: 'Usuario no activo' })
    if (!usuario.length) return res.json({ icon: 'error', title: 'Error', text: 'Usuario o clave incorrectos' })

    req.session.user = {
        id: usuario[0].unica,
        nombre: usuario[0].usuario,
        grupo: 0,
        mail: usuario[0].mail,
        usuario: usuario[0],
        nivel : usuario[0].niveles,
        id_cargo_fk: usuario[0].id_cargo_fk,
        cargoTxt: usuario[0].cargoTxt
    }
    
    req.session.auth = true
    req.session.save()
    await mEventos.insert(usuario[0].unica, "Login", `login: ${usuario[0].usuario}`, "secr")
    
    console.log('\n ---------------- USUARIO ----------------\n', req.session.user, '\n')
    return res.json({ status: true })
}

exports.postLogout = (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            res.redirect('/')
        } else {
            console.log(err)
        }
    })
}

// exports.getNotificaciones = async (req, res) => {
//     let notificaciones = await mUsuarios.getNotis(req.session.user.id)
//     notificaciones = notificaciones.map(noti => {
//         return {...noti, texto : noti.texto.replace(/(?:\\[rn]|[\r\n]+)+/g, "</br>")}
//     })
//     res.json(notificaciones)
// }

exports.postNotisVisto = async (req, res) => {
    let notis = req.body.notificaciones
    if(notis){
        notis.forEach(async noti => {
            let check = await mUsuarios.checkeaNotiVisto(noti.id, req.session.user.id)
            if(check.length == 0){
                await mUsuarios.updateNotiVisto(noti.id, req.session.user.id)
            }
        })
        res.json({ icon: "success", title: "Ok", text: "Notificaciones marcadas como leídas." })
    } else {
        res.json({icon:'success', title: 'Ok', text: 'Nada para marcar....'})
    }
}

function comparePassword(candidatePassword, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
            if (err) reject(err);
            resolve(isMatch);
        });
    });
}



/********************************
            ALERTAS
********************************/

exports.getAlertas = async (req, res) => {
    const alertasCargo = await mAlertas.getAlertasByCargo(req.session.user.id_cargo_fk)
    const alertas = await mAlertas.getProximosVencimientos()
    res.json({ alertasCargo: alertasCargo[0], alertas })
}

exports.postObtenerInformacion = async (req, res) => {
    const renovacion = await mAlertas.getRenovarProximo(req.body.id)
    res.json({ renovacion: renovacion[0] })
}

exports.postAccion = async (req, res) => {
    try {
        let result = null
        const vencimiento = await mVencimientos.getById(req.body.id)
        let o = {
            tipoDocumentacion: vencimiento[0].id_tipodocumentacion_fk, 
            documentacion: vencimiento[0].id_documentacion_fk, 
            empleado: vencimiento[0].id_empleado_fk, 
            vehiculo: vencimiento[0].id_vehiculo_fk, 
            descripcion: vencimiento[0].descripcion, 
            observaciones: vencimiento[0].observaciones, 
            unica: req.session.user.id
        }

        if(req.body.tipo === 'r'){
            const renovacion = await mAlertas.getRenovarProximo(req.body.id)
            o.fechaVenc = renovacion[0].nuevaVigencia
        }else if(req.body.tipo === 'rf'){
            o.fechaVenc = utils.changeDateYMD(req.body.fechaVenc)
        }

        result = await mVencimientos.insert(o)
        if(result.affectedRows > 0){
            await mVencimientos.updateRenovacion(req.body.id)
            return res.json({ status: true, icon: 'success', title: 'Éxito', text: 'Solicitud procesada correctamente' })
        }else{
            return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
        }
        
    } catch (error) {
        console.log(error)
        return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    }
}