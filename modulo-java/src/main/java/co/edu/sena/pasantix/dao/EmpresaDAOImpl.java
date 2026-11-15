package co.edu.sena.pasantix.dao;

import co.edu.sena.pasantix.conexion.ConexionBD;
import co.edu.sena.pasantix.modelo.Empresa;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Implementación JDBC del DAO de empresas.
 * Usa PreparedStatement en todas las consultas para evitar inyección SQL.
 *
 * @author Iván Antonio Ovalle Barajas
 * @version 1.0
 */
public class EmpresaDAOImpl implements EmpresaDAO {

    private static final String SQL_INSERTAR =
            "INSERT INTO empresas (nit, razon_social, sector, correo, telefono, ciudad) VALUES (?, ?, ?, ?, ?, ?)";
    private static final String SQL_LISTAR =
            "SELECT * FROM empresas ORDER BY razon_social";
    private static final String SQL_BUSCAR_TEXTO =
            "SELECT * FROM empresas WHERE nit LIKE ? OR razon_social LIKE ? ORDER BY razon_social";
    private static final String SQL_BUSCAR_ID =
            "SELECT * FROM empresas WHERE id_empresa = ?";
    private static final String SQL_ACTUALIZAR =
            "UPDATE empresas SET nit = ?, razon_social = ?, sector = ?, correo = ?, telefono = ?, ciudad = ? "
            + "WHERE id_empresa = ?";
    private static final String SQL_ELIMINAR =
            "DELETE FROM empresas WHERE id_empresa = ?";

    @Override
    public int insertar(Empresa empresa) throws SQLException {
        try (Connection conexion = ConexionBD.obtenerConexion();
             PreparedStatement sentencia = conexion.prepareStatement(SQL_INSERTAR, Statement.RETURN_GENERATED_KEYS)) {
            asignarParametros(sentencia, empresa);
            sentencia.executeUpdate();
            try (ResultSet llaves = sentencia.getGeneratedKeys()) {
                return llaves.next() ? llaves.getInt(1) : 0;
            }
        }
    }

    @Override
    public List<Empresa> listarTodas() throws SQLException {
        try (Connection conexion = ConexionBD.obtenerConexion();
             PreparedStatement sentencia = conexion.prepareStatement(SQL_LISTAR);
             ResultSet resultado = sentencia.executeQuery()) {
            return convertirLista(resultado);
        }
    }

    @Override
    public List<Empresa> buscarPorTexto(String texto) throws SQLException {
        try (Connection conexion = ConexionBD.obtenerConexion();
             PreparedStatement sentencia = conexion.prepareStatement(SQL_BUSCAR_TEXTO)) {
            String patron = "%" + texto + "%";
            sentencia.setString(1, patron);
            sentencia.setString(2, patron);
            try (ResultSet resultado = sentencia.executeQuery()) {
                return convertirLista(resultado);
            }
        }
    }

    @Override
    public Optional<Empresa> buscarPorId(int idEmpresa) throws SQLException {
        try (Connection conexion = ConexionBD.obtenerConexion();
             PreparedStatement sentencia = conexion.prepareStatement(SQL_BUSCAR_ID)) {
            sentencia.setInt(1, idEmpresa);
            try (ResultSet resultado = sentencia.executeQuery()) {
                return resultado.next() ? Optional.of(convertirFila(resultado)) : Optional.empty();
            }
        }
    }

    @Override
    public boolean actualizar(Empresa empresa) throws SQLException {
        try (Connection conexion = ConexionBD.obtenerConexion();
             PreparedStatement sentencia = conexion.prepareStatement(SQL_ACTUALIZAR)) {
            asignarParametros(sentencia, empresa);
            sentencia.setInt(7, empresa.getIdEmpresa());
            return sentencia.executeUpdate() == 1;
        }
    }

    @Override
    public boolean eliminar(int idEmpresa) throws SQLException {
        try (Connection conexion = ConexionBD.obtenerConexion();
             PreparedStatement sentencia = conexion.prepareStatement(SQL_ELIMINAR)) {
            sentencia.setInt(1, idEmpresa);
            return sentencia.executeUpdate() == 1;
        }
    }

    /** Asigna los 6 parámetros comunes de INSERT y UPDATE. */
    private void asignarParametros(PreparedStatement sentencia, Empresa empresa) throws SQLException {
        sentencia.setString(1, empresa.getNit());
        sentencia.setString(2, empresa.getRazonSocial());
        sentencia.setString(3, empresa.getSector());
        sentencia.setString(4, empresa.getCorreo());
        sentencia.setString(5, empresa.getTelefono());
        sentencia.setString(6, empresa.getCiudad());
    }

    private List<Empresa> convertirLista(ResultSet resultado) throws SQLException {
        List<Empresa> empresas = new ArrayList<>();
        while (resultado.next()) {
            empresas.add(convertirFila(resultado));
        }
        return empresas;
    }

    /** Convierte la fila actual del ResultSet en un objeto Empresa. */
    private Empresa convertirFila(ResultSet resultado) throws SQLException {
        Empresa empresa = new Empresa();
        empresa.setIdEmpresa(resultado.getInt("id_empresa"));
        empresa.setNit(resultado.getString("nit"));
        empresa.setRazonSocial(resultado.getString("razon_social"));
        empresa.setSector(resultado.getString("sector"));
        empresa.setCorreo(resultado.getString("correo"));
        empresa.setTelefono(resultado.getString("telefono"));
        empresa.setCiudad(resultado.getString("ciudad"));
        Timestamp fecha = resultado.getTimestamp("fecha_registro");
        if (fecha != null) {
            empresa.setFechaRegistro(fecha.toLocalDateTime());
        }
        return empresa;
    }
}
