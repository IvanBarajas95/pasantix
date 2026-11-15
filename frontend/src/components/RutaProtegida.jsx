/**
 * Archivo   : RutaProtegida.jsx
 * Propósito : Impedir el acceso a una vista si no hay sesión o si el rol
 *             del usuario no está permitido.
 */
import { Navigate } from 'react-router-dom';
import { useAutenticacion } from '../context/AutenticacionContexto';

export default function RutaProtegida({ roles, children }) {
  const { usuario, estaAutenticado } = useAutenticacion();
  if (!estaAutenticado) return <Navigate to="/iniciar-sesion" replace />;
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/" replace />;
  return children;
}
