/**
 * Archivo   : inicializarBD.js
 * Propósito : Ejecutar el script database/pasantix.sql para crear la base
 *             de datos con sus tablas y datos de prueba.
 * Uso       : npm run db:init
 */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ quiet: true });

async function inicializarBaseDatos() {
  const rutaScript = path.join(__dirname, '..', '..', '..', 'database', 'pasantix.sql');
  const scriptSql = fs.readFileSync(rutaScript, 'utf8');

  // Se conecta SIN base de datos porque el script la crea.
  const conexion = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PUERTO) || 3306,
    user: process.env.DB_USUARIO || 'root',
    password: process.env.DB_CONTRASENA || '',
    multipleStatements: true
  });

  await conexion.query(scriptSql);
  await conexion.end();
  console.log('✅ Base de datos "pasantix" creada con datos de prueba.');
}

inicializarBaseDatos().catch((error) => {
  console.error('❌ No se pudo crear la base de datos:', error.message);
  console.error('   Revisa que MySQL (XAMPP) esté encendido y los datos del archivo .env');
  process.exit(1);
});
