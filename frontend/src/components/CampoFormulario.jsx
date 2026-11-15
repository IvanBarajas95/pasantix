/**
 * Archivo   : CampoFormulario.jsx
 * Propósito : Campo con etiqueta visible, ícono y mensaje de ayuda.
 *             Reutilizado en inicio de sesión, registro y búsquedas.
 * Props     : etiqueta, nombre, icono, ayuda, error + atributos del <input>
 */
import { useId } from 'react';
import Icono from './Icono';

export default function CampoFormulario({ etiqueta, nombre, icono, ayuda, error = false, children, ...atributos }) {
  const id = useId();
  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta}</label>
      <div className={`control ${children ? 'con-ojo' : ''}`}>
        {icono && <span className="icono-campo"><Icono nombre={icono} /></span>}
        <input id={id} name={nombre} aria-invalid={error || undefined} {...atributos} />
        {children}
      </div>
      {ayuda && <p className="ayuda-campo">{ayuda}</p>}
    </div>
  );
}
