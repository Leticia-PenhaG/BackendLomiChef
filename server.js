const express = require('express');
const app = express();
const http = require('http');

// Se pasa la instancia de Express (app) al servidor HTTP
const server = http.createServer(app);

const port = process.env.PORT || 3000;

app.set('port', port);

// Iniciar el servidor y escuchar en el puerto especificado
server.listen(port, '192.168.100.33', () => {
    console.log(`Aplicación de NodeJS en proceso ${process.pid} iniciada y escuchando en http://192.168.100.33:${port}`);
});
