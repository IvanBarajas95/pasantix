/**
 * Archivo   : TarjetaMetrica.jsx
 * Propósito : Indicador numérico del panel de empresa con barra de proporción.
 * Props     : etiqueta, valor, total (para la barra), color, icono
 */
import Icono from './Icono';

export default function TarjetaMetrica({ etiqueta, valor, total, color = 'var(--cian)', icono }) {
  const porcentaje = total > 0 ? Math.round((valor / total) * 100) : 0;
  return (
    <article className="panel metrica">
      <span className="etiqueta-metrica">{icono && <Icono nombre={icono} tamano={16} />}{etiqueta}</span>
      <span className="valor" style={{ color }}>{valor}</span>
      {total !== undefined && (
        <div className="barra" role="img" aria-label={`${porcentaje} % del total`}>
          <span style={{ width: `${porcentaje}%`, background: color }} />
        </div>
      )}
    </article>
  );
}
