/**
 * Archivo   : RecuperarContrasena.jsx
 * Propósito : Pantalla "Recuperar contraseña". En esta versión el
 *             restablecimiento lo hace el administrador; la pantalla
 *             valida el correo e indica el paso a seguir.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Alerta from '../components/Alerta';
import CampoFormulario from '../components/CampoFormulario';

export default function RecuperarContrasena() {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState({ tipo: 'error', texto: '' });

  function manejarEnvio(evento) {
    evento.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) {
      setMensaje({ tipo: 'error', texto: 'Escribe un correo válido.' });
      return;
    }
    setMensaje({
      tipo: 'info',
      texto: `Para restablecer la contraseña de ${correo}, escribe desde ese correo a admin@pasantix.co. El envío automático de enlaces llegará en una próxima versión.`
    });
  }

  return (
    <section className="contenedor">
      <div className="tarjeta-formulario">
        <p className="texto-centro"><Logo className="logo-grande" /></p>
        <form className="panel formulario" onSubmit={manejarEnvio} noValidate>
          <h1>Recuperar <span className="acento">contraseña</span></h1>
          <Alerta tipo={mensaje.tipo} mensaje={mensaje.texto} />
          <CampoFormulario etiqueta="Correo electrónico registrado" nombre="correo" icono="correo" type="email"
            value={correo} onChange={(e) => setCorreo(e.target.value)} />
          <button className="boton boton-cian boton-ancho" type="submit">Continuar</button>
          <p className="tenue texto-centro"><Link to="/iniciar-sesion">Volver a iniciar sesión</Link></p>
        </form>
      </div>
    </section>
  );
}
