/**
 * Archivo   : OfertaModelo.js
 * Propósito : Operaciones CRUD de la tabla "ofertas" con filtros opcionales.
 */
const pool = require('../config/db');

const CONSULTA_BASE = `
  SELECT o.*, e.razon_social AS empresa, e.ciudad
  FROM ofertas o
  INNER JOIN empresas e ON e.id_empresa = o.id_empresa`;

class OfertaModelo {
  /** Lista ofertas; acepta filtros por estado, modalidad, empresa y texto. */
  static async listar(filtros = {}) {
    const condiciones = [];
    const valores = [];

    if (filtros.estado) { condiciones.push('o.estado = ?'); valores.push(filtros.estado); }
    if (filtros.modalidad) { condiciones.push('o.modalidad = ?'); valores.push(filtros.modalidad); }
    if (filtros.idEmpresa) { condiciones.push('o.id_empresa = ?'); valores.push(filtros.idEmpresa); }
    if (filtros.buscar) {
      condiciones.push('(o.titulo LIKE ? OR o.area LIKE ?)');
      valores.push(`%${filtros.buscar}%`, `%${filtros.buscar}%`);
    }

    const donde = condiciones.length > 0 ? ` WHERE ${condiciones.join(' AND ')}` : '';
    const [filas] = await pool.query(`${CONSULTA_BASE}${donde} ORDER BY o.fecha_publicacion DESC`, valores);
    return filas;
  }

  static async buscarPorId(idOferta) {
    const [filas] = await pool.query(`${CONSULTA_BASE} WHERE o.id_oferta = ?`, [idOferta]);
    return filas[0] || null;
  }

  static async crear(oferta) {
    const [resultado] = await pool.query(
      `INSERT INTO ofertas (id_empresa, titulo, descripcion, area, modalidad, cupos,
                            fecha_publicacion, fecha_cierre, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [oferta.id_empresa, oferta.titulo, oferta.descripcion, oferta.area, oferta.modalidad,
        oferta.cupos, oferta.fecha_publicacion, oferta.fecha_cierre, oferta.estado]
    );
    return resultado.insertId;
  }

  static async actualizar(idOferta, oferta) {
    const [resultado] = await pool.query(
      `UPDATE ofertas SET titulo = ?, descripcion = ?, area = ?, modalidad = ?, cupos = ?,
              fecha_publicacion = ?, fecha_cierre = ?, estado = ?
       WHERE id_oferta = ?`,
      [oferta.titulo, oferta.descripcion, oferta.area, oferta.modalidad, oferta.cupos,
        oferta.fecha_publicacion, oferta.fecha_cierre, oferta.estado, idOferta]
    );
    return resultado.affectedRows;
  }

  static async eliminar(idOferta) {
    const [resultado] = await pool.query('DELETE FROM ofertas WHERE id_oferta = ?', [idOferta]);
    return resultado.affectedRows;
  }
}

module.exports = OfertaModelo;
