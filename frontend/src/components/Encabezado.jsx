/**
 * Archivo   : Encabezado.jsx
 * Propósito : Barra de navegación con el logo. Muestra enlaces según el rol.
 */
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../context/AutenticacionContexto';
import Logo from './Logo';
import Icono from './Icono';

/** Iniciales del nombre para el avatar (ej. "Laura Gómez" -> "LG"). */
function obtenerIniciales(nombre = '') {
  return nombre.split(' ').filter(Boolean).slice(0, 2).map((parte) => parte[0].toUpperCase()).join('');
}

export default function Encabezado() {
  const { usuario, estaAutenticado, cerrarSesion } = useAutenticacion();
  const navegar = useNavigate();

  function manejarCerrarSesion() {
    cerrarSesion();
    navegar('/');
  }

  return (
    <header className="encabezado">
      <Link to="/" className="marca"><Logo /></Link>
      <nav className="navegacion" aria-label="Principal">
        <NavLink to="/ofertas">Oportunidades</NavLink>
        {usuario?.rol === 'APRENDIZ' && <NavLink to="/mi-panel">Mi panel</NavLink>}
        {usuario?.rol === 'APRENDIZ' && <NavLink to="/mis-postulaciones">Mis postulaciones</NavLink>}
        {(usuario?.rol === 'EMPRESA' || usuario?.rol === 'ADMIN') && <NavLink to="/panel-empresa">Panel de empresa</NavLink>}
        {estaAutenticado ? (
          <>
            <span className="chip-usuario">
              <span className="avatar" aria-hidden="true">{obtenerIniciales(usuario.nombre)}</span>
              {usuario.nombre.split(' ')[0]}
            </span>
            <button className="boton boton-contorno boton-pequeno" onClick={manejarCerrarSesion}>
              <Icono nombre="salir" tamano={16} /> Salir
            </button>
          </>
        ) : (
          <>
            <NavLink to="/iniciar-sesion">Iniciar sesión</NavLink>
            <Link to="/registro" className="boton boton-oro boton-pequeno">Regístrate</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export { obtenerIniciales };
