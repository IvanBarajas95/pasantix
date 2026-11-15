/**
 * Archivo   : Registro.jsx
 * Propósito : Registro de aprendices (pasantes) y empresas.
 *             Aprendiz: nombre, apellido, documento, programa, ciudad, correo, contraseña.
 *             Empresa : razón social, NIT, ciudad, correo, contraseña.
 *             Valida textos, números, caracteres especiales y longitudes.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useFormulario } from '../hooks/useFormulario';
import Alerta from '../components/Alerta';
import Logo from '../components/Logo';
import SelectorRol from '../components/SelectorRol';
import CampoFormulario from '../components/CampoFormulario';
import CampoContrasena from '../components/CampoContrasena';

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]{2,80}$/;
const PROGRAMAS = [
  'Análisis y Desarrollo de Software', 'Gestión de Redes de Datos', 'Gestión Empresarial',
  'Gestión Logística', 'Contabilidad y Finanzas', 'Procesamiento de Alimentos', 'Diseño Gráfico'
];
const REQUISITOS = [
  { texto: '8 caracteres o más', cumple: (c) => c.length >= 8 },
  { texto: 'Una mayúscula', cumple: (c) => /[A-Z]/.test(c) },
  { texto: 'Un número', cumple: (c) => /\d/.test(c) },
  { texto: 'Un carácter especial (*, #, @...)', cumple: (c) => /[^A-Za-z0-9]/.test(c) }
];

function validarRegistro(rol, valores) {
  const errores = [];
  if (rol === 'APRENDIZ') {
    if (!SOLO_LETRAS.test(valores.nombres.trim())) errores.push('El nombre solo admite letras (2 a 80).');
    if (!SOLO_LETRAS.test(valores.apellidos.trim())) errores.push('El apellido solo admite letras (2 a 80).');
    if (!/^[0-9]{6,10}$/.test(valores.documento)) errores.push('El documento debe tener entre 6 y 10 números, sin puntos.');
    if (valores.programa.trim().length < 3) errores.push('Escribe o elige tu programa de formación.');
  } else {
    if (valores.razon_social.trim().length < 3) errores.push('La razón social debe tener al menos 3 caracteres.');
    if (!/^[0-9]{9}-[0-9]$/.test(valores.nit)) errores.push('El NIT debe tener el formato 900123456-1.');
  }
  if (!SOLO_LETRAS.test(valores.ciudad.trim())) errores.push('La ciudad solo admite letras.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valores.correo)) errores.push('El correo no tiene un formato válido.');
  if (!REQUISITOS.every((requisito) => requisito.cumple(valores.contrasena))) errores.push('La contraseña no cumple los requisitos.');
  return errores;
}

export default function Registro() {
  const navegar = useNavigate();
  const [rol, setRol] = useState('APRENDIZ');
  const { valores, manejarCambio } = useFormulario({
    nombres: '', apellidos: '', documento: '', programa: '', razon_social: '', nit: '',
    ciudad: 'Bogotá', correo: '', contrasena: ''
  });
  const [errores, setErrores] = useState([]);
  const [exito, setExito] = useState('');
  const esAprendiz = rol === 'APRENDIZ';

  async function manejarEnvio(evento) {
    evento.preventDefault();
    const erroresEncontrados = validarRegistro(rol, valores);
    setErrores(erroresEncontrados);
    if (erroresEncontrados.length > 0) return;

    const comunes = { rol, ciudad: valores.ciudad.trim(), correo: valores.correo.trim(), contrasena: valores.contrasena };
    const datos = esAprendiz
      ? { ...comunes, nombres: valores.nombres.trim(), apellidos: valores.apellidos.trim(), documento: valores.documento, programa: valores.programa.trim() }
      : { ...comunes, razon_social: valores.razon_social.trim(), nit: valores.nit };
    try {
      await api.registrar(datos);
      setExito('¡Cuenta creada! Ahora puedes iniciar sesión.');
      setTimeout(() => navegar('/iniciar-sesion'), 1500);
    } catch (error) {
      setErrores([error.message, ...error.detalles]);
    }
  }

  return (
    <section className="contenedor">
      <div className="tarjeta-formulario">
        <p className="texto-centro"><Logo className="logo-grande" /></p>
        <form className="panel formulario" onSubmit={manejarEnvio} noValidate>
          <h1>Registro de <span className="acento">{esAprendiz ? 'Aprendiz' : 'Empresa'}</span></h1>
          <SelectorRol rol={rol} alCambiar={(nuevoRol) => { setRol(nuevoRol); setErrores([]); }} />
          <Alerta mensaje={errores.length ? 'Revise los datos:' : ''} detalles={errores} />
          <Alerta tipo="exito" mensaje={exito} />

          {/* Renderizado condicional: los campos cambian según el tipo de cuenta */}
          {esAprendiz ? (
            <>
              <div className="fila">
                <CampoFormulario etiqueta="Nombre" nombre="nombres" icono="usuario" autoComplete="given-name"
                  value={valores.nombres} onChange={manejarCambio} maxLength={80} />
                <CampoFormulario etiqueta="Apellido" nombre="apellidos" icono="usuario" autoComplete="family-name"
                  value={valores.apellidos} onChange={manejarCambio} maxLength={80} />
              </div>
              <CampoFormulario etiqueta="Documento" nombre="documento" icono="documento" inputMode="numeric"
                placeholder="Solo números" value={valores.documento} onChange={manejarCambio} maxLength={10} />
              <CampoFormulario etiqueta="Programa de formación" nombre="programa" icono="birrete" list="lista-programas"
                placeholder="Ej. Análisis y Desarrollo de Software" value={valores.programa} onChange={manejarCambio} maxLength={120} />
              <datalist id="lista-programas">{PROGRAMAS.map((programa) => <option key={programa} value={programa} />)}</datalist>
            </>
          ) : (
            <>
              <CampoFormulario etiqueta="Razón social" nombre="razon_social" icono="edificio" autoComplete="organization"
                value={valores.razon_social} onChange={manejarCambio} maxLength={150} />
              <CampoFormulario etiqueta="NIT" nombre="nit" icono="nit" placeholder="900123456-1"
                value={valores.nit} onChange={manejarCambio} maxLength={11} />
            </>
          )}
          <CampoFormulario etiqueta="Ciudad" nombre="ciudad" icono="ciudad" value={valores.ciudad} onChange={manejarCambio} maxLength={80} />
          <CampoFormulario etiqueta="Correo electrónico" nombre="correo" icono="correo" type="email" autoComplete="email"
            placeholder="tu@correo.com" value={valores.correo} onChange={manejarCambio} maxLength={120} />
          <CampoContrasena etiqueta="Contraseña" nombre="contrasena" autoComplete="new-password"
            value={valores.contrasena} onChange={manejarCambio} maxLength={64} />
          <ul className="requisitos" aria-label="Requisitos de la contraseña">
            {REQUISITOS.map((requisito) => (
              <li key={requisito.texto} className={requisito.cumple(valores.contrasena) ? 'cumple' : ''}>
                {requisito.cumple(valores.contrasena) ? '✓' : '○'} {requisito.texto}
              </li>
            ))}
          </ul>
          <button className="boton boton-oro boton-ancho" type="submit">Crear cuenta</button>
          <p className="tenue texto-centro">¿Ya tienes cuenta? <Link to="/iniciar-sesion">Inicia sesión</Link></p>
        </form>
      </div>
    </section>
  );
}
