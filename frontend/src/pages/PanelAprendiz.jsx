/**
 * Archivo   : PanelAprendiz.jsx
 * Propósito : Panel del pasante: buscador, perfil, estado de sus
 *             postulaciones y nuevas oportunidades para aplicar.
 */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAutenticacion } from '../context/AutenticacionContexto';
import { obtenerIniciales } from '../components/Encabezado';
import TarjetaOferta from '../components/TarjetaOferta';
import InsigniaEstado from '../components/InsigniaEstado';
import Alerta from '../components/Alerta';
import Cargando from '../components/Cargando';
import Icono from '../components/Icono';

export default function PanelAprendiz() {
  const { usuario, token } = useAutenticacion();
  const navegar = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: 'exito', texto: '' });

  const cargarDatos = useCallback(async () => {
    try {
      const [respuestaPerfil, respuestaOfertas, respuestaPostulaciones] = await Promise.all([
        api.obtenerPerfil(token),
        api.listarOfertas({ estado: 'ABIERTA' }),
        api.listarPostulaciones(token)
      ]);
      setPerfil(respuestaPerfil.datos.perfil);
      setOfertas(respuestaOfertas.datos);
      setPostulaciones(respuestaPostulaciones.datos);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  async function postularse(oferta) {
    try {
      await api.postularse(oferta.id_oferta, '', token);
      setMensaje({ tipo: 'exito', texto: `Te postulaste a "${oferta.titulo}".` });
      cargarDatos();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    }
  }

  function buscar(evento) {
    evento.preventDefault();
    navegar(`/ofertas?buscar=${encodeURIComponent(busqueda.trim())}`);
  }

  const idsPostulados = new Set(postulaciones.map((p) => p.id_oferta));

  return (
    <section className="contenedor">
      <div className="banner-panel">
        <h1>Tu futuro comienza aquí</h1>
        <p>Encuentra tu pasantía ideal, {usuario.nombre.split(' ')[0]}.</p>
        <form className="buscador" role="search" onSubmit={buscar}>
          <div className="control">
            <span className="icono-campo"><Icono nombre="buscar" /></span>
            <label htmlFor="buscar-panel" className="solo-lectores">Buscar pasantías</label>
            <input id="buscar-panel" type="search" placeholder="Buscar por cargo o área" value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)} maxLength={60} />
          </div>
          <button className="boton boton-oro" type="submit">Buscar</button>
        </form>
      </div>

      <Alerta tipo={mensaje.tipo} mensaje={mensaje.texto} />
      {cargando ? <Cargando /> : (
        <div className="distribucion-panel">
          <aside className="panel">
            <div className="perfil-resumen">
              <span className="avatar grande" aria-hidden="true">{obtenerIniciales(usuario.nombre)}</span>
              <div>
                <h2>{usuario.nombre}</h2>
                <p className="tenue">{perfil?.programa}</p>
                <p className="tenue"><Icono nombre="ubicacion" tamano={13} /> {perfil?.ciudad}</p>
              </div>
            </div>
            <h3 className="titulo-seccion"><Icono nombre="maletin" /> Mis postulaciones</h3>
            {postulaciones.length === 0 ? <p className="vacio">Aún no te has postulado.</p> : (
              <ul className="lista-simple">
                {postulaciones.map((postulacion) => (
                  <li key={postulacion.id_postulacion}>
                    <div><strong>{postulacion.oferta}</strong><small>{postulacion.empresa}</small></div>
                    <InsigniaEstado estado={postulacion.estado} />
                  </li>
                ))}
              </ul>
            )}
          </aside>
          <div>
            <h2 className="titulo-seccion"><Icono nombre="birrete" /> Nuevas oportunidades</h2>
            <div className="rejilla">
              {ofertas.map((oferta) => (
                <TarjetaOferta key={oferta.id_oferta} oferta={oferta} alPostularse={postularse}
                  yaPostulado={idsPostulados.has(oferta.id_oferta)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
