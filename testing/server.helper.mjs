// Helper para importar el servidor en tests
// Evita problemas con importaciones dinámicas en Jest

let serverInstance = null;
let appInstance = null;

export async function getServerAndApp() {
  if (!serverInstance || !appInstance) {
    try {
      // Usar la versión de test del servidor que evita await en top-level
      const { server, app } = await import('../server.test.js');
      serverInstance = server;
      appInstance = app;
    } catch (error) {
      console.error('Error importing server:', error);
      throw error;
    }
  }
  
  return { server: serverInstance, app: appInstance };
}

export function resetServerInstances() {
  serverInstance = null;
  appInstance = null;
}