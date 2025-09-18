// Servicio básico de streaming para FutPro
// Simula la obtención de streams en vivo


const VALID_PROVIDERS = [
  'youtube.com', 'youtu.be', 'kick.com', 'twitch.tv', 'facebook.com', 'obs',
];

class StreamingService {
  constructor() {
    this.streams = [
      {
        id: 'stream1',
        title: 'Partido en vivo: FutPro FC vs Golden Team',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        provider: 'youtube',
        viewers: 1200,
        startedAt: new Date(Date.now() - 600000).toISOString()
      },
      {
        id: 'stream2',
        title: 'Entrenamiento en directo',
        url: 'https://www.twitch.tv/videos/123456789',
        provider: 'twitch',
        viewers: 350,
        startedAt: new Date(Date.now() - 1800000).toISOString()
      }
    ];
  }

  async getActiveStreams() {
    return this.streams;
  }

  async getStreamById(id) {
    return this.streams.find(s => s.id === id) || null;
  }

  // Validar si la URL es de un proveedor permitido
  validateStreamUrl(url) {
    try {
      const u = new URL(url);
      return VALID_PROVIDERS.some(domain => u.hostname.includes(domain));
    } catch {
      // Permitir 'obs' como identificador local
      return url === 'obs';
    }
  }

  // Agregar un nuevo stream dinámicamente
  async addStream({ title, url }) {
    if (!title || !url) throw new Error('Título y URL requeridos');
    if (!this.validateStreamUrl(url)) throw new Error('Proveedor de streaming no permitido');
    const provider = this.getProviderFromUrl(url);
    const newStream = {
      id: 'stream_' + Date.now(),
      title,
      url,
      provider,
      viewers: 0,
      startedAt: new Date().toISOString()
    };
    this.streams.push(newStream);
    return newStream;
  }

  getProviderFromUrl(url) {
    if (url === 'obs') return 'obs';
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) return 'youtube';
      if (u.hostname.includes('kick.com')) return 'kick';
      if (u.hostname.includes('twitch.tv')) return 'twitch';
      if (u.hostname.includes('facebook.com')) return 'facebook';
      return 'otro';
    } catch {
      return 'otro';
    }
  }
}

export const streamingService = new StreamingService();
