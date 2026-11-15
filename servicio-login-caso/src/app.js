/**
 * Archivo   : app.js
 * Propósito : Configurar Express, las rutas del servicio y los errores.
 */
const express = require('express');
const controlador = require('./autenticacionControlador');

const app = express();
app.use(express.json());

app.get('/api', (req, res) => res.json({ exito: true, mensaje: 'Servicio de login funcionando.' }));
app.post('/api/registro', controlador.registrar);
app.post('/api/login', controlador.iniciarSesion);
app.get('/api/usuarios', controlador.listar);

// Ruta inexistente
app.use((req, res) => res.status(404).json({ exito: false, mensaje: 'Ruta no encontrada.' }));

// Errores generales (por ejemplo, JSON mal escrito)
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ exito: false, mensaje: 'El JSON enviado no es válido.' });
  }
  console.error(error);
  return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
});

module.exports = app;
