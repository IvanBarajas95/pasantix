/**
 * Archivo   : EmpresaModelo.js
 * Propósito : Operaciones CRUD de la tabla "empresas".
 */
const pool = require('../config/db');

class EmpresaModelo {
  static async listar() {
    const [filas] = await pool.query('SELECT * FROM empresas ORDER BY razon_social');
    return filas;
  }

  static async buscarPorId(idEmpresa) {
    const [filas] = await pool.query('SELECT * FROM empresas WHERE id_empresa = ?', [idEmpresa]);
    return filas[0] || null;
  }

  static async crear(empresa) {
    const [resultado] = await pool.query(
      `INSERT INTO empresas (nit, razon_social, sector, correo, telefono, ciudad)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [empresa.nit, empresa.razon_social, empresa.sector, empresa.correo, empresa.telefono, empresa.ciudad]
    );
    return resultado.insertId;
  }

  static async actualizar(idEmpresa, empresa) {
    const [resultado] = await pool.query(
      `UPDATE empresas SET nit = ?, razon_social = ?, sector = ?, correo = ?, telefono = ?, ciudad = ?
       WHERE id_empresa = ?`,
      [empresa.nit, empresa.razon_social, empresa.sector, empresa.correo, empresa.telefono, empresa.ciudad, idEmpresa]
    );
    return resultado.affectedRows;
  }

  static async eliminar(idEmpresa) {
    const [resultado] = await pool.query('DELETE FROM empresas WHERE id_empresa = ?', [idEmpresa]);
    return resultado.affectedRows;
  }
}

module.exports = EmpresaModelo;
