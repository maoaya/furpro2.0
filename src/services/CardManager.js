/**
 * CARD MANAGER - Sistema completo de gestión de Cards
 * Maneja creación, actualización, puntos y tier progression
 * Basado en sql/carfutpro-tiers-system.sql
 */

import supabase from '../supabaseClient'

// Configuración de Tiers (debe coincidir con SQL)
// Según 01_FUNCIONES_PUNTOS_TIERS.sql
export const CARD_TIERS = {
  BRONCE: { 
    tier: 'Bronce', 
    color: '#CD7F32', 
    minPoints: 0, 
    maxPoints: 99, 
    label: '🥉 Bronce', 
    emoji: '🥉',
    nextTier: 'Plata',
    nextPoints: 100
  },
  PLATA: { 
    tier: 'Plata', 
    color: '#C0C0C0', 
    minPoints: 100, 
    maxPoints: 199, 
    label: '🥈 Plata', 
    emoji: '🥈',
    nextTier: 'Oro',
    nextPoints: 200
  },
  ORO: { 
    tier: 'Oro', 
    color: '#FFD700', 
    minPoints: 200, 
    maxPoints: 499, 
    label: '🥇 Oro', 
    emoji: '🥇',
    nextTier: 'Diamante',
    nextPoints: 500
  },
  DIAMANTE: { 
    tier: 'Diamante', 
    color: '#00D9FF', 
    minPoints: 500, 
    maxPoints: 999, 
    label: '💎 Diamante', 
    emoji: '💎',
    nextTier: 'Leyenda',
    nextPoints: 1000
  },
  LEYENDA: { 
    tier: 'Leyenda', 
    color: '#FF00FF', 
    minPoints: 1000, 
    maxPoints: Infinity, 
    label: '👑 Leyenda', 
    emoji: '👑',
    nextTier: null,
    nextPoints: null
  }
}

