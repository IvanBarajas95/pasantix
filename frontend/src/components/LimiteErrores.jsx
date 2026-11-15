/**
 * Archivo   : LimiteErrores.jsx
 * Propósito : Componente de CLASE (Error Boundary). Si un componente hijo
 *             falla al renderizar, muestra un mensaje en vez de una
 *             pantalla en blanco. Solo los componentes de clase pueden
 *             usar componentDidCatch / getDerivedStateFromError.
 */
import { Component } from 'react';

export default class LimiteErrores extends Component {
  constructor(props) {
    super(props);
    this.state = { hayError: false };
    this.reintentar = this.reintentar.bind(this);
  }

  static getDerivedStateFromError() {
    return { hayError: true };
  }

  componentDidCatch(error, informacion) {
    console.error('Error capturado por LimiteErrores:', error, informacion);
  }

  reintentar() {
    this.setState({ hayError: false });
  }

  render() {
    if (this.state.hayError) {
      return (
        <div className="contenedor estrecho">
          <div className="alerta alerta-error" role="alert">
            <h2>Algo salió mal</h2>
            <p>Ocurrió un error inesperado en la interfaz.</p>
            <button className="boton boton-oro" onClick={this.reintentar}>Reintentar</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
