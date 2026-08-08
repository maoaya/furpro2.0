// limpiador.js (ESM)
// Utilidad para limpiar entradas peligrosas y sugerir mejoras con IA (opcional)

import OpenAI from 'openai';

export function limpiarEntrada(texto) {
  if (typeof texto !== 'string') return '';
  let limpio = texto.replace(/<[^>]*>?/gm, '');
  limpio = limpio.replace(/(on\w+\s*=\s*["'][^"']*["'])/gi, '');
  limpio = limpio.replace(/(javascript:|data:|vbscript:)/gi, '');
  limpio = limpio.replace(/(--|;|\/\*|\*\/|xp_|exec|union|select|insert|update|delete|drop|alter|create)/gi, '');
  limpio = limpio.replace(/[\u{1F600}-\u{1F6FF}]/gu, '');
  return limpio.trim();
}

export async function sugerirConIA(prompt) {
  // En tests devolvemos una sugerencia simulada
  if (process.env.NODE_ENV === 'test') {
    return 'Sugerencia IA simulada para test';
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return 'Sugerencia IA no disponible (sin OPENAI_API_KEY)';
  }

  try {
    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `${prompt || ''}` }],
      max_tokens: 100,
    });
    return response.choices?.[0]?.message?.content?.trim() || '';
  } catch (e) {
    // Evitar romper el flujo si falla la IA
    return 'Sugerencia IA no disponible (error al llamar a OpenAI)';
  }
}
