/**
 * Archivo   : PanelEmpresa.jsx
 * Propósito : Panel de la empresa: métricas, candidatos recientes
 *             (aceptar / rechazar) y gestión CRUD de sus ofertas.
 */
import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAutenticacion } from '../context/AutenticacionContexto';
import FormularioOferta from '../components/FormularioOferta';
import TarjetaOferta from '../components/TarjetaOferta';
import TarjetaMetrica from '../components/TarjetaMetrica';
import InsigniaEstado from '../components/InsigniaEstado';
import Alerta from '../components/Alerta';
import Icono from '../components/Icono';

export default function PanelEmpresa() {
  const { usuario, token } = useAutenticacion();
  const [ofertas, setOfertas] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [formularioVisible, setFormularioVisible] = useState(false);
  const [ofertaEditar, setOfertaEditar] = useState(null);
  const [mensaje, setMensaje] = useState({ tipo: 'exito', texto: '' });

  const cargarDatos = useCallback(async () => {
    try {
      const filtro = usuario.rol === 'EMPRESA' ? { empresa: usuario.id_perfil } : {};
      const [respuestaOfertas, respuestaPostulaciones] = await Promise.all([
        api.listarOfertas(filtro),
        api.listarPostulaciones(token)
      ]);
      setOfertas(respuestaOfertas.datos);
      setPostulaciones(respuestaPostulaciones.datos);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    }
  }, [usuario, token]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  function abrirFormulario(oferta = null) {
    setOfertaEditar(oferta);
    setFormularioVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cerrarFormulario() {
    setOfertaEditar(null);
    setFormularioVisible(false);
  }

  async function guardarOferta(oferta) {
    if (ofertaEditar) {
      await api.actualizarOferta(ofertaEditar.id_oferta, oferta, token);
      setMensaje({ tipo: 'exito', texto: 'Oferta actualizada.' });
    } else {
      await api.crearOferta(oferta, token);
      setMensaje({ tipo: 'exito', texto: 'Oferta publicada.' });
    }
    cerrarFormulario();
    cargarDatos();
  }

  async function eliminarOferta(oferta) {
    if (!window.confirm(`¿Eliminar la oferta "${oferta.titulo}"?`)) return;
    try {
      await api.eliminarOferta(oferta.id_oferta, token);
      setMensaje({ tipo: 'exito', texto: 'Oferta eliminada.' });
      cargarDatos();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    }
  }

  async function cambiarEstado(idPostulacion, estado) {
    try {
      await api.cambiarEstadoPostulacion(idPostulacion, estado, token);
      cargarDatos();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    }
  }

  // Métricas calculadas a partir de los datos (estado derivado)
  const ofertasActivas = ofertas.filter((o) => o.estado === 'ABIERTA').length;
  const pendientes = postulaciones.filter((p) => p.estado === 'PENDIENTE').length;
  const aceptadas = postulaciones.filter((p) => p.estado === 'ACEPTADA').length;

  return (
    <section className="contenedor">
      <div className="cabecera-panel">
        <div>
          <h1>Panel de <span className="acento">{usuario.nombre}</span></h1>
          <p>Gestiona tus ofertas de pasantía y los candidatos que se postulan.</p>
        </div>
        <button className="boton boton-oro" onClick={() => abrirFormulario()}>
          <Icono nombre="mas" /> Publicar oferta
        </button>
      </div>

      <Alerta tipo={mensaje.tipo} mensaje={mensaje.texto} />

      <div className="metricas">
        <TarjetaMetrica etiqueta="Ofertas activas" valor={ofertasActivas} total={ofertas.length} icono="maletin" />
        <TarjetaMetrica etiqueta="Total postulantes" valor={postulaciones.length} icono="personas" color="var(--azul)" />
        <TarjetaMetrica etiqueta="Pendientes por revisar" valor={pendientes} total={postulaciones.length} icono="reloj" color="var(--ambar)" />
        <TarjetaMetrica etiqueta="Aceptados" valor={aceptadas} total={postulaciones.length} icono="usuario" color="var(--verde)" />
      </div>

      {formularioVisible && (
        <div style={{ marginBottom: 22 }}>
          <FormularioOferta ofertaEditar={ofertaEditar} alGuardar={guardarOferta} alCancelar={cerrarFormulario} />
        </div>
      )}

      <div className="panel" style={{ marginBottom: 22 }}>
        <h2 className="titulo-seccion"><Icono nombre="personas" /> Candidatos recientes</h2>
        {postulaciones.length === 0 ? <p className="vacio">Todavía no hay postulaciones.</p> : (
          <div className="tabla-desplazable">
            <table>
              <thead><tr><th>Aprendiz</th><th>Oferta</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {postulaciones.map((postulacion) => (
                  <tr key={postulacion.id_postulacion}>
                    <td>{postulacion.aprendiz}</td>
                    <td>{postulacion.oferta}</td>
                    <td>{postulacion.fecha_postulacion.slice(0, 10)}</td>
                    <td><InsigniaEstado estado={postulacion.estado} /></td>
                    <td className="acciones">
                      {postulacion.estado !== 'ACEPTADA' && (
                        <button className="boton boton-cian boton-pequeno" onClick={() => cambiarEstado(postulacion.id_postulacion, 'ACEPTADA')}>Aceptar</button>
                      )}
                      {postulacion.estado !== 'RECHAZADA' && (
                        <button className="boton boton-peligro boton-pequeno" onClick={() => cambiarEstado(postulacion.id_postulacion, 'RECHAZADA')}>Rechazar</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <h2 className="titulo-seccion"><Icono nombre="maletin" /> Gestión de ofertas ({ofertas.length})</h2>
      <div className="rejilla">
        {ofertas.map((oferta) => (
          <TarjetaOferta key={oferta.id_oferta} oferta={oferta} alEditar={abrirFormulario} alEliminar={eliminarOferta} />
        ))}
      </div>
    </section>
  );
}
