/**
 * Archivo   : MisPostulaciones.jsx
 * Propósito : El aprendiz ve el estado de sus postulaciones y puede retirarlas.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAutenticacion } from '../context/AutenticacionContexto';
import InsigniaEstado from '../components/InsigniaEstado';
import Alerta from '../components/Alerta';
import Cargando from '../components/Cargando';

export default function MisPostulaciones() {
  const { token } = useAutenticacion();
  const [postulaciones, setPostulaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.listarPostulaciones(token)
      .then((respuesta) => setPostulaciones(respuesta.datos))
      .catch((errorApi) => setError(errorApi.message))
      .finally(() => setCargando(false));
  }, [token]);

  async function retirar(idPostulacion) {
    if (!window.confirm('¿Retirar esta postulación?')) return;
    try {
      await api.eliminarPostulacion(idPostulacion, token);
      // Actualiza el estado quitando la postulación eliminada
      setPostulaciones((anteriores) => anteriores.filter((p) => p.id_postulacion !== idPostulacion));
    } catch (errorApi) {
      setError(errorApi.message);
    }
  }

  if (cargando) return <section className="contenedor"><Cargando /></section>;

  return (
    <section className="contenedor">
      <h1>Mis <span className="acento">postulaciones</span></h1>
      <Alerta mensaje={error} />
      {postulaciones.length === 0 ? (
        <div className="panel">
          <p className="vacio">Aún no te has postulado a ninguna oferta.</p>
          <Link className="boton boton-oro" to="/ofertas">Ver oportunidades</Link>
        </div>
      ) : (
        <div className="panel tabla-desplazable">
          <table>
            <thead><tr><th>Oferta</th><th>Empresa</th><th>Fecha</th><th>Estado</th><th>Acción</th></tr></thead>
            <tbody>
              {postulaciones.map((postulacion) => (
                <tr key={postulacion.id_postulacion}>
                  <td>{postulacion.oferta}</td>
                  <td>{postulacion.empresa}</td>
                  <td>{postulacion.fecha_postulacion.slice(0, 10)}</td>
                  <td><InsigniaEstado estado={postulacion.estado} /></td>
                  <td>
                    {postulacion.estado === 'PENDIENTE' && (
                      <button className="boton boton-peligro boton-pequeno" onClick={() => retirar(postulacion.id_postulacion)}>Retirar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