class CardManager {
  /**
   * Obtener card de usuario por user_id
   */
  async getCard(userId) {
    try {
      console.log('📍 CardManager.getCard:', userId)
      
          const { data, error } = await supabase
          .from('carfutpro')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error obteniendo card:', error)
        throw error
      }

      if (!data) {
        console.log('⚠️ Card no encontrada para user_id:', userId)
        return null
      }

      console.log('✅ Card obtenida:', data)
      return data
    } catch (error) {
      console.error('❌ CardManager.getCard error:', error)
      throw error
    }
  }

  /**
   * Crear card nueva para usuario
   */
  async createCard(userId, profileData = {}) {
    try {
      console.log('📍 CardManager.createCard:', userId, profileData)

      // Preparar datos de card
      const cardData = {
        user_id: userId,
        email: profileData.email || profileData?.authUser?.email || '',
        nombre: profileData.nombre || 'Jugador',
        apellido: profileData.apellido || '',
        avatar_url: profileData.avatar_url || null,
        ciudad: profileData.ciudad || '',
        pais: profileData.pais || '',
        edad: profileData.edad ? Number(profileData.edad) : null,
        altura: profileData.altura || profileData.estatura?.toString() || '',
        peso: profileData.peso?.toString() || '',
        categoria: profileData.categoria || 'masculina', // Puede ser: masculina, femenina, infantil_masculina, infantil_femenina
        posicion_favorita: profileData.posicion || profileData.posicion_favorita || 'Flexible',
        nivel_habilidad: profileData.nivel_habilidad || profileData.experiencia || 'Principiante',
        pierna_dominante: profileData.pie || profileData.pierna_dominante || 'Derecha',
        disponibilidad_juego: profileData.disponibilidad_juego || 'Por coordinar',
        equipo: profileData.equipo || '—',
        // Sistema de puntos (inicializar en 0 - comienza en Bronce)
        puntos_totales: 0,
        card_tier: 'Bronce',
        partidos_ganados: 0,
        entrenamientos: 0,
        amistosos: 0,
        puntos_comportamiento: 0
      }

      console.log('📋 Insertando card:', cardData)

          const { data, error } = await supabase
            .from('carfutpro')
        .insert([cardData])
        .select('*')
        .single()

      if (error) {
        console.error('❌ Error creando card:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          status: error.status
        })
        throw error
      }

      console.log('✅ Card creada exitosamente:', data)
      return data
    } catch (error) {
      console.error('❌ CardManager.createCard error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        status: error.status
      })
      throw error
    }
  }

  /**
   * Actualizar card existente
   */
  async updateCard(userId, updates) {
    try {
      console.log('📍 CardManager.updateCard:', userId, updates)

      // No permitir actualizar campos del sistema directamente
      const allowedFields = [
        'email', 'nombre', 'apellido', 'avatar_url', 'ciudad', 'pais', 'edad',
        'altura', 'peso', 'categoria', 'posicion_favorita', 'nivel_habilidad',
        'pierna_dominante', 'disponibilidad_juego', 'equipo'
      ]

      const safeUpdates = {}
      allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
          safeUpdates[field] = updates[field]
        }
      })

      safeUpdates.actualizada_en = new Date().toISOString()

      console.log('📝 Actualizando campos:', safeUpdates)

          const { data, error } = await supabase
            .from('carfutpro')
        .update(safeUpdates)
        .eq('user_id', userId)
        .select('*')
        .single()

      if (error) {
        console.error('❌ Error actualizando card:', error)
        throw error
      }

      console.log('✅ Card actualizada:', data)
      return data
    } catch (error) {
      console.error('❌ CardManager.updateCard error:', error)
      throw error
    }
  }

  /**
   * Agregar puntos usando la función SQL agregar_puntos_card
   */
  async addPoints(userId, points, type, description = '') {
    try {
      console.log('📍 CardManager.addPoints:', { userId, points, type, description })

      // Tipos válidos según SQL
      const validTypes = ['partido', 'entrenamiento', 'comportamiento', 'amistoso']
      if (!validTypes.includes(type)) {
        throw new Error(`Tipo de puntos inválido: ${type}. Debe ser: ${validTypes.join(', ')}`)
      }

      // Llamar a la función SQL
      const { data, error } = await supabase.rpc('agregar_puntos_card', {
        p_user_id: userId,
        p_puntos: points,
        p_tipo: type,
        p_descripcion: description
      })

      if (error) {
        console.error('❌ Error agregando puntos:', error)
        throw error
      }

      console.log('✅ Puntos agregados:', data)
      return data
    } catch (error) {
      console.error('❌ CardManager.addPoints error:', error)
      throw error
    }
  }

  /**
   * Calcular tier basado en puntos
   */
  calculateTier(points) {
    const numPoints = Number(points) || 0
    
    if (numPoints < 500) return CARD_TIERS.BRONCE
    if (numPoints < 1000) return CARD_TIERS.PLATA
    if (numPoints < 2000) return CARD_TIERS.ORO
    if (numPoints < 5000) return CARD_TIERS.DIAMANTE
    return CARD_TIERS.LEYENDA
  }

  /**
   * Calcular progreso hacia siguiente tier
   */
  calculateProgress(points) {
    const numPoints = Number(points) || 0
    const currentTier = this.calculateTier(numPoints)
    
    if (!currentTier.nextTier) {
      return {
        current: currentTier,
        next: null,
        pointsToNext: 0,
        percentage: 100,
        progress: numPoints - currentTier.minPoints
      }
    }

    const nextTier = Object.values(CARD_TIERS).find(t => t.tier === currentTier.nextTier)
    const pointsToNext = nextTier.minPoints - numPoints
    const tierRange = nextTier.minPoints - currentTier.minPoints
    const tierProgress = numPoints - currentTier.minPoints
    const percentage = (tierProgress / tierRange) * 100

    return {
      current: currentTier,
      next: nextTier,
      pointsToNext,
      percentage: Math.min(100, Math.max(0, percentage)),
      progress: tierProgress
    }
  }

  /**
   * Obtener historial de puntos
   */
  async getPointsHistory(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('card_puntos_historial')
        .select('*')
        .eq('user_id', userId)
        .order('creado_en', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('❌ Error obteniendo historial:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('❌ CardManager.getPointsHistory error:', error)
      throw error
    }
  }

  /**
   * Obtener o crear card (útil para registro)
   */
  async getOrCreateCard(userId, profileData = {}) {
    try {
      // Intentar obtener card existente
      const existingCard = await this.getCard(userId)
      
      if (existingCard) {
        console.log('✅ Card ya existe, retornando:', existingCard)
        return existingCard
      }

      // Crear nueva card
      console.log('📝 Card no existe, creando nueva...')
      const newCard = await this.createCard(userId, profileData)
      return newCard
    } catch (error) {
      console.error('❌ CardManager.getOrCreateCard error:', error)
      throw error
    }
  }

  /**
   * Subir avatar a Supabase Storage
   */
  async uploadAvatar(userId, file) {
    try {
      console.log('📸 Subiendo avatar para user:', userId)

      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('❌ Error subiendo avatar:', error)
        throw error
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      console.log('✅ Avatar subido:', urlData.publicUrl)
      return urlData.publicUrl
    } catch (error) {
      console.error('❌ CardManager.uploadAvatar error:', error)
      throw error
    }
  }

  /**
   * Convertir data URL a File
   */
  dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    
    return new File([u8arr], filename, { type: mime })
  }
}

// Exportar instancia singleton
const cardManager = new CardManager()
export default cardManager

// Exportar funciones helper
export const calculateTierFromPoints = (points) => cardManager.calculateTier(points)
export const calculateProgress = (points) => cardManager.calculateProgress(points)
