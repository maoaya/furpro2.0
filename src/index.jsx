import { createRoot } from 'react-dom/client';
import FutProApp from './FutProApp.jsx';
import { AuthProvider } from './context/AuthContext';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <AuthProvider>
      <FutProApp />
    </AuthProvider>
  );
} else {
  console.error("Root element not found");
}
