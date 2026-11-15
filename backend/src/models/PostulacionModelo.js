/**
 * Archivo   : PostulacionModelo.js
 * Propósito : Operaciones CRUD de la tabla "postulaciones".
 */
const pool = require('../config/db');

const CONSULTA_BASE = `
  SELECT p.*, o.titulo AS oferta, e.razon_social AS empresa,
         CONCAT(a.nombres, ' ', a.apellidos) AS aprendiz
  FROM postulaciones p
  INNER JOIN ofertas o    ON o.id_oferta = p.id_oferta
  INNER JOIN empresas e   ON e.id_empresa = o.id_empresa
  INNER JOIN aprendices a ON a.id_aprendiz = p.id_aprendiz`;

class PostulacionModelo {
  static async listar(filtros = {}) {
    const condiciones = [];
    const valores = [];
    if (filtros.idAprendiz) { condiciones.push('p.id_aprendiz = ?'); valores.push(filtros.idAprendiz); }
    if (filtros.idEmpresa) { condiciones.push('o.id_empresa = ?'); valores.push(filtros.idEmpresa); }
    if (filtros.idOferta) { condiciones.push('p.id_oferta = ?'); valores.push(filtros.idOferta); }
    const donde = condiciones.length > 0 ? ` WHERE ${condiciones.join(' AND ')}` : '';
    const [filas] = await pool.query(`${CONSULTA_BASE}${donde} ORDER BY p.fecha_postulacion DESC`, valores);
    return filas;
  }

  static async buscarPorId(idPostulacion) {
    const [filas] = await pool.query(`${CONSULTA_BASE} WHERE p.id_postulacion = ?`, [idPostulacion]);
    return filas[0] || null;
  }

  static async crear({ id_oferta, id_aprendiz, comentario }) {
    const [resultado] = await pool.query(
      'INSERT INTO postulaciones (id_oferta, id_aprendiz, comentario) VALUES (?, ?, ?)',
      [id_oferta, id_aprendiz, comentario || null]
    );
    return resultado.insertId;
  }

  static async actualizarEstado(idPostulacion, estado, comentario) {
    const [resultado] = await pool.query(
      'UPDATE postulaciones SET estado = ?, comentario = COALESCE(?, comentario) WHERE id_postulacion = ?',
      [estado, comentario || null, idPostulacion]
    );
    return resultado.affectedRows;
  }

  static async eliminar(idPostulacion) {
    const [resultado] = await pool.query('DELETE FROM postulaciones WHERE id_postulacion = ?', [idPostulacion]);
    return resultado.affectedRows;
  }
}

module.exports = PostulacionModelo;
