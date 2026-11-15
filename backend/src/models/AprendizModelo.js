/**
 * Archivo   : AprendizModelo.js
 * Propósito : Operaciones CRUD de la tabla "aprendices".
 */
const pool = require('../config/db');

class AprendizModelo {
  static async listar() {
    const [filas] = await pool.query('SELECT * FROM aprendices ORDER BY apellidos, nombres');
    return filas;
  }

  static async buscarPorId(idAprendiz) {
    const [filas] = await pool.query('SELECT * FROM aprendices WHERE id_aprendiz = ?', [idAprendiz]);
    return filas[0] || null;
  }

  static async crear(aprendiz) {
    const [resultado] = await pool.query(
      `INSERT INTO aprendices (nombres, apellidos, documento, correo, telefono, programa, ficha, ciudad)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [aprendiz.nombres, aprendiz.apellidos, aprendiz.documento, aprendiz.correo, aprendiz.telefono,
        aprendiz.programa, aprendiz.ficha, aprendiz.ciudad]
    );
    return resultado.insertId;
  }

  static async actualizar(idAprendiz, aprendiz) {
    const [resultado] = await pool.query(
      `UPDATE aprendices SET nombres = ?, apellidos = ?, documento = ?, correo = ?, telefono = ?,
              programa = ?, ficha = ?, ciudad = ?
       WHERE id_aprendiz = ?`,
      [aprendiz.nombres, aprendiz.apellidos, aprendiz.documento, aprendiz.correo, aprendiz.telefono,
        aprendiz.programa, aprendiz.ficha, aprendiz.ciudad, idAprendiz]
    );
    return resultado.affectedRows;
  }

  static async eliminar(idAprendiz) {
    const [resultado] = await pool.query('DELETE FROM aprendices WHERE id_aprendiz = ?', [idAprendiz]);
    return resultado.affectedRows;
  }
}

module.exports = AprendizModelo;
