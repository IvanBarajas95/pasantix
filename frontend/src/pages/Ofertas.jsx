/**
 * Archivo   : Ofertas.jsx
 * Propósito : Listado de oportunidades con filtros y botón para aplicar.
 *             Lee el texto de búsqueda de la URL (?buscar=...).
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAutenticacion } from '../context/AutenticacionContexto';
import FiltroOfertas from '../components/FiltroOfertas';
import TarjetaOferta from '../components/TarjetaOferta';
import Cargando from '../components/Cargando';
import Alerta from '../components/Alerta';

export default function Ofertas() {
  const { usuario, token } = useAutenticacion();
  const navegar = useNavigate();
  const [parametros] = useSearchParams();
  const [filtros, setFiltros] = useState({ buscar: parametros.get('buscar') || '', modalidad: '', estado: 'ABIERTA' });
  const [ofertas, setOfertas] = useState([]);
  const [idsPostulados, setIdsPostulados] = useState(new Set());
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: 'exito', texto: '' });

  // Se vuelve a consultar cada vez que cambian los filtros.
  useEffect(() => {
    setCargando(true);
    const temporizador = setTimeout(() => {
      api.listarOfertas(filtros)
        .then((respuesta) => setOfertas(respuesta.datos))
        .catch((error) => setMensaje({ tipo: 'error', texto: error.message }))
        .finally(() => setCargando(false));
    }, 300); // Espera 300 ms para no consultar en cada tecla
    return () => clearTimeout(temporizador);
  }, [filtros]);

  // Si es aprendiz, se consultan sus postulaciones para marcar las ofertas.
  useEffect(() => {
    if (usuario?.rol !== 'APRENDIZ') return;
    api.listarPostulaciones(token)
      .then((respuesta) => setIdsPostulados(new Set(respuesta.datos.map((p) => p.id_oferta))))
      .catch(() => {});
  }, [usuario, token]);

  async function manejarPostulacion(oferta) {
    if (!usuario) {
      navegar('/iniciar-sesion');
      return;
    }
    if (usuario.rol !== 'APRENDIZ') {
      setMensaje({ tipo: 'error', texto: 'Solo los pasantes pueden aplicar a una oferta.' });
      return;
    }
    try {
      await api.postularse(oferta.id_oferta, '', token);
      setIdsPostulados((anteriores) => new Set(anteriores).add(oferta.id_oferta));
      setMensaje({ tipo: 'exito', texto: `Te postulaste a "${oferta.titulo}".` });
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.estado === 409 ? 'Ya te habías postulado a esta oferta.' : error.message });
    }
  }

  return (
    <section className="contenedor">
      <h1>Oportunidades de <span className="acento">pasantía</span></h1>
      <FiltroOfertas filtros={filtros} alCambiar={setFiltros} />
      <Alerta tipo={mensaje.tipo} mensaje={mensaje.texto} />
      {cargando && <Cargando />}
      {!cargando && ofertas.length === 0 && <p className="vacio">No hay ofertas con esos filtros.</p>}
      {!cargando && (
        <div className="rejilla">
          {ofertas.map((oferta) => (
            <TarjetaOferta key={oferta.id_oferta} oferta={oferta} alPostularse={manejarPostulacion}
              yaPostulado={idsPostulados.has(oferta.id_oferta)} />
          ))}
        </div>
      )}
    </section>
  );
}
