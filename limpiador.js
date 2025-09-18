

// limpiador.js
// Utilidad para limpiar entradas peligrosas y sugerir mejoras con IA (Copilot)

let sugerirConIA;
if (process.env.NODE_ENV === 'test') {
  // Mock para tests: no llama a OpenAI
  sugerirConIA = async () => 'Sugerencia IA simulada para test';
} else {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    require('openai/shims/node');
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey });
    sugerirConIA = async (prompt) => {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
      });
      return response.choices[0].message.content.trim();
    };
  } else {
    // Sin API key, devolvemos un mensaje neutral y evitamos llamadas externas
    sugerirConIA = async () => 'Sugerencia IA no disponible (sin OPENAI_API_KEY)';
  }
}

function limpiarEntrada(texto) {
  texto = texto.replace(/<[^>]*>?/gm, '');
  texto = texto.replace(/(on\w+\s*=\s*["'][^"']*["'])/gi, '');
  texto = texto.replace(/(javascript:|data:|vbscript:)/gi, '');
  texto = texto.replace(/(--|;|\/\*|\*\/|xp_|exec|union|select|insert|update|delete|drop|alter|create)/gi, '');
  texto = texto.replace(/[\u{1F600}-\u{1F6FF}]/gu, '');
  texto = texto.trim();
  return texto;
}



module.exports = {
  limpiarEntrada,
  sugerirConIA
};
