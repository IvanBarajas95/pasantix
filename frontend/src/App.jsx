/**
 * Archivo   : App.jsx
 * Propósito : Componente raíz. Define la estructura y las rutas de la app.
 */
import { Route, Routes } from 'react-router-dom';
import Encabezado from './components/Encabezado';
import PiePagina from './components/PiePagina';
import RutaProtegida from './components/RutaProtegida';
import Bienvenida from './pages/Bienvenida';
import Ofertas from './pages/Ofertas';
import IniciarSesion from './pages/IniciarSesion';
import Registro from './pages/Registro';
import RecuperarContrasena from './pages/RecuperarContrasena';
import PanelAprendiz from './pages/PanelAprendiz';
import PanelEmpresa from './pages/PanelEmpresa';
import MisPostulaciones from './pages/MisPostulaciones';
import NoEncontrada from './pages/NoEncontrada';

export default function App() {
  return (
    <div className="aplicacion">
      <Encabezado />
      <main>
        <Routes>
          <Route path="/" element={<Bienvenida />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/iniciar-sesion" element={<IniciarSesion />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
          <Route path="/mi-panel" element={
            <RutaProtegida roles={['APRENDIZ']}><PanelAprendiz /></RutaProtegida>
          } />
          <Route path="/mis-postulaciones" element={
            <RutaProtegida roles={['APRENDIZ']}><MisPostulaciones /></RutaProtegida>
          } />
          <Route path="/panel-empresa" element={
            <RutaProtegida roles={['EMPRESA', 'ADMIN']}><PanelEmpresa /></RutaProtegida>
          } />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <PiePagina />
    </div>
  );
}
