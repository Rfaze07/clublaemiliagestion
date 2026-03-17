require("dotenv").config();
const express = require("express");
const app = express();
const cons = require("consolidate");
require("swig");
const redis = require("redis");
const session = require("express-session");
let RedisStore = require("connect-redis").default;
let redisClient = redis.createClient({url : 'redis://127.0.0.1:6379'});
const compression = require("compression");
const port = process.env.PORT || 3000;
const menues = require("./menu");
const db = require("./database");
const quejasRoutes = require('./modules/web/quejas/routes');
const seccionesWebModel = require('./modules/web/secciones/model');


app.use(compression());

app.use(
  session({
    name: "sessionCookie$Tp#-agG3eTg7GP0Nq",
    secret: process.env.SECRETKEY,
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false
  })
);

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

app.engine("html", cons.swig);
app.set("view engine", "html");
app.set("views", __dirname + "/modules");
app.use(express.static(__dirname + "/public"));

app.use(async function (req, res, next) {
  if (req.session.user != null) {
    res.locals.user = req.session.user;
  }
  res.locals.menu = await menues.getMenuHTML();
  try {
    res.locals.seccionesNav = await seccionesWebModel.getAllActivas();
  } catch(e) {
    res.locals.seccionesNav = [];
  }
  next();
});

// Parse request bodies before registering routes that use `req.body`
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(require("./modules/backup/routes"));
app.use(require("./modules/programador/routes"));
app.use(require("./modules/index/routes"));
app.use(require("./modules/usuarios/routes"));
app.use(require("./modules/categorias/routes"));
app.use(require("./modules/subCategorias/routes"));
app.use(require("./modules/productos/routes"));
app.use(require("./modules/clientes/routes"));
app.use(require("./modules/tiposDocumentosAfip/routes"));
app.use(require("./modules/deportes/routes"));
app.use(require("./modules/secciones/routes"));
app.use(require("./modules/quejas/routes"));
app.use(require("./modules/Solicitudes/routes"));
app.use(require("./modules/parametros/routes"));
app.use(require("./modules/provincias/routes"));
app.use(require("./modules/localidades/routes"));






app.use(require("./modules/equipos/routes"));
app.use(require("./modules/jugadores/routes"));
app.use(require("./modules/partidos/routes"));
app.use(require("./modules/noticias/routes"));
app.use(require("./modules/web/index/routes"));
app.use('/web', require('./modules/web/socios/routes'));
//app.use(require("./modules/web/equipos/routes"));
//app.use(require("./modules/web/partidos/routes"));
app.use(require("./modules/web/noticias/routes"));
app.use(require("./modules/web/deportes/routes"));
//app.use(require("./modules/web/lideres/routes"));
app.use(require('./modules/web/secciones/routes'));
app.use('/quejas', quejasRoutes);

(async function () {
  try {
    await redisClient.connect();
    console.log("Redis iniciado...");
    await db.initConnectionMYSQL();
    console.log("Conexión a MySQL establecida...");
    app.listen(port, async (error) => {
      if (error) throw error;
      console.log(`Escuchando en el puerto ${port}`);
    });
  } catch (er) {
    console.error(er);
    process.exit();
  }
})();