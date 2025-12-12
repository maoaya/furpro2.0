import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes loguear el error a un servicio externo aquí
    console.error('ErrorBoundary atrapó un error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: '#FFD700', background: '#222', padding: 32, minHeight: '100vh' }}>
          <h2>⚠️ Error al cargar la página</h2>
          <pre style={{ color: '#fff', background: '#333', padding: 16, borderRadius: 8 }}>
            {this.state.error?.toString()}
          </pre>
          <p>Por favor, recarga la página o contacta soporte si el problema persiste.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
