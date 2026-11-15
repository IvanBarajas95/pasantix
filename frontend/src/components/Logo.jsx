/**
 * Archivo   : Logo.jsx
 * Propósito : Logo de Pasantix con el eslogan "Conectando aprendices con
 *             oportunidades reales". Variante "icono" para espacios pequeños.
 */
import logoCompleto from '../assets/logo-pasantix.png';
import logoIcono from '../assets/icono-pasantix.png';

export default function Logo({ variante = 'completo', className = '' }) {
  const esIcono = variante === 'icono';
  return (
    <img
      className={className}
      src={esIcono ? logoIcono : logoCompleto}
      alt={esIcono ? 'Pasantix' : 'Pasantix – Conectando aprendices con oportunidades reales'}
    />
  );
}
