/**
 * Archivo   : server.js
 * Propósito : Iniciar la base de datos y levantar el servidor.
 */
require('dotenv').config({ quiet: true });
const app = require('./app');
const { inicializarBaseDatos } = require('./db');

const PUERTO = Number(process.env.PUERTO) || 4000;

inicializarBaseDatos()
  .then(() => {
    app.listen(PUERTO, () => console.log(`✅ Servicio de login en http://localhost:${PUERTO}/api`));
  })
  .catch((error) => {
    console.error('❌ No se pudo conectar a MySQL:', error.message);
    console.error('   Enciende MySQL en el panel de XAMPP y vuelve a ejecutar: npm start');
    process.exit(1);
  });
