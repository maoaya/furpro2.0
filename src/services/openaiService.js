// Stub de servicio OpenAI para frontend/tests sin dependencias ni API real.
// Evita errores de importes no usados o variables de entorno durante lint/tests.
const openaiService = {
  generarTexto: async () => 'Texto generado',
};

export default openaiService;