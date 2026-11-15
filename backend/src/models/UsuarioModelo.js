/**
 * Archivo   : UsuarioModelo.js
 * Propósito : Consultas SQL de la tabla "usuarios" (capa Modelo de MVC).
 */
const pool = require('../config/db');

class UsuarioModelo {
  static async buscarPorCorreo(correo) {
    const [filas] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return filas[0] || null;
  }

  static async buscarPorId(idUsuario) {
    const [filas] = await pool.query(
      'SELECT id_usuario, nombre, correo, rol, fecha_creacion FROM usuarios WHERE id_usuario = ?',
      [idUsuario]
    );
    return filas[0] || null;
  }

  /**
   * Crea el usuario y, según el rol, su perfil de empresa o de aprendiz
   * dentro de una transacción (si algo falla, no se guarda nada).
   */
  static async crearConPerfil({ nombre, correo, contrasenaHash, rol, perfil }) {
    const conexion = await pool.getConnection();
    try {
      await conexion.beginTransaction();
      const [resultado] = await conexion.query(
        'INSERT INTO usuarios (nombre, correo, contrasena_hash, rol) VALUES (?, ?, ?, ?)',
        [nombre, correo, contrasenaHash, rol]
      );
      const idUsuario = resultado.insertId;

      if (rol === 'EMPRESA') {
        await conexion.query(
          'INSERT INTO empresas (id_usuario, nit, razon_social, correo, ciudad) VALUES (?, ?, ?, ?, ?)',
          [idUsuario, perfil.nit, perfil.razon_social, correo, perfil.ciudad]
        );
      } else if (rol === 'APRENDIZ') {
        await conexion.query(
          `INSERT INTO aprendices (id_usuario, nombres, apellidos, documento, correo, programa, ciudad)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [idUsuario, perfil.nombres, perfil.apellidos, perfil.documento, correo, perfil.programa, perfil.ciudad]
        );
      }
      await conexion.commit();
      return idUsuario;
    } catch (error) {
      await conexion.rollback();
      throw error;
    } finally {
      conexion.release();
    }
  }

  /** Devuelve el id de la empresa o del aprendiz asociado al usuario. */
  static async obtenerIdPerfil(idUsuario, rol) {
    if (rol === 'EMPRESA') {
      const [filas] = await pool.query('SELECT id_empresa AS id FROM empresas WHERE id_usuario = ?', [idUsuario]);
      return filas[0] ? filas[0].id : null;
    }
    if (rol === 'APRENDIZ') {
      const [filas] = await pool.query('SELECT id_aprendiz AS id FROM aprendices WHERE id_usuario = ?', [idUsuario]);
      return filas[0] ? filas[0].id : null;
    }
    return null;
  }
}

module.exports = UsuarioModelo;
