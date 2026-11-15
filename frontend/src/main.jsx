/**
 * Archivo   : main.jsx
 * Propósito : Punto de entrada. Monta React en el <div id="root">.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import LimiteErrores from './components/LimiteErrores';
import { ProveedorAutenticacion } from './context/AutenticacionContexto';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LimiteErrores>
      <BrowserRouter>
        <ProveedorAutenticacion>
          <App />
        </ProveedorAutenticacion>
      </BrowserRouter>
    </LimiteErrores>
  </React.StrictMode>
);
