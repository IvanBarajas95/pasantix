/**
 * Archivo   : FormularioOferta.jsx
 * Propósito : Formulario controlado para publicar o editar una oferta de
 *             pasantía. Valida en el navegador antes de enviar a la API.
 */
import { useEffect, useState } from 'react';
import { useFormulario } from '../hooks/useFormulario';
import Alerta from './Alerta';

const hoy = new Date().toISOString().slice(0, 10);
const OFERTA_VACIA = {
  titulo: '', descripcion: '', area: '', modalidad: 'PRESENCIAL', cupos: 1,
  fecha_publicacion: hoy, fecha_cierre: '', estado: 'ABIERTA'
};

/** Reglas de validación del lado del cliente. */
function validarOferta(valores) {
  const errores = [];
  if (valores.titulo.trim().length < 5) errores.push('El título debe tener al menos 5 caracteres.');
  if (valores.descripcion.trim().length < 10) errores.push('La descripción debe tener al menos 10 caracteres.');
  if (valores.area.trim().length < 3) errores.push('El área debe tener al menos 3 caracteres.');
  const cupos = Number(valores.cupos);
  if (!Number.isInteger(cupos) || cupos < 1 || cupos > 50) errores.push('Los cupos deben estar entre 1 y 50.');
  if (!valores.fecha_cierre) errores.push('Debe indicar la fecha de cierre.');
  else if (valores.fecha_cierre < valores.fecha_publicacion) errores.push('La fecha de cierre no puede ser anterior a la de publicación.');
  return errores;
}

export default function FormularioOferta({ ofertaEditar, alGuardar, alCancelar }) {
  const { valores, manejarCambio, reiniciar } = useFormulario(OFERTA_VACIA);
  const [errores, setErrores] = useState([]);
  const [enviando, setEnviando] = useState(false);

  // Cuando cambia la oferta a editar, se cargan sus datos en el formulario.
  useEffect(() => {
    reiniciar(ofertaEditar ? { ...OFERTA_VACIA, ...ofertaEditar } : OFERTA_VACIA);
    setErrores([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ofertaEditar]);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    const erroresEncontrados = validarOferta(valores);
    setErrores(erroresEncontrados);
    if (erroresEncontrados.length > 0) return;

    setEnviando(true);
    try {
      await alGuardar({ ...valores, cupos: Number(valores.cupos) });
      reiniciar(OFERTA_VACIA);
    } catch (error) {
      setErrores([error.message, ...(error.detalles || [])]);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="panel formulario" onSubmit={manejarEnvio} noValidate>
      <h2>{ofertaEditar ? `Editar oferta #${ofertaEditar.id_oferta}` : <>Publicar <span className="acento">oferta</span></>}</h2>
      <Alerta mensaje={errores.length > 0 ? 'Revise los datos del formulario:' : ''} detalles={errores} />

      <div className="campo"><label htmlFor="of-titulo">Título *</label>
        <input id="of-titulo" name="titulo" value={valores.titulo} onChange={manejarCambio} maxLength={120} placeholder="Ej. Pasante de desarrollo web" /></div>
      <div className="campo"><label htmlFor="of-descripcion">Descripción *</label>
        <textarea id="of-descripcion" name="descripcion" rows={3} value={valores.descripcion} onChange={manejarCambio} maxLength={2000} /></div>
      <div className="fila">
        <div className="campo"><label htmlFor="of-area">Área *</label>
          <input id="of-area" name="area" value={valores.area} onChange={manejarCambio} maxLength={80} /></div>
        <div className="campo"><label htmlFor="of-modalidad">Modalidad</label>
          <select id="of-modalidad" name="modalidad" value={valores.modalidad} onChange={manejarCambio}>
            <option value="PRESENCIAL">Presencial</option>
            <option value="REMOTA">Remota</option>
            <option value="HIBRIDA">Híbrida</option>
          </select></div>
        <div className="campo"><label htmlFor="of-cupos">Cupos *</label>
          <input id="of-cupos" name="cupos" type="number" min={1} max={50} value={valores.cupos} onChange={manejarCambio} /></div>
      </div>
      <div className="fila">
        <div className="campo"><label htmlFor="of-pub">Publicación *</label>
          <input id="of-pub" name="fecha_publicacion" type="date" value={valores.fecha_publicacion} onChange={manejarCambio} /></div>
        <div className="campo"><label htmlFor="of-cierre">Cierre *</label>
          <input id="of-cierre" name="fecha_cierre" type="date" value={valores.fecha_cierre} onChange={manejarCambio} /></div>
        <div className="campo"><label htmlFor="of-estado">Estado</label>
          <select id="of-estado" name="estado" value={valores.estado} onChange={manejarCambio}>
            <option value="ABIERTA">Abierta</option>
            <option value="CERRADA">Cerrada</option>
          </select></div>
      </div>
      <div className="acciones">
        <button className="boton boton-oro" type="submit" disabled={enviando}>{enviando ? 'Guardando...' : 'Guardar oferta'}</button>
        <button className="boton boton-contorno" type="button" onClick={alCancelar}>Cancelar</button>
      </div>
    </form>
  );
}
