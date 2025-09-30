// 🔐 FutPro - Servicio de Autenticación
import supabase from '../supabaseClient';
import { updateUserRole } from '../config/supabase.js';
import { getConfig } from '../config/environment.js';

export class AuthService {
  constructor() {
    this.currentUser = null
    this.isAuthenticated = false
    this.userProfile = null
  }

  // ===== MÉTODOS DE AUTENTICACIÓN =====

  async signInWithEmail(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      this.currentUser = data.user
      this.isAuthenticated = true
      
      // Cargar perfil del usuario
      await this.loadUserProfile(data.user.id)
      
      return {
        success: true,
        user: data.user,
        profile: this.userProfile
      }

    } catch (error) {
      console.error('Error en login con email:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  async signUpWithEmail(userData) {
    try {
      const { email, password, name, phone, userType, position } = userData

      // Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            user_type: userType,
            position: position || null
          }
        }
      })

      if (error) throw error

      // Crear perfil en la base de datos
      const profileData = {
        id: data.user.id,
        email,
        name,
        phone,
        user_type: userType,
        position: position || null,
        avatar_url: null,
        team_name: null,
        stats: this.getInitialStats(userType),
        achievements: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert([profileData])
        .select()
        .single()

      if (profileError) throw profileError

      this.userProfile = profile

      return {
        success: true,
        user: data.user,
        profile: profile,
        message: 'Cuenta creada exitosamente. Verifica tu email.'
      }

    } catch (error) {
      console.error('Error en registro:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  async signInWithGoogle() {
  // ...existing code...
    try {
      // Detectar si es móvil para optimizar configuración
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const { oauthCallbackUrl } = getConfig();
      
      const config = {
        provider: 'google',
        options: {
          redirectTo: oauthCallbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          },
          scopes: 'email profile'
        }
      };

      // Configuración específica para móviles
      if (isMobile) {
        config.options.queryParams.mobile = 'true';
        
        if (isIOS) {
          config.options.queryParams.device = 'ios';
          // Para iOS, usar configuración específica
          config.options.queryParams.display = 'touch';
        }
      }

  // ...existing code...
  const { error } = await supabase.auth.signInWithOAuth(config);
      if (error) {
  // ...existing code...
        throw error;
      }
  // ...existing code...
      return {
        success: true,
        message: 'Redirigiendo a Google...',
        mobile: isMobile,
        device: isIOS ? 'ios' : 'other'
      };
    } catch (error) {
  // ...existing code...
      throw new Error(this.getErrorMessage(error));
    }
  }

  async signInWithFacebook() {
    try {
      const { oauthCallbackUrl } = getConfig();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: oauthCallbackUrl,
          scopes: 'email,public_profile',
          queryParams: {
            display: 'popup',
            response_type: 'code'
          }
        }
      })

      if (error) throw error

      return {
        success: true,
        message: 'Redirigiendo a Facebook...',
        provider: 'facebook'
      }

    } catch (error) {
      console.error('Error en login con Facebook:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error

      return {
        success: true,
        message: 'Instrucciones de recuperación enviadas a tu email'
      }

    } catch (error) {
      console.error('Error enviando email de recuperación:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      return {
        success: true,
        message: 'Contraseña actualizada exitosamente'
      }

    } catch (error) {
      console.error('Error actualizando contraseña:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error

      this.currentUser = null
      this.isAuthenticated = false
      this.userProfile = null

      return {
        success: true,
        message: 'Sesión cerrada exitosamente'
      }

    } catch (error) {
      console.error('Error cerrando sesión:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  // ===== MÉTODOS DE PERFIL =====

  async loadUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // Si no existe el perfil, crearlo
        if (error.code === 'PGRST116') {
          return await this.createUserProfile(userId)
        }
        throw error
      }

      this.userProfile = data
      return data

    } catch (error) {
      console.error('Error cargando perfil:', error)
      throw error
    }
  }

  async createUserProfile(userId) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Usuario no encontrado')

      const profileData = {
        id: userId,
        email: user.email,
        name: user.user_metadata?.name || user.email.split('@')[0],
        phone: user.user_metadata?.phone || null,
  user_type: user.user_metadata?.user_type || 'integrado',
        position: user.user_metadata?.position || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        team_name: null,
  stats: this.getInitialStats(user.user_metadata?.user_type || 'integrado'),
        achievements: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('users')
        .insert([profileData])
        .select()
        .single()

      if (error) throw error

      this.userProfile = data
      return data

    } catch (error) {
      console.error('Error creando perfil:', error)
      throw error
    }
  }

  async updateUserProfile(updates) {
    try {
      if (!this.currentUser) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.currentUser.id)
        .select()
        .single()

      if (error) throw error

      this.userProfile = { ...this.userProfile, ...data }
      
      return {
        success: true,
        profile: this.userProfile
      }

    } catch (error) {
      console.error('Error actualizando perfil:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  // ===== MÉTODOS DE VERIFICACIÓN =====

  async verifyPhoneNumber(phoneNumber) {
    try {
      // Generar código de verificación
  // Código de verificación generado en backend
      
      // Enviar a través del servidor backend
      const response = await fetch('/api/auth/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ phoneNumber })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      return {
        success: true,
        message: 'Código de verificación enviado'
      }

    } catch (error) {
      console.error('Error verificando teléfono:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  async confirmPhoneVerification(phoneNumber, code) {
    try {
      const response = await fetch('/api/auth/confirm-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ phoneNumber, code })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      // Actualizar perfil como verificado
      await this.updateUserProfile({
        phone_verified: true,
        phone: phoneNumber
      })

      return {
        success: true,
        message: 'Teléfono verificado exitosamente'
      }

    } catch (error) {
      console.error('Error confirmando verificación:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  // ===== MÉTODOS DE VALIDACIÓN =====

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  validatePassword(password) {
    const errors = []
    
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe tener al menos una mayúscula')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe tener al menos una minúscula')
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('La contraseña debe tener al menos un número')
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength: this.getPasswordStrength(password)
    }
  }

  validateAge(birthDate) {
    const today = new Date()
    const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return {
      age,
      isValid: age >= 12,
      needsParentalConsent: age < 18
    }
  }

  // ===== MÉTODOS AUXILIARES =====

  getPasswordStrength(password) {
    let score = 0
    
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    
    if (score <= 1) return 'weak'
    if (score <= 2) return 'fair'
    if (score <= 3) return 'good'
    return 'strong'
  }

  getInitialStats(userType) {
    const baseStats = {
      rating: 500,
      level: 'Novato',
      matches_played: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      created_at: new Date().toISOString()
    }

    if (userType === 'player') {
      return {
        ...baseStats,
        goals: 0,
        assists: 0,
        yellow_cards: 0,
        red_cards: 0,
        blue_cards: 0,
        minutes_played: 0,
        clean_sheets: 0,
        tackles: 0,
        interceptions: 0,
        passes_completed: 0,
        shots_on_target: 0
      }
    }

    if (userType === 'referee') {
      return {
        ...baseStats,
        matches_refereed: 0,
        yellow_cards_given: 0,
        red_cards_given: 0,
        blue_cards_given: 0,
        average_rating: 0
      }
    }

    if (userType === 'organizer') {
      return {
        ...baseStats,
        tournaments_organized: 0,
        total_participants: 0,
        success_rate: 0
      }
    }

    return baseStats
  }

  getErrorMessage(error) {
    const errorMessages = {
      'Invalid login credentials': 'Credenciales de login inválidas',
      'Email not confirmed': 'Email no confirmado',
      'User already registered': 'Usuario ya registrado',
      'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
      'Invalid email': 'Email inválido',
      'Email already in use': 'Email ya está en uso',
      'Weak password': 'Contraseña muy débil',
      'User not found': 'Usuario no encontrado',
      'Too many requests': 'Demasiadas solicitudes, intenta más tarde'
    }

    return errorMessages[error.message] || error.message || 'Error desconocido'
  }

  // ===== MÉTODOS DE ESTADO =====

  isLoggedIn() {
    return this.isAuthenticated && this.currentUser !== null
  }

  getCurrentUser() {
    return this.currentUser
  }

  getUserProfile() {
    return this.userProfile
  }

  getUserType() {
    return this.userProfile?.user_type || 'player'
  }

  getUserRating() {
    return this.userProfile?.stats?.rating || 500
  }

  getUserLevel() {
    const rating = this.getUserRating()
    
    if (rating >= 2000) return 'Super Leyenda'
    if (rating >= 1800) return 'Leyenda'
    if (rating >= 1600) return 'Estrella'
    if (rating >= 1400) return 'Crack'
    if (rating >= 1200) return 'Profesional'
    if (rating >= 1000) return 'Semi-Pro'
    if (rating >= 800) return 'Amateur'
    return 'Novato'
  }

  // ===== SUSCRIPCIÓN A CAMBIOS DE AUTH =====

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        this.currentUser = session.user
        this.isAuthenticated = true
        this.loadUserProfile(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        this.currentUser = null
        this.isAuthenticated = false
        this.userProfile = null
      }
      
      callback(event, session)
    })
  }
}

export default AuthService

export async function cambiarRolUsuario(userId, role) {
  return await updateUserRole(userId, role);
}
