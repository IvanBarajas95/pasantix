/**
 * Archivo   : CampoContrasena.jsx
 * Propósito : Campo de contraseña con botón para mostrarla u ocultarla
 *             (evento onClick que cambia el estado "visible").
 */
import { useState } from 'react';
import CampoFormulario from './CampoFormulario';
import Icono from './Icono';

export default function CampoContrasena(props) {
  const [visible, setVisible] = useState(false);
  return (
    <CampoFormulario {...props} icono="candado" type={visible ? 'text' : 'password'}>
      <button type="button" className="boton-ojo" onClick={() => setVisible(!visible)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
        <Icono nombre={visible ? 'ojoTachado' : 'ojo'} />
      </button>
    </CampoFormulario>
  );
}
