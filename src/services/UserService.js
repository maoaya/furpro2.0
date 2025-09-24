// Servicio para manejar la lógica de usuarios y registro
import { supabase } from '../config/supabase';

export class UserService {
  
  /**
   * Verifica si un usuario existe en la base de datos
   */
  static async checkUserExists(firebaseUser) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, email, nombre, apellido, user_type, fecha_creacion, profile_completed')
        .eq('email', firebaseUser.email)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error verificando usuario:', error);
      return null;
    }
  }

  /**
   * Crea un nuevo usuario en la base de datos
   */
  static async createUser(firebaseUser) {
    try {
      console.log('🆕 Creando nuevo usuario:', firebaseUser.email);
      
      // Extraer nombre y apellido del displayName de Firebase
      const fullName = firebaseUser.displayName || '';
      const [nombre, ...apellidoParts] = fullName.split(' ');
      const apellido = apellidoParts.join(' ') || '';

      const userData = {
        email: firebaseUser.email,
        nombre: nombre || 'Usuario',
        apellido: apellido || '',
        firebase_uid: firebaseUser.uid,
        user_type: 'integrado',
        avatar_url: firebaseUser.photoURL || null,
        telefono: firebaseUser.phoneNumber || null,
        email_verificado: firebaseUser.emailVerified || false,
        provider: firebaseUser.providerData[0]?.providerId || 'unknown',
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        profile_completed: false,
        activo: true
      };

      const { data, error } = await supabase
        .from('usuarios')
        .insert([userData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('✅ Usuario creado exitosamente:', data.id);
      return data;
    } catch (error) {
      console.error('❌ Error creando usuario:', error);
      throw error;
    }
  }

  /**
   * Actualiza la información de un usuario existente
   */
  static async updateUser(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update({
          ...updates,
          fecha_actualizacion: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  }

  /**
   * Marca el perfil como completado
   */
  static async markProfileCompleted(userId) {
    return this.updateUser(userId, { profile_completed: true });
  }

  /**
   * Procesa el registro completo: verifica existencia y crea/actualiza usuario
   */
  static async processRegistration(firebaseUser) {
    try {
      console.log('🔄 Procesando registro para:', firebaseUser.email);
      
      // Verificar si el usuario ya existe
      let existingUser = await this.checkUserExists(firebaseUser);
      
      if (existingUser) {
        console.log('👤 Usuario existente encontrado:', existingUser.id);
        
        // Actualizar información si es necesario
        const updates = {};
        if (!existingUser.firebase_uid) updates.firebase_uid = firebaseUser.uid;
        if (!existingUser.avatar_url && firebaseUser.photoURL) updates.avatar_url = firebaseUser.photoURL;
        if (existingUser.email_verificado !== firebaseUser.emailVerified) updates.email_verificado = firebaseUser.emailVerified;
        
        if (Object.keys(updates).length > 0) {
          existingUser = await this.updateUser(existingUser.id, updates);
        }
        
        return {
          user: existingUser,
          isNewUser: false,
          needsProfileCompletion: !existingUser.profile_completed
        };
      } else {
        console.log('🆕 Creando nuevo usuario...');
        const newUser = await this.createUser(firebaseUser);
        
        return {
          user: newUser,
          isNewUser: true,
          needsProfileCompletion: true
        };
      }
    } catch (error) {
      console.error('❌ Error procesando registro:', error);
      throw error;
    }
  }

  /**
   * Obtiene el perfil completo del usuario
   */
  static async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      return null;
    }
  }

  /**
   * Valida los datos de registro del usuario
   */
  static validateUserData(userData) {
    const errors = [];

    if (!userData.nombre || userData.nombre.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!userData.apellido || userData.apellido.trim().length < 2) {
      errors.push('El apellido debe tener al menos 2 caracteres');
    }

    if (userData.telefono && !/^\+?[\d\s\-\(\)]{10,}$/.test(userData.telefono)) {
      errors.push('El teléfono no tiene un formato válido');
    }

    if (userData.fecha_nacimiento) {
      const birthDate = new Date(userData.fecha_nacimiento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 13) {
        errors.push('Debes tener al menos 13 años para registrarte');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}