/**
 * Archivo   : api.js
 * Propósito : Centralizar las llamadas HTTP (fetch) a la API de Pasantix.
 */
const URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Hace una petición a la API y devuelve el JSON de respuesta.
 * Si la respuesta no es exitosa, lanza un Error con el mensaje del servidor.
 */
async function peticion(ruta, { metodo = 'GET', cuerpo, token } = {}) {
  const encabezados = { 'Content-Type': 'application/json' };
  if (token) encabezados.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(`${URL_BASE}${ruta}`, {
      method: metodo,
      headers: encabezados,
      body: cuerpo ? JSON.stringify(cuerpo) : undefined
    });
  } catch {
    throw new Error('No hay conexión con la API. ¿Está encendido el backend (npm start)?');
  }

  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    const error = new Error(datos.mensaje || 'Ocurrió un error inesperado.');
    error.detalles = datos.detalles || [];
    error.estado = respuesta.status;
    throw error;
  }
  return datos;
}

export const api = {
  iniciarSesion: (credenciales) => peticion('/auth/login', { metodo: 'POST', cuerpo: credenciales }),
  registrar: (usuario) => peticion('/auth/registro', { metodo: 'POST', cuerpo: usuario }),
  obtenerPerfil: (token) => peticion('/auth/perfil', { token }),

  listarOfertas: (filtros = {}) => {
    const parametros = new URLSearchParams(Object.entries(filtros).filter(([, valor]) => valor));
    return peticion(`/ofertas?${parametros.toString()}`);
  },
  crearOferta: (oferta, token) => peticion('/ofertas', { metodo: 'POST', cuerpo: oferta, token }),
  actualizarOferta: (id, oferta, token) => peticion(`/ofertas/${id}`, { metodo: 'PUT', cuerpo: oferta, token }),
  eliminarOferta: (id, token) => peticion(`/ofertas/${id}`, { metodo: 'DELETE', token }),

  listarPostulaciones: (token) => peticion('/postulaciones', { token }),
  postularse: (idOferta, comentario, token) =>
    peticion('/postulaciones', { metodo: 'POST', cuerpo: { id_oferta: idOferta, comentario }, token }),
  cambiarEstadoPostulacion: (id, estado, token) =>
    peticion(`/postulaciones/${id}/estado`, { metodo: 'PATCH', cuerpo: { estado }, token }),
  eliminarPostulacion: (id, token) => peticion(`/postulaciones/${id}`, { metodo: 'DELETE', token })
};
