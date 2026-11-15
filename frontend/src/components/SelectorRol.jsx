/**
 * Archivo   : SelectorRol.jsx
 * Propósito : Botones "Soy Pasante" / "Soy Empresa" del registro.
 * Props     : rol (valor actual), alCambiar (función del padre)
 */
const OPCIONES = [
  { valor: 'APRENDIZ', texto: 'Soy Pasante' },
  { valor: 'EMPRESA', texto: 'Soy Empresa' }
];

export default function SelectorRol({ rol, alCambiar }) {
  return (
    <div className="selector-rol" role="group" aria-label="Tipo de cuenta">
      {OPCIONES.map((opcion) => (
        <button key={opcion.valor} type="button" aria-pressed={rol === opcion.valor}
          onClick={() => alCambiar(opcion.valor)}>
          {opcion.texto}
        </button>
      ))}
    </div>
  );
}
