const model = require('./model')
const mEmpleados = require('../empleados/model')
const mCargos = require('../cargos/model')
const bcrypt = require('bcryptjs')
const { validateEmail, changeToBoolean } = require("../../utils")

exports.getLista = async (req, res) => {
    const usuarios = await model.getAll();
    const { id } = req.session.user;

    
    res.render("usuarios/views/lista", {
        pagename: 'Lista de Usuarios',
        usuarios,
        unica: id
    });
}

exports.getAlta = async (req, res) => {
    const nivel = req.session.user.nivel;
    res.render("usuarios/views/alta", {
        pagename: 'Alta de usuario',
        nivel
    });
}

exports.postAlta = async (req, res) => {
    const { usuario, mail, clave, niveles, empleado } = req.body
    const { id } = req.session.user
    let resInsertUser=null

    if (!usuario.length || !mail.length || !clave.length) return res.json({ type: "error", title: "Error", text: "Complete todos los campos!" })
    const userExist = await model.getByName(usuario)
    if (userExist.length) return res.json({ type: "error", title: "Error", text: "El nombre de usuario ya existe" })
    if (!mail.length || !validateEmail(mail)) return res.json({ type: "error", title: "Error", text: "Ingrese un mail valido" })
    if (clave.length < 6) return res.json({ type: "error", title: "Error", text: "La clave debe contener al menos 6 caracteres!" })

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(clave, salt)
    
    if(String(empleado).trim().length > 0){        
        // INSERTO USUARIO
        resInsertUser = await model.insertEmpleado(usuario, mail, hash, niveles, empleado)

        // VERIFICO E INSERTO PERMISOS
        const resEmpleado = await mEmpleados.getById(empleado)
        const accesos = await mCargos.getAccesosByCargo(resEmpleado[0].id_cargo_fk)
        let query='INSERT INTO secr2 (unica, menu, a, b, c, m,x) VALUES '

        for (let i=0; i<accesos.length; i++) {
            query += `(${resInsertUser.insertId},${accesos[i].menu},${accesos[i].a},${accesos[i].b},${accesos[i].c},${accesos[i].m},${accesos[i].x})${accesos.length-1 == i ? ';' : ', '}`
        }

        await model.execQuery(query, [])

    }else{
        resInsertUser = await model.insert(usuario, mail, hash, niveles)
    }

    if (!resInsertUser.affectedRows) return res.json({ type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" })
    res.json({ type: "success", title: "Exito", text: "Usuario dado de alta correctamente" })
}

exports.getModificar = async (req, res) => {
    const { unica } = req.params;
    const usuario = await model.getById(unica);
    const empleados = await mEmpleados.getAllActivos()

    res.render('usuarios/views/modificar', {
        pagename: 'Modificar usuario',
        usuario: usuario[0],
        empleados
    });
}

exports.postModificar = async (req, res) => {
    if (!req.body.usuario.length || !req.body.mail.length) return res.json({ type: "error", title: "Error", text: "Complete todos los campos!" });
    const userExist = await model.getByName(req.body.usuario);
    if (userExist.length && userExist[0].unica != req.body.unica) return res.json({ type: "error", title: "Error", text: "El nombre de usuario ya existe" });
    if (!req.body.mail.length || !validateEmail(req.body.mail)) return res.json({ type: "error", title: "Error", text: "Ingrese un mail valido" });
   
    console.log(req.body.activa)
    req.body.activa = changeToBoolean(req.body.activa)

    let update
    if(req.body.empleado.length == 0)
        update = await model.update(req.body)
    else
        update = await model.updateEmpleado(req.body)


    if (!update.affectedRows) return res.json({ type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" });
    res.json({ type: "success", title: "Exito", text: "Solicitud procesada correctamente" });
}

exports.borrar = async (req, res) => {
    const { unica } = req.body;
    const { id } = req.session.user;

    await model.borrarSecr2(unica);
    const resultado = await model.borrar(unica);
    if (!resultado.affectedRows) return res.json({ type: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' });
    res.json({ type: 'success', title: 'Exito', text: 'Usuario borrado correctamente' });
}

exports.getPass = (req, res) => {
    res.render('usuarios/views/changePass', {
        pagename: 'Cambiar contraseña'
    });
}

exports.postPass = async (req, res) => {
    const { actual, nueva, nuevaConfirm } = req.body;
    const { id } = req.session.user;

    // Validaciones
    if (!actual.length || !nueva.length || !nuevaConfirm.length) return res.json({ type: "error", title: "Error", text: "Complete todos los campos" });
    if (nueva !== nuevaConfirm) return res.json({ type: "error", title: "Error", text: "Las claves deben coincidir" });
    if (nueva.length < 6) return res.json({ type: "error", title: "Error", text: "La clave debe tener al menos 6 caracteres" });
    const user = await model.getById(id);
    let ismatch = await comparePassword(actual, user[0].clave);
    if (!ismatch) return res.json({ type: "error", title: "Error", text: "Clave actual incorrecta. Intente nuevamente" });

    bcrypt.genSalt(10, (err, salt) => { //GENERO EL SALT PARA LA PASS
        bcrypt.hash(nueva, salt, async (err, hash) => { //HASHEO LA PASS
            const update = await model.updatePass(user[0].unica, hash);
            if (!update.affectedRows) return res.json({ type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" });
            res.json({ type: "success", title: "Exito", text: "Contraseña modificada correctamente" });
        });
    });
}

exports.restartPass = async (req, res) => {
    const { unica, pass } = req.body;
    const { id } = req.session.user;
    //const pass = '123456'; //valor por defecto..

    //longitud de pass
    if(pass.length < 6) return res.json({ type: "error", title: "Error", html: "La clave debe contener al menos 6 caracteres!" });

    const user = await model.getById(unica);

    bcrypt.genSalt(10, (err, salt) => { //GENERO EL SALT PARA LA PASS
        bcrypt.hash(pass, salt, async (err, hash) => { //HASHEO LA PASS
            await model.updatePass(user[0].unica, hash);
            res.send({ type: 'success', title: 'Exito', html: 'Reseteado Exitosamente. La clave es <b>\"'+pass+'\".</b>' });
        });
    });
}

function comparePassword(candidatePassword, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
            if (err) reject(err);
            resolve(isMatch);
        });
    });
}

exports.getAccesos = async (req, res) => {
    const idUsuario = req.params.id;
    const usuario = await model.getUsuarioById(idUsuario)
    let menues = await model.getMenues() // select contra la tabla pantallas; 
    let accesosxusuario = await model.getAccesosPorUsuario(idUsuario);
    const lastmenuid = await model.getLastMenuId();
    const lastAccesoIdDeUsuario = await model.getLastAccesoId(idUsuario);
    lastmenuid2 = lastmenuid[0].id;
    lastAccesoIdDeUsuario2 = lastAccesoIdDeUsuario[0].menu;
    let  usuarios = model.getUsuarios();
    if(lastmenuid2 != lastAccesoIdDeUsuario2){
        for (x = 0; x < menues.length; x++) {
            let secr2 = await model.verificarmenu(idUsuario, menues[x].id);
            if (secr2.length > 0) {
                
            } else {
                await model.insertMenu(idUsuario, menues[x].id);
            }
        }

        menues = await model.getMenues();
        accesosxusuario = await model.getAccesosPorUsuario(idUsuario);
    }

    res.render('usuarios/views/listaAccesos', {
        idUsuario,
        pagename: 'Lista de Accesos',
        menues,
        usuario_accesos: accesosxusuario,
        usuario: usuario[0],
        usuarios
    })
}

exports.updateAcceso = async (req, res) => {
    const { id_menu, acceso_short, value, id_usuario } = req.params;
    const resultado = await model.updateAcceso(id_usuario, id_menu, acceso_short, value);
    if (!resultado.affectedRows) return res.json({ type: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    res.json({ type: 'success', title: 'Exito', text: 'Se Actualizaron permisos correctamente' });
}

exports.getAccesosByUsuario = async (req, res) => {
    let { idUsuarioSelec } = req.body
    const permisos = await model.getAccesosPorUsuario(idUsuarioSelec)
    res.json(permisos)
}


exports.postGeneroUserPass = async (req, res) => {
    const empleado = await mEmpleados.getById(req.body.id)
    if(empleado.length == 0) return res.json({ status: false, icon: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud (1)' })

    const user = `${empleado[0].apellido}.${empleado[0].nombre}`
    const pass = `${empleado[0].apellido}${empleado[0].nombre}${empleado[0].nro_legajo}`
    const email = String(empleado[0].email).trim().length > 0 ? empleado[0].email : ''
    if(pass.length < 6) pass.padStart(6, '0')

    res.json({ status: true, user, pass, email})
}

exports.mercadopago = async (req, res) => {
    console.log(req.body)
    res.status(200).send('ok')
}