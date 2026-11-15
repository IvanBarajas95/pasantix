/**
 * Archivo   : FiltroOfertas.jsx
 * Propósito : Controles para filtrar ofertas. Comunica los cambios al
 *             componente padre mediante la función alCambiar (props).
 */
import Icono from './Icono';

export default function FiltroOfertas({ filtros, alCambiar }) {
  function manejarCambio(evento) {
    alCambiar({ ...filtros, [evento.target.name]: evento.target.value });
  }

  return (
    <form className="filtros" role="search" onSubmit={(evento) => evento.preventDefault()}>
      <div className="campo">
        <label htmlFor="filtro-buscar">Buscar</label>
        <div className="control">
          <span className="icono-campo"><Icono nombre="buscar" /></span>
          <input id="filtro-buscar" name="buscar" type="search" placeholder="Título o área (ej. web, datos)" maxLength={60}
            value={filtros.buscar} onChange={manejarCambio} />
        </div>
      </div>
      <div className="campo">
        <label htmlFor="filtro-modalidad">Modalidad</label>
        <select id="filtro-modalidad" name="modalidad" value={filtros.modalidad} onChange={manejarCambio}>
          <option value="">Todas</option>
          <option value="PRESENCIAL">Presencial</option>
          <option value="REMOTA">Remota</option>
          <option value="HIBRIDA">Híbrida</option>
        </select>
      </div>
      <div className="campo">
        <label htmlFor="filtro-estado">Estado</label>
        <select id="filtro-estado" name="estado" value={filtros.estado} onChange={manejarCambio}>
          <option value="">Todos</option>
          <option value="ABIERTA">Abiertas</option>
          <option value="CERRADA">Cerradas</option>
        </select>
      </div>
    </form>
  );
}
