/**
 * Archivo   : AutenticacionContexto.jsx
 * Propósito : Compartir en toda la app el usuario que inició sesión y su
 *             token (Context API).
 *             - "Recordarme" marcado: la sesión se guarda en localStorage
 *               (sigue activa al cerrar el navegador).
 *             - Sin marcar: se guarda en sessionStorage (termina al cerrarlo).
 */
import { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const AutenticacionContexto = createContext(null);
const CLAVE_SESION = 'pasantix_sesion';

function leerSesionGuardada() {
  try {
    const texto = localStorage.getItem(CLAVE_SESION) || sessionStorage.getItem(CLAVE_SESION);
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null;
  }
}

function borrarSesionGuardada() {
  try {
    localStorage.removeItem(CLAVE_SESION);
    sessionStorage.removeItem(CLAVE_SESION);
  } catch { /* El navegador bloqueó el almacenamiento: no hay nada que borrar */ }
}

export function ProveedorAutenticacion({ children }) {
  const [sesion, setSesion] = useState(leerSesionGuardada);

  async function iniciarSesion(correo, contrasena, recordar = false) {
    const respuesta = await api.iniciarSesion({ correo, contrasena });
    const nuevaSesion = { token: respuesta.datos.token, usuario: respuesta.datos.usuario };
    borrarSesionGuardada();
    try {
      (recordar ? localStorage : sessionStorage).setItem(CLAVE_SESION, JSON.stringify(nuevaSesion));
    } catch { /* Si el navegador no permite guardar, la sesión dura mientras la pestaña esté abierta */ }
    setSesion(nuevaSesion);
    return nuevaSesion.usuario;
  }

  function cerrarSesion() {
    borrarSesionGuardada();
    setSesion(null);
  }

  const valor = {
    usuario: sesion?.usuario || null,
    token: sesion?.token || null,
    estaAutenticado: Boolean(sesion?.token),
    iniciarSesion,
    cerrarSesion
  };

  return <AutenticacionContexto.Provider value={valor}>{children}</AutenticacionContexto.Provider>;
}

/** Hook personalizado para usar el contexto: const { usuario } = useAutenticacion(); */
export function useAutenticacion() {
  return useContext(AutenticacionContexto);
}
