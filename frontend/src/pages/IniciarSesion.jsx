/**
 * Archivo   : IniciarSesion.jsx
 * Propósito : Inicio de sesión (consume POST /api/auth/login).
 *             Campos: correo, contraseña, Recordarme y enlace para recuperar.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../context/AutenticacionContexto';
import { useFormulario } from '../hooks/useFormulario';
import Alerta from '../components/Alerta';
import Logo from '../components/Logo';
import CampoFormulario from '../components/CampoFormulario';
import CampoContrasena from '../components/CampoContrasena';

export default function IniciarSesion() {
  const { iniciarSesion } = useAutenticacion();
  const navegar = useNavigate();
  const { valores, manejarCambio } = useFormulario({ correo: '', contrasena: '' });
  const [recordar, setRecordar] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault(); // Evita que el navegador recargue la página
    if (!valores.correo || !valores.contrasena) {
      setError('Escriba su correo y su contraseña.');
      return;
    }
    setEnviando(true);
    try {
      const usuario = await iniciarSesion(valores.correo, valores.contrasena, recordar);
      navegar(usuario.rol === 'APRENDIZ' ? '/mi-panel' : '/panel-empresa');
    } catch (errorApi) {
      setError(errorApi.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="contenedor">
      <div className="tarjeta-formulario">
        <p className="texto-centro"><Logo className="logo-grande" /></p>
        <form className="panel formulario" onSubmit={manejarEnvio} noValidate>
          <h1>Inicio de <span className="acento">Sesión</span></h1>
          <Alerta mensaje={error} />
          <CampoFormulario etiqueta="Correo electrónico" nombre="correo" icono="correo" type="email"
            autoComplete="email" placeholder="tu@correo.com" value={valores.correo} onChange={manejarCambio} />
          <CampoContrasena etiqueta="Contraseña" nombre="contrasena" autoComplete="current-password"
            placeholder="Tu contraseña" value={valores.contrasena} onChange={manejarCambio} />
          <div className="fila-opciones">
            <label><input type="checkbox" checked={recordar} onChange={(e) => setRecordar(e.target.checked)} /> Recordarme</label>
            <Link to="/recuperar-contrasena">Recuperar contraseña</Link>
          </div>
          <button className="boton boton-oro boton-ancho" type="submit" disabled={enviando}>
            {enviando ? 'Ingresando...' : 'Ingresar'}
          </button>
          <p className="tenue texto-centro">¿Aún no tienes cuenta? <Link to="/registro">Regístrate</Link></p>
        </form>
        <p className="tenue texto-centro" style={{ marginTop: 14 }}>
          Usuarios de prueba: laura.gomez@soy.sena.edu.co · talento@andinasti.co — Contraseña: Pasantix2026*
        </p>
      </div>
    </section>
  );
}
