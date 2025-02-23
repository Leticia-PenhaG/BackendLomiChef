const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const logger = require("morgan");
const multer = require("multer");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const passport = require('passport');
const passportConfig = require('./config/passport');

// Se pasa la instancia de Express (app) al servidor HTTP
const server = http.createServer(app);

/*
 * INICIALIZAR FIREBASE ADMIN
 */
admin.initializeApp({
  credential : admin.credential.cert(serviceAccount) //archivo de configuraciones con firebase
})

const upload = multer({
  storage: multer.memoryStorage() //sirve para recibir en userRoutes una ruta para subir a firebase
})

// Inicialización passport
app.use(passport.initialize());

// Configuración passport (esto ejecuta la configuración que tienes en passport.js)
passportConfig(passport);

/*
 * RUTAS
 */
const users = require('./routes/usersRoutes');
const categories = require('./routes/categoriesRoutes');

const port = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.disable("x-powered-by");

app.set("port", port);

/*
 * Llamando a las rutas
 */
users(app, upload);
categories(app);

// Iniciar el servidor y escuchar en el puerto especificado
server.listen(port, "192.168.100.33", () => {
  console.log(
    `Aplicación de NodeJS en proceso ${process.pid} iniciada y escuchando en http://192.168.100.33:${port}`
  );
});

//Error Handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});

module.exports = {
  app: app,
  server: server,
};

//200 respuesta exitosa
//404 ruta no existe
//500 error interno del servidor
