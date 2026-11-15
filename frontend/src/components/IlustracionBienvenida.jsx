/**
 * Archivo   : IlustracionBienvenida.jsx
 * Propósito : Imagen ilustrativa de la pantalla de bienvenida (SVG propio):
 *             un globo con birrete conectado a empresas por una red.
 */
export default function IlustracionBienvenida() {
  const nodos = [[120, 80], [530, 70], [560, 220], [90, 230], [470, 300], [150, 310]];
  return (
    <svg viewBox="0 0 640 360" role="img" aria-label="Aprendiz conectado con empresas a través de Pasantix">
      <defs>
        <radialGradient id="brilloGlobo" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#3fd8f2" stopOpacity=".55" />
          <stop offset="60%" stopColor="#3b8cff" stopOpacity=".18" />
          <stop offset="100%" stopColor="#050f2e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="onda" x1="0" x2="1">
          <stop offset="0" stopColor="#f1c45e" stopOpacity="0" />
          <stop offset=".5" stopColor="#f1c45e" stopOpacity=".9" />
          <stop offset="1" stopColor="#3fd8f2" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="640" height="360" fill="#06143c" />
      <circle cx="320" cy="180" r="170" fill="url(#brilloGlobo)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M0 ${210 + i * 9} C 160 ${150 - i * 12}, 300 ${290 + i * 6}, 640 ${170 + i * 10}`}
          stroke="url(#onda)" strokeWidth="1.2" fill="none" opacity={0.9 - i * 0.15} />
      ))}
      {nodos.map(([x, y], i) => (
        <g key={i}>
          <line x1="320" y1="180" x2={x} y2={y} stroke="#3fd8f2" strokeOpacity=".35" strokeDasharray="4 6" />
          <circle cx={x} cy={y} r="16" fill="#0b2a6b" stroke="#3fd8f2" strokeWidth="1.5" />
          <rect x={x - 6} y={y - 7} width="12" height="14" rx="1.5" fill="none" stroke="#4fd58e" strokeWidth="1.5" />
        </g>
      ))}
      <circle cx="320" cy="180" r="92" fill="#0b2a6b" stroke="#3fd8f2" strokeWidth="2" />
      <ellipse cx="320" cy="180" rx="92" ry="34" fill="none" stroke="#3fd8f2" strokeOpacity=".55" />
      <ellipse cx="320" cy="180" rx="40" ry="92" fill="none" stroke="#3fd8f2" strokeOpacity=".55" />
      <path d="M228 180h184M320 88v184" stroke="#3fd8f2" strokeOpacity=".35" />
      <path d="M262 168 320 140l58 28-58 28z" fill="#1b4fa8" stroke="#f1c45e" strokeWidth="2" strokeLinejoin="round" />
      <path d="M284 180v22c20 13 52 13 72 0v-22" fill="#123b86" stroke="#f1c45e" strokeWidth="2" />
      <path d="M378 168v30" stroke="#f1c45e" strokeWidth="2" /><circle cx="378" cy="201" r="4" fill="#f1c45e" />
    </svg>
  );
}
