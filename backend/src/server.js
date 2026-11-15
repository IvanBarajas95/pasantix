/**
 * Archivo   : server.js
 * Propósito : Punto de entrada. Levanta el servidor HTTP de la API.
 */
require('dotenv').config({ quiet: true });
const app = require('./app');
const pool = require('./config/db');

const PUERTO = Number(process.env.PUERTO) || 3000;

async function iniciarServidor() {
  try {
    await pool.query('SELECT 1'); // Comprueba la conexión a MySQL
    app.listen(PUERTO, () => {
      console.log(`✅ API de Pasantix escuchando en http://localhost:${PUERTO}/api`);
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a MySQL:', error.message);
    console.error('   1) Enciende MySQL en XAMPP.  2) Ejecuta: npm run db:init');
    process.exit(1);
  }
}

iniciarServidor();
