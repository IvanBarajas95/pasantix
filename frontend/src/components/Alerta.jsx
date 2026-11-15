/**
 * Archivo   : Alerta.jsx
 * Propósito : Mostrar mensajes de éxito, error o información con detalles.
 * Props     : tipo ('exito' | 'error' | 'info'), mensaje (texto), detalles (arreglo)
 */
export default function Alerta({ tipo = 'error', mensaje, detalles = [] }) {
  if (!mensaje) return null;
  return (
    <div className={`alerta alerta-${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      <strong>{mensaje}</strong>
      {detalles.length > 0 && (
        <ul>{detalles.map((detalle) => <li key={detalle}>{detalle}</li>)}</ul>
      )}
    </div>
  );
}
