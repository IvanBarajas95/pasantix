/**
 * Archivo   : Bienvenida.jsx
 * Propósito : Pantalla de bienvenida. Presenta la plataforma y da acceso
 *             rápido al sistema (botones Iniciar sesión y Registrarse).
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAutenticacion } from '../context/AutenticacionContexto';
import Logo from '../components/Logo';
import IlustracionBienvenida from '../components/IlustracionBienvenida';
import TarjetaOferta from '../components/TarjetaOferta';
import Alerta from '../components/Alerta';

const PASOS = [
  { titulo: 'Crea tu perfil', texto: 'Regístrate como pasante con tu programa de formación y ciudad.' },
  { titulo: 'Encuentra tu pasantía', texto: 'Filtra por área y modalidad: presencial, remota o híbrida.' },
  { titulo: 'Postúlate y haz seguimiento', texto: 'Conoce en tu panel si tu postulación está pendiente, aceptada o rechazada.' }
];

export default function Bienvenida() {
  const { usuario } = useAutenticacion();
  const [ofertas, setOfertas] = useState([]);
  const [error, setError] = useState('');

  // useEffect con [] se ejecuta una sola vez, al mostrar la página.
  useEffect(() => {
    api.listarOfertas({ estado: 'ABIERTA' })
      .then((respuesta) => setOfertas(respuesta.datos.slice(0, 3)))
      .catch((errorApi) => setError(errorApi.message));
  }, []);

  const rutaPanel = usuario?.rol === 'APRENDIZ' ? '/mi-panel' : '/panel-empresa';

  return (
    <>
      <section className="contenedor bienvenida">
        <Logo className="logo-grande" />
        <p className="lema">
          ¿Ya agotaste tu contrato de aprendizaje? Encuentra empresas que reciben aprendices
          en <strong>pasantía</strong> para tu etapa productiva.
        </p>
        <div className="ilustracion"><IlustracionBienvenida /></div>
        <div className="botones-inicio">
          {usuario ? (
            <Link className="boton boton-oro boton-ancho" to={rutaPanel}>Ir a mi panel</Link>
          ) : (
            <>
              <Link className="boton boton-oro boton-ancho" to="/iniciar-sesion">Iniciar sesión</Link>
              <Link className="boton boton-cian boton-ancho" to="/registro">Registrarse</Link>
            </>
          )}
        </div>
      </section>

      <section className="contenedor">
        <h2 className="texto-centro">¿Cómo funciona?</h2>
        <div className="rejilla-3">
          {PASOS.map((paso, indice) => (
            <article key={paso.titulo} className="panel-suave beneficio">
              <h3><span className="numero-paso">{indice + 1}</span>{paso.titulo}</h3>
              <p>{paso.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contenedor">
        <h2>Nuevas oportunidades</h2>
        <Alerta mensaje={error} />
        <div className="rejilla">
          {ofertas.map((oferta) => <TarjetaOferta key={oferta.id_oferta} oferta={oferta} />)}
        </div>
        <p className="texto-centro" style={{ marginTop: 18 }}>
          <Link className="boton boton-contorno" to="/ofertas">Ver todas las oportunidades</Link>
        </p>
      </section>
    </>
  );
}
