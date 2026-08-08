import React from 'react';
import ReactDOM from 'react-dom/client';

// Test mínimo sin dependencias complejas
function TestApp() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <div>
        <h1>🚀 FutPro 2.0 - Test Mínimo</h1>
        <p>Si ves esto, React está funcionando</p>
        <button 
          onClick={() => alert('React funcionando!')}
          style={{
            background: '#10B981',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '20px'
          }}
        >
          Test Click
        </button>
        <div style={{ marginTop: '30px', fontSize: '14px', opacity: 0.8 }}>
          <p>Timestamp: {new Date().toLocaleString()}</p>
          <p>Location: {window.location.href}</p>
        </div>
      </div>
    </div>
  );
}

console.log('🔥 Iniciando test mínimo de React...');

const container = document.getElementById('root');
if (container) {
  console.log('✅ Elemento root encontrado');
  const root = ReactDOM.createRoot(container);
  root.render(<TestApp />);
  console.log('✅ TestApp renderizada');
} else {
  console.error('❌ No se encontró elemento #root');
  // Fallback: crear contenido directo
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: Arial, sans-serif; text-align: center;">
      <div>
        <h1>⚠️ FutPro 2.0 - Fallback Mode</h1>
        <p>No se encontró elemento #root</p>
        <p>Timestamp: ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `;
}