/**
 * Archivo   : TarjetaOferta.jsx
 * Propósito : Mostrar una oferta de pasantía. Recibe la oferta por props y,
 *             de forma opcional, las acciones (postularse, editar, eliminar).
 */
import InsigniaEstado from './InsigniaEstado';
import Icono from './Icono';

const MODALIDADES = { PRESENCIAL: 'Presencial', REMOTA: 'Remota', HIBRIDA: 'Híbrida' };

/** Iniciales de la empresa para su "logo" (ej. "Soluciones Andinas TI" -> "SA"). */
function inicialesEmpresa(nombre = '') {
  return nombre.split(' ').filter((p) => p.length > 2).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

export default function TarjetaOferta({ oferta, alPostularse, alEditar, alEliminar, yaPostulado = false }) {
  return (
    <article className="panel tarjeta-oferta">
      <div className="tarjeta-cabecera">
        <div className="empresa-oferta">
          <span className="logo-empresa" aria-hidden="true">{inicialesEmpresa(oferta.empresa)}</span>
          <span>{oferta.empresa}</span>
        </div>
        <InsigniaEstado estado={oferta.estado} />
      </div>
      <h3>{oferta.titulo}</h3>
      <p>{oferta.descripcion}</p>
      <ul className="datos-oferta">
        <li><Icono nombre="ubicacion" tamano={12} /> {oferta.ciudad}</li>
        <li>{MODALIDADES[oferta.modalidad]}</li>
        <li>{oferta.area}</li>
        <li>{oferta.cupos} {oferta.cupos === 1 ? 'cupo' : 'cupos'}</li>
        <li><Icono nombre="reloj" tamano={12} /> Cierra {oferta.fecha_cierre}</li>
      </ul>
      <div className="acciones">
        {alPostularse && oferta.estado === 'ABIERTA' && (
          yaPostulado
            ? <span className="tenue">Ya te postulaste ✓</span>
            : <button className="boton boton-oro boton-pequeno" onClick={() => alPostularse(oferta)}>Aplicar ahora</button>
        )}
        {alEditar && <button className="boton boton-contorno boton-pequeno" onClick={() => alEditar(oferta)}>Editar</button>}
        {alEliminar && <button className="boton boton-peligro boton-pequeno" onClick={() => alEliminar(oferta)}>Eliminar</button>}
      </div>
    </article>
  );
}
