/**
 * Archivo   : db.js
 * Propósito : Crear y exportar el pool de conexiones a MySQL.
 * Un "pool" reutiliza conexiones abiertas y mejora el rendimiento.
 */
const mysql = require('mysql2/promise');
require('dotenv').config({ quiet: true });

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PUERTO) || 3306,
  user: process.env.DB_USUARIO || 'root',
  password: process.env.DB_CONTRASENA || '',
  database: process.env.DB_NOMBRE || 'pasantix',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true // Devuelve las fechas como texto "AAAA-MM-DD"
});

module.exports = pool;
