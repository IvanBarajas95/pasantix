/**
 * Archivo   : InsigniaEstado.jsx
 * Propósito : Etiqueta de color para estados (ABIERTA, ACEPTADA, etc.).
 */
const TEXTOS = {
  ABIERTA: 'Abierta', CERRADA: 'Cerrada',
  PENDIENTE: 'Pendiente', ACEPTADA: 'Aceptada', RECHAZADA: 'Rechazada'
};

export default function InsigniaEstado({ estado }) {
  return <span className={`insignia insignia-${estado.toLowerCase()}`}>{TEXTOS[estado] || estado}</span>;
}
