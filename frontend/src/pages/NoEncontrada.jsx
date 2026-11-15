/**
 * Archivo   : NoEncontrada.jsx
 * Propósito : Vista para rutas que no existen (error 404).
 */
import { Link } from 'react-router-dom';

export default function NoEncontrada() {
  return (
    <section className="contenedor estrecho">
      <div className="panel texto-centro">
        <h1>Página no <span className="acento">encontrada</span></h1>
        <p className="tenue">La dirección que buscas no existe.</p>
        <p><Link className="boton boton-oro" to="/">Volver al inicio</Link></p>
      </div>
    </section>
  );
}
