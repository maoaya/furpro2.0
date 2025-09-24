// 🔗 MEJORADOR DE FLUJO COMPLETO - OAUTH → REGISTRO → BD
// Este archivo asegura que el flujo completo funcione en futpro.vip

import { conexionEfectiva } from './conexionEfectiva.js';
import supabase from '../supabaseClient.js';

export const flujoCompletoRegistro = {
  
  // Función principal que maneja todo el flujo
  async iniciarRegistroCompleto(provider = 'google') {
    console.log(`🚀 INICIANDO FLUJO COMPLETO DE REGISTRO CON ${provider.toUpperCase()}`);
    
    try {
      // 1. Iniciar OAuth
      let resultado;
      if (provider === 'google') {
        resultado = await conexionEfectiva.registrarConGoogle();
      } else if (provider === 'facebook') {
        resultado = await conexionEfectiva.registrarConFacebook();
      } else {
        throw new Error(`Provider ${provider} no soportado`);
      }
      
      if (!resultado.success) {
        throw new Error(resultado.error);
      }
      
      console.log(`✅ OAuth con ${provider} iniciado exitosamente`);
      return resultado;
      
    } catch (error) {
      console.error('❌ Error en flujo completo:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Función para completar el registro después del OAuth
  async completarRegistroPostOAuth(datosFormulario) {
    console.log('📝 COMPLETANDO REGISTRO POST-OAUTH...');
    
    try {
      // Obtener sesión actual
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session.session?.user) {
        throw new Error('No hay sesión OAuth activa');
      }
      
      const user = session.session.user;
      console.log('👤 Usuario OAuth encontrado:', user.email);
      
      // Preparar datos completos
      const usuarioCompleto = {
        id: user.id,
        email: user.email,
        nombre: datosFormulario.nombre || user.user_metadata?.full_name || user.email.split('@')[0],
        edad: datosFormulario.edad || 18,
        peso: datosFormulario.peso || '',
        ciudad: datosFormulario.ciudad || '',
        pais: datosFormulario.pais || 'España',
        posicion: datosFormulario.posicion || 'Delantero',
        frecuencia_juego: datosFormulario.frecuencia_juego || 'Semanal',
        avatar_url: datosFormulario.avatar_url || user.user_metadata?.avatar_url || null,
        rol: datosFormulario.rol || 'usuario',
        tipo_usuario: datosFormulario.tipo_usuario || 'jugador',
        funciones_adicionales: datosFormulario.funciones_adicionales || [],
        auth_provider: user.app_metadata?.provider || 'oauth',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        activo: true
      };
      
      console.log('💾 Datos del usuario a guardar:', usuarioCompleto);
      
      // Verificar si ya existe
      const { data: existeUsuario } = await supabase
        .from('usuarios')
        .select('id')
        .eq('id', user.id)
        .single();
      
      let resultado;
      
      if (existeUsuario) {
        // Actualizar usuario existente
        const { data, error } = await supabase
          .from('usuarios')
          .update(usuarioCompleto)
          .eq('id', user.id)
          .select()
          .single();
          
        if (error) throw error;
        resultado = { data, isUpdate: true };
        console.log('🔄 Usuario actualizado:', data);
        
      } else {
        // Crear nuevo usuario
        const { data, error } = await supabase
          .from('usuarios')
          .insert([usuarioCompleto])
          .select()
          .single();
          
        if (error) throw error;
        resultado = { data, isNew: true };
        console.log('✨ Usuario nuevo creado:', data);
      }
      
      // Limpiar datos temporales
      localStorage.removeItem('pendingProfileData');
      localStorage.removeItem('registroProgreso');
      localStorage.removeItem('tempRegistroData');
      
      // Guardar usuario en localStorage para uso inmediato
      localStorage.setItem('currentUser', JSON.stringify(resultado.data));
      
      return {
        success: true,
        user: resultado.data,
        message: resultado.isUpdate ? 'Perfil actualizado exitosamente' : 'Registro completado exitosamente',
        isNewUser: resultado.isNew || false
      };
      
    } catch (error) {
      console.error('❌ Error completando registro:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // Función para verificar estado del registro
  async verificarEstadoRegistro() {
    console.log('🔍 VERIFICANDO ESTADO DEL REGISTRO...');
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user) {
        return {
          estado: 'sin_oauth',
          mensaje: 'No hay sesión OAuth activa',
          requiereAccion: 'Iniciar OAuth'
        };
      }
      
      const user = session.session.user;
      
      // Verificar si existe en BD
      const { data: usuarioBD, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (usuarioBD) {
        return {
          estado: 'completo',
          usuario: usuarioBD,
          mensaje: 'Usuario registrado completamente',
          requiereAccion: 'Ninguna'
        };
      } else {
        return {
          estado: 'oauth_incompleto',
          usuarioOAuth: user,
          mensaje: 'OAuth exitoso, falta completar perfil',
          requiereAccion: 'Completar formulario de registro'
        };
      }
      
    } catch (error) {
      console.error('❌ Error verificando estado:', error);
      return {
        estado: 'error',
        mensaje: error.message,
        requiereAccion: 'Reintentar'
      };
    }
  },
  
  // Función para test completo del flujo
  async testearFlujoCompleto() {
    console.log('🧪 TESTEANDO FLUJO COMPLETO...');
    
    const estado = await this.verificarEstadoRegistro();
    console.log('📊 Estado actual:', estado);
    
    return estado;
  }
};

export default flujoCompletoRegistro;