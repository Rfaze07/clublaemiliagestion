const mUsuarios = require("./modules/usuarios/model");
const fs = require("fs");
const path = require("path");
const permisosAdminDev = { c: 1, a: 1, m: 1, b: 1, x: 1 };

exports.auth = (req, res, next) => {
  const failCB = req.xhr
    ? () => {
      res.status(403);
      res.send("Error");
    }
    : () => {
      res.redirect("/");
    };
  if (req.session.auth) {
    return next();
  } else {
    failCB();
  }
};

exports.ifFileExist = async (archivo) => {
  const dirContents = fs.readdirSync("./public/img/productos", {
    withFileTypes: true,
  });
  const onlyJsFiles = dirContents.filter((file) => {
    return path.basename(file.name).includes(archivo);
  });
  return onlyJsFiles;
};

exports.checkAcceso = (accion) => {
  return async (req, res, next) => {
    // let url = req.route.path.split("/").filter((i) => i);
    // let rutaBase = "/" + url[0];

    let url='', rutaBase=''
    if(req.route.path.includes('/reportes/')) 
      rutaBase = req.route.path
    else{
      url = req.route.path.split("/").filter((i) => i);
      rutaBase = "/" + url[0]
    }
    
    let modulo = await mUsuarios.getModuloByRuta(rutaBase);
    if (!modulo.length) {
      if (req.xhr) {
        //Si es ajax..
        res.status(404);
        return res.send(
          `Error interno, no se encontró el modulo para la ruta especificada.`
        );
      } else {
        res.status(404);
        return res.render("error_permiso", {
          pagename: "Accesos al sistema",
          ip: req.ip.replace(/^.*:/, ""),
          error: `Error interno, no se encontró el modulo para la ruta especificada.`,
        });
      }
    }

    let nivel_requerido = modulo[0].nivel;

    //Si es solo para administradores..
    if (nivel_requerido == "Administrador") {
      if (
        req.session.user.niveles == "Administrador" ||
        req.session.user.developer
      ) {
        req.session.user.permisos = permisosAdminDev;
        req.session.save();
        return next();
      }

      if (req.xhr) {
        return res
          .status(401)
          .send("Necesita nivel de administrador para acceder a esta sección.");
      } else {
        res.render("error_permiso", {
          pagename: "Accesos al sistema",
          ip: req.ip.replace(/^.*:/, ""),
          error: `Necesita nivel de administrador para acceder a esta sección.`,
        });
      }
    }

    //Si requiere permisos de lista..

    let id_menu = modulo[0].id;
    let id_usuario = req.session.user.id;

    //Si es desarrollador puede entrar.
    if (req.session.user.developer) {
      req.session.user.permisos = permisosAdminDev;
      req.session.save();
      return next();
    }

    const user = await mUsuarios.VerificarNivelAdministracion(id_usuario);
    if (user.length) {
      //Si es admin puede entrar
      req.session.user.permisos = permisosAdminDev;
      req.session.save();
      return next();
    } else {
      //Si es nivel lista, checkear permisos.
      let acceso = await mUsuarios.verificarAcceso(id_usuario, id_menu, accion);

      if (acceso != null && acceso != "") {
        const permisos = await mUsuarios.verificarAccesosAll(
          id_usuario,
          modulo[0].id
        );
        req.session.user.permisos = permisos[0];
        req.session.save();

        if (accion == "c") acceso = acceso[0].c;
        if (accion == "a") acceso = acceso[0].a;
        if (accion == "m") acceso = acceso[0].m;
        if (accion == "b") acceso = acceso[0].b;
        if (accion == "x") acceso = acceso[0].x;
        if (acceso == 1) {
          return next();
        } else {
          let acciontxt = "";
          if (accion == "a") acciontxt = "al Alta";
          if (accion == "b") acciontxt = "a dar de Baja";
          if (accion == "m") acciontxt = "a Modificar";
          if (accion == "c") acciontxt = "a Consultar";
          if (accion == "x") acciontxt = "a acciones extra";

          if (req.xhr) {
            //Si es ajax..
            res.status(401);
            res.send(
              `No tiene acceso ${acciontxt} en el menú ${modulo[0].titulo} (id ${id_menu}). Comuniquese con el administrador.`
            );
          } else {
            res.render("error_permiso", {
              pagename: "Accesos al sistema",
              ip: req.ip.replace(/^.*:/, ""),
              error: `No tiene acceso ${acciontxt} en el menú ${modulo[0].titulo} (id ${id_menu}). Comuniquese con el administrador.`,
            });
          }
        }
      } else {
        if (req.xhr) {
          //Si es ajax..
          res.status(401);
          res.send(
            `${req.session.user.usuario}: Por favor verifique sus permisos de usuario con el administrador de accesos.`
          );
        } else {
          res.render("error_permiso", {
            pagename: "Accesos al sistema",
            ip: req.ip.replace(/^.*:/, ""),
            error: `${req.session.user.usuario}: Por favor verifique sus permisos de usuario con el administrador de accesos.`,
          });
        }
      }
    }
  };
};

//No es necesaria ya que checkAcceso valida si se requiere permiso de admin o de lista en base al nivel del módulo a consultar.
//Esta funcion puede utilizarse para proteger rutas que no figuren en la tabla pantallas.

exports.checkAdmin = async (req, res, next) => {
  if (req.session.user.nivel == "Administrador" || req.session.user.developer) {
    req.session.user.permisos = permisosAdminDev;
    req.session.save();
    return next();
  }

  if (req.xhr) {
    return res
      .status(401)
      .send("Necesita nivel de administrador para acceder a esta sección.");
  } else {
    res.render("error_permiso", {
      pagename: "Accesos al sistema",
      ip: req.ip.replace(/^.*:/, ""),
      error: `Necesita nivel de administrador para acceder a esta sección.`,
    });
  }
};

//Para proteger rutas donde solo el desarrollador puede ingresar.
exports.checkDev = async (req, res, next) => {
  if (req.session.user.developer) return next();
  if (req.xhr) {
    return res
      .status(401)
      .send("No tiene permiso para acceder a esta sección.");
  } else {
    res.render("error_permiso", {
      pagename: "Accesos al sistema",
      ip: req.ip.replace(/^.*:/, ""),
      error: `No posee acceso a esta sección`,
    });
  }
};
