/**
 * Archivo   : PiePagina.jsx
 * Propósito : Pie de página común a todas las vistas.
 */
import Logo from './Logo';

export default function PiePagina() {
  const anioActual = new Date().getFullYear();
  return (
    <footer className="pie">
      <Logo variante="icono" />
      <p>Pasantix © {anioActual} · Conectando aprendices con oportunidades reales</p>
      <p>Proyecto formativo ADSO · SENA · Ficha 3336169</p>
    </footer>
  );
}
