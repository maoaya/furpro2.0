import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';

console.log('🚀 Inicializando FutPro 2.0...');

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  console.log('✅ FutPro App montado exitosamente');
} else {
  console.error("❌ Root element not found");
}
