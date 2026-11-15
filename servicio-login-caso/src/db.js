/**
 * Archivo   : db.js
 * Propósito : Conexión a MySQL. Al iniciar crea automáticamente la base
 *             de datos "login_caso" y la tabla "usuarios" si no existen.
 */
const mysql = require('mysql2/promise');
require('dotenv').config({ quiet: true });

const configuracion = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PUERTO) || 3306,
  user: process.env.DB_USUARIO || 'root',
  password: process.env.DB_CONTRASENA || ''
};
const NOMBRE_BD = process.env.DB_NOMBRE || 'login_caso';

let pool;

/** Crea la base de datos y la tabla (solo la primera vez). */
async function inicializarBaseDatos() {
  const conexion = await mysql.createConnection(configuracion);
  await conexion.query(`CREATE DATABASE IF NOT EXISTS \`${NOMBRE_BD}\` CHARACTER SET utf8mb4`);
  await conexion.end();

  pool = mysql.createPool({ ...configuracion, database: NOMBRE_BD, connectionLimit: 5, dateStrings: true });
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id_usuario      INT AUTO_INCREMENT PRIMARY KEY,
      usuario         VARCHAR(30)  NOT NULL UNIQUE,
      contrasena_hash VARCHAR(255) NOT NULL,
      fecha_registro  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);
}

function obtenerPool() {
  return pool;
}

module.exports = { inicializarBaseDatos, obtenerPool };
