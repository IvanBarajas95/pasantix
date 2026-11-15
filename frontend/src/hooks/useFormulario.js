/**
 * Archivo   : useFormulario.js
 * Propósito : Hook personalizado que maneja los valores de un formulario
 *             controlado y el evento onChange de todos sus campos.
 */
import { useState } from 'react';

export function useFormulario(valoresIniciales) {
  const [valores, setValores] = useState(valoresIniciales);

  /** Evento onChange: actualiza el campo según su atributo "name". */
  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((anteriores) => ({ ...anteriores, [name]: value }));
  }

  function reiniciar(nuevosValores = valoresIniciales) {
    setValores(nuevosValores);
  }

  return { valores, manejarCambio, reiniciar };
}
