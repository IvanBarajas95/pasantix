/**
 * Archivo   : Cargando.jsx
 * Propósito : Indicador visual mientras se esperan datos de la API.
 */
export default function Cargando({ texto = 'Cargando...' }) {
  return <p className="cargando" aria-live="polite">{texto}</p>;
}
