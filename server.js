const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const logger = require('morgan');

// Se pasa la instancia de Express (app) al servidor HTTP
const server = http.createServer(app);

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());
app.disable('x-powered-by');


app.set('port', port);

// Iniciar el servidor y escuchar en el puerto especificado
server.listen(port, '192.168.100.33', () => {
    console.log(`Aplicación de NodeJS en proceso ${process.pid} iniciada y escuchando en http://192.168.100.33:${port}`);
});


app.get('/', (req, res) => {
    res.send(`Ruta raíz del backend`)
});

app.get('/test', (req, res) => {
    res.send(`Ruta test`)
});

//Error Handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

//200 respuesta exitosa
//404 ruta no existe
//500 error interno del servidor

