import OpenAI from 'openai';

// Configuración de OpenAI
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Solo para desarrollo, en producción usar backend
});

export class AIService {
  static async generateResponse(message, context = {}) {
    try {
      const systemPrompt = `Eres Grok, un asistente de IA creado por xAI. Estás integrado en FutPro, una plataforma de fútbol que ayuda a los usuarios a gestionar equipos, torneos y estadísticas.

Contexto del usuario:
- Nombre: ${context.userName || 'Usuario'}
- Email: ${context.userEmail || 'No disponible'}
- Rol: ${context.userRole || 'Usuario regular'}

Instrucciones:
- Sé útil y amigable
- Proporciona información precisa sobre fútbol cuando sea relevante
- Ayuda con consejos sobre gestión de equipos, estrategias de juego, estadísticas
- Mantén un tono conversacional y motivador
- Si no sabes algo, admítelo honestamente
- Responde en español cuando el usuario pregunte en español

Pregunta del usuario: ${message}`;

      const completion = await openai.chat.completions.create({
        model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return {
        success: true,
        response: completion.choices[0].message.content,
        usage: completion.usage
      };

    } catch (error) {
      console.error('Error en AIService:', error);
      return {
        success: false,
        error: error.message || 'Error al generar respuesta',
        response: 'Lo siento, tuve un problema para procesar tu mensaje. ¿Puedes intentarlo de nuevo?'
      };
    }
  }

  static async getFutbolAdvice(type, context = {}) {
    const prompts = {
      estrategia: `Dame consejos estratégicos para un partido de fútbol basándome en: ${context}`,
      formacion: `Recomienda una formación táctica para: ${context}`,
      entrenamiento: `Sugiere un plan de entrenamiento para: ${context}`,
      estadisticas: `Analiza estas estadísticas de fútbol: ${context}`
    };

    return this.generateResponse(prompts[type] || context, {
      userName: context.userName,
      userEmail: context.userEmail,
      userRole: context.userRole
    });
  }

  static async analyzeTeam(teamData) {
    const prompt = `Analiza este equipo de fútbol y proporciona recomendaciones:
Nombre: ${teamData.name}
Jugadores: ${teamData.players?.length || 0}
Nivel: ${teamData.level}
Estilo de juego: ${teamData.style}

Proporciona:
1. Fortalezas del equipo
2. Áreas de mejora
3. Sugerencias tácticas
4. Consejos de entrenamiento`;

    return this.generateResponse(prompt, teamData.context);
  }

  static async predictMatch(homeTeam, awayTeam, context = {}) {
    const prompt = `Predice el resultado de este partido de fútbol:

Equipo Local: ${homeTeam.name}
Estadísticas Local: ${JSON.stringify(homeTeam.stats || {})}

Equipo Visitante: ${awayTeam.name}
Estadísticas Visitante: ${JSON.stringify(awayTeam.stats || {})}

Contexto adicional: ${context.description || 'Partido regular'}

Proporciona:
1. Predicción del marcador
2. Análisis de probabilidades
3. Jugadores clave a observar
4. Consejos tácticos para ambos equipos`;

    return this.generateResponse(prompt, context);
  }
}

export default AIService;