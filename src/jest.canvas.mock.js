// Mock de variables de entorno para Supabase en Jest
process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://test.supabase.co';
process.env.VITE_SUPABASE_KEY = process.env.VITE_SUPABASE_KEY || 'test-key';
// Mock para evitar errores de getContext en HTMLCanvasElement en Jest
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => {
    // Retorna un objeto vacío o con métodos mockeados si es necesario
    return {
      fillRect: () => {},
      clearRect: () => {},
      getImageData: () => ({ data: [] }),
      putImageData: () => {},
      createImageData: () => [],
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 }),
      setLineDash: () => {},
      getLineDash: () => [],
      font: '',
    };
  },
});