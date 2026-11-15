/**
 * Archivo   : app.js
 * Propósito : Configurar la aplicación Express: middlewares, rutas y errores.
 */
const express = require('express');
const cors = require('cors');

const autenticacionRutas = require('./routes/autenticacionRutas');
const empresaRutas = require('./routes/empresaRutas');
const aprendizRutas = require('./routes/aprendizRutas');
const ofertaRutas = require('./routes/ofertaRutas');
const postulacionRutas = require('./routes/postulacionRutas');
const { rutaNoEncontrada, manejarErrores } = require('./middlewares/manejoErrores');

const app = express();

app.use(cors());                          // Permite peticiones desde el frontend React
app.use(express.json({ limit: '100kb' })); // Convierte el cuerpo JSON en objeto

// Ruta de verificación rápida del servicio
app.get('/api', (req, res) => {
  res.json({ exito: true, mensaje: 'API de Pasantix funcionando 🚀', version: '1.0.0' });
});

app.use('/api/auth', autenticacionRutas);
app.use('/api/empresas', empresaRutas);
app.use('/api/aprendices', aprendizRutas);
app.use('/api/ofertas', ofertaRutas);
app.use('/api/postulaciones', postulacionRutas);

app.use(rutaNoEncontrada);
app.use(manejarErrores);

module.exports = app;
