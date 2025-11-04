/**
 * CARD SERVICE
 * Servicio para creación y gestión de tarjetas FIFA-style
 */

import supabase from '../supabaseClient.js';

class CardService {
  constructor() {
    this.cardTypes = {
      BRONZE: { min: 1, max: 64, color: '#CD7F32' },
      SILVER: { min: 65, max: 74, color: '#C0C0C0' },
      GOLD: { min: 75, max: 99, color: '#FFD700' },
      SPECIAL: { min: 80, max: 99, color: '#00FF00' }
    };
  }

  /**
   * Generar tarjeta de jugador
   */
  async generateCard(userId, stats = null) {
    try {
      // Obtener datos del usuario
      const { data: user, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Calcular stats si no se proporcionan
      const cardStats = stats || await this.calculateStats(userId);
      
      // Calcular OVR (Overall Rating)
      const ovr = this.calculateOVR(cardStats);

      // Determinar tipo de tarjeta
      const cardType = this.determineCardType(ovr);

      // Crear objeto de tarjeta
      const card = {
        userId,
        username: user.username || user.email?.split('@')[0],
        nombre: user.nombre_completo || 'Jugador',
        avatar: user.avatar_url || null,
        ovr,
        stats: cardStats,
        cardType,
        color: this.cardTypes[cardType].color,
        position: cardStats.position || 'CAM',
        nationality: user.nacionalidad || 'Unknown',
        team: user.equipo_nombre || 'Free Agent',
        createdAt: new Date().toISOString()
      };

      // Guardar en Supabase
      await this.saveCard(card);

      return card;
      
    } catch (error) {
      console.error('Error generando tarjeta:', error);
      throw error;
    }
  }

  /**
   * Calcular estadísticas basadas en desempeño
   */
  async calculateStats(userId) {
    try {
      // Obtener datos de partidos
      const { data: matches, error } = await supabase
        .from('partidos')
        .select('*')
        .or(`jugador1_id.eq.${userId},jugador2_id.eq.${userId}`)
        .limit(20);

      if (error) throw error;

      // Calcular promedios
      const totalMatches = matches?.length || 0;
      const wins = matches?.filter(m => 
        (m.jugador1_id === userId && m.ganador_id === userId) ||
        (m.jugador2_id === userId && m.ganador_id === userId)
      ).length || 0;

      const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 50;

      // Generar stats FIFA-style (0-99)
      return {
        pac: Math.min(99, Math.floor(60 + (winRate / 100) * 35 + Math.random() * 10)),
        sho: Math.min(99, Math.floor(55 + (winRate / 100) * 40 + Math.random() * 10)),
        pas: Math.min(99, Math.floor(60 + (winRate / 100) * 35 + Math.random() * 10)),
        dri: Math.min(99, Math.floor(65 + (winRate / 100) * 30 + Math.random() * 10)),
        def: Math.min(99, Math.floor(50 + (winRate / 100) * 40 + Math.random() * 10)),
        phy: Math.min(99, Math.floor(60 + (winRate / 100) * 35 + Math.random() * 10)),
        position: 'CAM'
      };
      
    } catch (error) {
      console.error('Error calculando stats:', error);
      
      // Stats por defecto
      return {
        pac: 65,
        sho: 60,
        pas: 65,
        dri: 70,
        def: 55,
        phy: 65,
        position: 'CAM'
      };
    }
  }

  /**
   * Calcular OVR (promedio ponderado)
   */
  calculateOVR(stats) {
    const weights = {
      pac: 0.15,
      sho: 0.20,
      pas: 0.15,
      dri: 0.20,
      def: 0.15,
      phy: 0.15
    };

    const ovr = Math.floor(
      stats.pac * weights.pac +
      stats.sho * weights.sho +
      stats.pas * weights.pas +
      stats.dri * weights.dri +
      stats.def * weights.def +
      stats.phy * weights.phy
    );

    return Math.min(99, Math.max(1, ovr));
  }

  /**
   * Determinar tipo de tarjeta según OVR
   */
  determineCardType(ovr) {
    if (ovr >= 75) return 'GOLD';
    if (ovr >= 65) return 'SILVER';
    return 'BRONZE';
  }

  /**
   * Guardar tarjeta en Supabase
   */
  async saveCard(card) {
    try {
      const { data, error } = await supabase
        .from('tarjetas_fifa')
        .upsert({
          user_id: card.userId,
          ovr: card.ovr,
          stats: card.stats,
          card_type: card.cardType,
          position: card.position,
          created_at: card.createdAt
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      
      console.log('✅ Tarjeta guardada:', card.ovr);
      return data;
      
    } catch (error) {
      console.error('Error guardando tarjeta:', error);
      // Guardar en localStorage como fallback
      this.saveToLocalStorage(card);
    }
  }

  /**
   * Guardar en localStorage (fallback)
   */
  saveToLocalStorage(card) {
    try {
      const cards = JSON.parse(localStorage.getItem('futpro_cards') || '[]');
      const index = cards.findIndex(c => c.userId === card.userId);
      
      if (index >= 0) {
        cards[index] = card;
      } else {
        cards.push(card);
      }

      localStorage.setItem('futpro_cards', JSON.stringify(cards.slice(-100)));
      console.log('💾 Tarjeta guardada en localStorage');
      
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
    }
  }

  /**
   * Obtener tarjeta de usuario
   */
  async getCard(userId) {
    try {
      const { data, error } = await supabase
        .from('tarjetas_fifa')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // Si no existe, generar una nueva
      if (!data) {
        return await this.generateCard(userId);
      }

      return data;
      
    } catch (error) {
      console.error('Error obteniendo tarjeta:', error);
      
      // Buscar en localStorage
      const cards = JSON.parse(localStorage.getItem('futpro_cards') || '[]');
      const card = cards.find(c => c.userId === userId);
      
      if (card) return card;
      
      // Generar nueva como último recurso
      return await this.generateCard(userId);
    }
  }

  /**
   * Actualizar stats de tarjeta
   */
  async updateCardStats(userId, newStats) {
    try {
      const ovr = this.calculateOVR(newStats);
      const cardType = this.determineCardType(ovr);

      const { data, error } = await supabase
        .from('tarjetas_fifa')
        .update({
          ovr,
          stats: newStats,
          card_type: cardType,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Tarjeta actualizada:', ovr);
      return data;
      
    } catch (error) {
      console.error('Error actualizando tarjeta:', error);
      throw error;
    }
  }

  /**
   * Generar imagen de tarjeta (HTML/Canvas)
   */
  generateCardHTML(card) {
    return `
      <div class="fifa-card" style="
        background: linear-gradient(135deg, ${card.color}, ${card.color}88);
        width: 300px;
        height: 450px;
        border-radius: 15px;
        padding: 20px;
        color: white;
        font-family: 'Roboto', sans-serif;
        position: relative;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      ">
        <div style="font-size: 48px; font-weight: bold; text-align: center;">
          ${card.ovr}
        </div>
        <div style="text-align: center; font-size: 14px; margin-top: -10px;">
          ${card.position}
        </div>
        <div style="text-align: center; margin-top: 20px;">
          ${card.avatar ? 
            `<img src="${card.avatar}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover;" />` :
            `<div style="width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,0.2); margin: 0 auto;"></div>`
          }
        </div>
        <div style="text-align: center; font-size: 20px; font-weight: bold; margin-top: 15px;">
          ${card.nombre}
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 20px; font-size: 12px;">
          <div style="text-align: center;">
            <div style="font-weight: bold;">${card.stats.pac}</div>
            <div>PAC</div>
          </div>
          <div style="text-align: center;">
            <div style="font-weight: bold;">${card.stats.sho}</div>
            <div>SHO</div>
          </div>
          <div style="text-align: center;">
            <div style="font-weight: bold;">${card.stats.pas}</div>
            <div>PAS</div>
          </div>
          <div style="text-align: center;">
            <div style="font-weight: bold;">${card.stats.dri}</div>
            <div>DRI</div>
          </div>
          <div style="text-align: center;">
            <div style="font-weight: bold;">${card.stats.def}</div>
            <div>DEF</div>
          </div>
          <div style="text-align: center;">
            <div style="font-weight: bold;">${card.stats.phy}</div>
            <div>PHY</div>
          </div>
        </div>
        <div style="position: absolute; bottom: 15px; left: 20px; right: 20px; text-align: center; font-size: 11px; opacity: 0.8;">
          ${card.team} • ${card.cardType}
        </div>
      </div>
    `;
  }
}

// Instancia singleton
const cardService = new CardService();

export default cardService;
export { CardService };
