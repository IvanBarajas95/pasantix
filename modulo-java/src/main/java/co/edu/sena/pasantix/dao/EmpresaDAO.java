package co.edu.sena.pasantix.dao;

import co.edu.sena.pasantix.modelo.Empresa;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

/**
 * Contrato (interfaz) con las operaciones CRUD de empresas.
 * Separa "qué" se hace de "cómo" se hace (patrón DAO).
 *
 * @author Iván Antonio Ovalle Barajas
 * @version 1.0
 */
public interface EmpresaDAO {

    /** Inserta la empresa y devuelve el id generado. */
    int insertar(Empresa empresa) throws SQLException;

    /** Consulta todas las empresas ordenadas por razón social. */
    List<Empresa> listarTodas() throws SQLException;

    /** Busca empresas cuyo NIT o razón social contengan el texto. */
    List<Empresa> buscarPorTexto(String texto) throws SQLException;

    /** Consulta una empresa por su id. */
    Optional<Empresa> buscarPorId(int idEmpresa) throws SQLException;

    /** Actualiza los datos; devuelve true si se modificó una fila. */
    boolean actualizar(Empresa empresa) throws SQLException;

    /** Elimina la empresa; devuelve true si se eliminó una fila. */
    boolean eliminar(int idEmpresa) throws SQLException;
}
