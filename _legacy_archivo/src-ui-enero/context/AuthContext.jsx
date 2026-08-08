import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../lib/supabase.js';
import { detectSupabaseOnline } from '../config/supabase.js';
import { getConfig } from '../config/environment.js';

// ===== UTILIDADES DE EDAD =====
function calculateAge(birthDate) {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Verificar si el usuario cumple años hoy
function isBirthdayToday(birthDate) {
  if (!birthDate) return false;
  const today = new Date();
  const birth = new Date(birthDate);
  return today.getMonth() === birth.getMonth() && today.getDate() === birth.getDate();
}

// Carga perezosa del tracking para evitar efectos secundarios durante el render
let trackingInitializer = null;
const ensureTracking = async () => {
  if (trackingInitializer) return trackingInitializer;
  try {
    // Intentar wrapper primero
    const mod = await import('../trackingInit.js');
    trackingInitializer = mod?.default || null;
    if (!trackingInitializer?.initialize) {
      // Intentar inicializador directo
      const mod2 = await import('../services/TrackingInitializer.js');
      trackingInitializer = mod2?.default || null;
    }
    // Inicializar de manera segura si existe método
    try { await trackingInitializer?.initialize?.(); } catch {}
  } catch (e) {
    console.warn('⚠️ No se pudo cargar tracking en AuthContext:', e?.message);
  }
  return trackingInitializer;
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('guest');
  const [equipoId, setEquipoId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      try {
        console.log('🔄 AuthContext: Inicializando autenticación...');
        // Verificar conectividad con Supabase para evitar bucles de errores si hay problemas de DNS/red
        const online = await detectSupabaseOnline().catch(() => false);
        if (!online) {
          console.warn('⚠️ Supabase no alcanzable. Entrando en modo invitado.');
          setUser(null);
          setRole('guest');
          setEquipoId(null);
          setUserProfile(null);
          setError('Servicio de autenticación no disponible en este momento.');
          setLoading(false);
          return; // No llamar a supabase.auth.* si no está accesible
        }
        
        // Verificar localStorage primero para indicaciones de auth exitosa
        const authCompleted = localStorage.getItem('authCompleted') === 'true';
        const loginSuccess = localStorage.getItem('loginSuccess') === 'true';
        const userSession = localStorage.getItem('session');
        
        if (authCompleted || loginSuccess || userSession) {
          console.log('📝 Indicadores de auth encontrados en localStorage:', {
            authCompleted, loginSuccess, hasSession: !!userSession
          });
        }
        
        // Intentar obtener sesión actual de Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error obteniendo sesión:', error);
        }
        
        if (session && session.user) {
          console.log('✅ Sesión encontrada:', session.user.email);
          setUser(session.user);
          
          // 🔥 ESTABLECER USUARIO EN TRACKING SYSTEM
          try {
            const tr = await ensureTracking();
            tr?.setUser?.(session.user);
          } catch {}
          
          // Establecer indicadores si no están presentes
          if (!authCompleted) {
            localStorage.setItem('authCompleted', 'true');
            localStorage.setItem('loginSuccess', 'true');
            localStorage.setItem('userEmail', session.user.email);
            localStorage.setItem('userId', session.user.id);
          }
          
          // Obtener rol y equipoId desde la base de datos
          // Cargar perfil desde tabla principal api.carfutpro usando user_id
          const { data: userData, error: userError } = await supabase
            .from('carfutpro')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
            
          if (userData) {
            setRole(userData.rol || 'player');
            setEquipoId(userData.equipoId || null);
            
            // ===== AUTO-ACTUALIZAR EDAD =====
            let updatedUserData = { ...userData };
            if (userData.fecha_nacimiento) {
              const calculatedAge = calculateAge(userData.fecha_nacimiento);
              const currentStoredAge = userData.edad;
              
              // Si la edad calculada es diferente a la almacenada (cumpleaños), actualizar
              if (calculatedAge !== currentStoredAge) {
                console.log(`🎂 Detectado cumpleaños: edad actual ${calculatedAge} (antes era ${currentStoredAge})`);
                
                const { data: updateData, error: updateError } = await supabase
                  .from('carfutpro')
                  .update({ 
                    edad: calculatedAge,
                    updated_at: new Date().toISOString()
                  })
                  .eq('user_id', session.user.id)
                  .select()
                  .single();
                
                if (updateError) {
                  console.warn('⚠️ Error actualizando edad:', updateError);
                } else {
                  updatedUserData = updateData || updatedUserData;
                  console.log('✅ Edad actualizada automáticamente');
                }
              }
            }
            
            setUserProfile(updatedUserData);
            console.log('✅ Perfil de usuario cargado:', updatedUserData.nombre);
          } else {
            console.log('⚠️ No se encontró perfil de usuario, creando registro básico...');
            // Crear registro mínimo del usuario para garantizar presencia en DB
            const { error: insertBasicError } = await supabase
              .from('carfutpro')
              .insert([
                {
                  user_id: session.user.id,
                  email: session.user.email,
                  nombre: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Jugador',
                  rol: 'player',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ]);

            if (insertBasicError) {
              console.warn('⚠️ No se pudo crear registro básico del usuario:', insertBasicError?.message);
              setRole('player');
              setEquipoId(null);
              setUserProfile(null);
            } else {
              console.log('✅ Registro básico de usuario creado');
              setRole('player');
              setEquipoId(null);
              setUserProfile({ id: session.user.id, email: session.user.email, nombre: session.user.email?.split('@')[0], rol: 'player' });
            }
          }
          
          // Guardar en localStorage para persistencia
          try {
            localStorage.setItem('session', JSON.stringify(session.user));
            localStorage.setItem('authCompleted', 'true');
            localStorage.setItem('loginSuccess', 'true');
            localStorage.setItem('userEmail', session.user.email);
            localStorage.setItem('userId', session.user.id);
            console.log('✅ Sesión guardada en localStorage');
          } catch (storageErr) {
            console.warn('⚠️ Error guardando sesión en localStorage:', storageErr);
          }
          
        } else if (authCompleted || loginSuccess) {
          // Hay indicadores de auth pero no sesión - intentar refresh
          console.log('🔄 Indicadores de auth sin sesión, intentando refresh...');
          
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshData.session?.user) {
            console.log('✅ Sesión recuperada tras refresh:', refreshData.session.user.email);
            setUser(refreshData.session.user);
            localStorage.setItem('session', JSON.stringify(refreshData.session.user));
          } else {
            console.log('❌ No se pudo recuperar sesión tras refresh');
            // Mantener loading más tiempo para dar chance a auth state change
            setTimeout(() => {
              const stillNoUser = !localStorage.getItem('session');
              if (stillNoUser) {
                console.log('⏱️ Timeout: limpiando indicadores de auth sin sesión válida');
                localStorage.removeItem('authCompleted');
                localStorage.removeItem('loginSuccess');
              }
            }, 5000);
          }
          
        } else {
          // No hay sesión activa ni indicadores
          console.log('❌ No hay sesión activa');
          setUser(null);
          setRole('guest');
          setEquipoId(null);
          setUserProfile(null);
          localStorage.removeItem('session');
          localStorage.removeItem('authCompleted');
        }
      } catch (error) {
        console.error('❌ Error al inicializar autenticación:', error);
        setError(error.message);
      }
      
      setLoading(false);
    };

    initAuth();

    // Escuchar cambios en el estado de autenticación (solo si hay conectividad)
    let subscription;
    if (typeof window === 'undefined' || window.__SUPABASE_ONLINE__ !== false) {
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
  console.log('🔄 Cambio en autenticación:', event, session?.user?.email);
        
        if (session && session.user) {
          setUser(session.user);
          
          // 🔥 ESTABLECER USUARIO EN TRACKING SYSTEM
          try {
            const tr = await ensureTracking();
            tr?.setUser?.(session.user);
          } catch {}
          
          // Obtener datos del usuario
          const { data: userData } = await supabase
            .from('carfutpro')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
            
          if (userData) {
            setRole(userData.rol || 'player');
            setEquipoId(userData.equipoId || null);
            setUserProfile(userData);
            console.log('✅ Perfil actualizado desde AuthStateChange:', userData.nombre);
          } else {
            // Si no hay datos del usuario, verificar si hay datos pendientes del perfil
            const pendingData = localStorage.getItem('pendingProfileData');
            if (pendingData) {
              try {
                const profileData = JSON.parse(pendingData);
                // Crear el perfil del usuario con los datos pendientes
                // Mapear sólo las columnas existentes en tabla usuarios para evitar 400/406
                // Solo columnas existentes en tabla usuarios para evitar 400/406
                const payload = {
                  id: session.user.id,
                  email: session.user.email,
                  nombre: profileData.nombre,
                  apellido: profileData.apellido || '',
                  telefono: profileData.telefono || '',
                  pais: profileData.pais || null,
                  edad: profileData.edad ?? null,
                  peso: profileData.peso ?? null,
                  altura: profileData.altura ?? null,
                  posicion_favorita: profileData.posicion || null,
                  nivel_habilidad: profileData.experiencia || null,
                  equipo_favorito: profileData.equipoFavorito || null,
                  pierna_dominante: profileData.piernaDominante || profileData.pierna_dominante || null,
                  disponibilidad_juego: profileData.disponibilidad || null,
                  avatar_url: profileData.avatar_url || null,
                  updated_at: new Date().toISOString()
                };

                const { error: insertError } = await supabase
                  .from('carfutpro')
                  .insert([payload])
                  .select();

                if (insertError) {
                  console.error('❌ Error insertando perfil pendiente (detalle):', insertError);
                }

                if (!insertError) {
                  setRole(profileData.rol || 'player');
                  setEquipoId(null);
                  setUserProfile({ ...profileData, id: session.user.id, email: session.user.email });
                  localStorage.removeItem('pendingProfileData');
                  console.log('✅ Perfil creado desde datos pendientes del registro completo');
                  
                  // Marcar como usuario completado desde registro OAuth
                  localStorage.setItem('userRegistrado', JSON.stringify({
                    id: session.user.id,
                    nombre: profileData.nombre,
                    email: session.user.email,
                    registrado: true,
                    fromCompleteRegistration: true
                  }));
                } else {
                  console.error('❌ Error insertando perfil pendiente:', insertError);
                }
              } catch (error) {
                console.error('Error al crear perfil desde datos pendientes:', error);
              }
            }
            
            if (!userData && !localStorage.getItem('pendingProfileData')) {
              setRole('player');
              setEquipoId(null);
              setUserProfile(null);
            }
          }
          
          localStorage.setItem('session', JSON.stringify(session.user));
        } else {
          setUser(null);
          setRole('guest');
          setEquipoId(null);
          setUserProfile(null);
          localStorage.removeItem('session');
        }
      }
    );
      subscription = sub;
    }

    return () => subscription?.unsubscribe?.();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
    
    if (data.user) {
      setUser(data.user);
      
      // 🔥 ESTABLECER USUARIO EN TRACKING SYSTEM
      try {
        const tr = await ensureTracking();
        tr?.setUser?.(data.user);
      } catch {}
      
      // Obtener datos completos del usuario
      const { data: userData } = await supabase
        .from('carfutpro')
        .select('*')
        .eq('user_id', data.user.id)
        .single();
        
      if (userData) {
        setRole(userData.rol || 'usuario');
        setEquipoId(userData.equipoId || null);
        setUserProfile(userData);
        console.log('✅ Usuario logueado con perfil completo:', userData.nombre);
      } else {
        setRole('usuario');
        setEquipoId(null);
        setUserProfile(null);
        console.log('⚠️ Usuario logueado sin perfil en BD');
      }
      
      // Guardar sesión en localStorage
      localStorage.setItem('session', JSON.stringify(data.user));
      localStorage.setItem('userLoggedIn', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        timestamp: new Date().toISOString()
      }));
    }
    
    setLoading(false);
    return { success: true, user: data.user };
  };

  const completeUserProfile = async (profileData) => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('carfutpro')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        setError(error.message);
        setLoading(false);
        return false;
      }

      if (data) {
        setUserProfile(data);
        setRole(data.rol || 'player');
        setEquipoId(data.equipoId || null);
      }

      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Error al actualizar perfil');
      setLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const config = getConfig();
      const callbackUrl = config.oauthCallbackUrl;
      
      console.log('🚀 DIAGNÓSTICO GOOGLE OAUTH:');
      console.log('- Callback URL:', callbackUrl);
      console.log('- Supabase URL:', config.supabaseUrl);
      console.log('- Entorno:', config.isProduction ? 'Producción' : 'Desarrollo');
      console.log('- Hostname:', window.location.hostname);
      console.log('🌍 Configuración completa:', config);
      
      console.log('🔑 Llamando a signInWithOAuth...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('❌ ERROR ESPECÍFICO EN GOOGLE OAUTH:');
        console.error('- Mensaje:', error.message);
        console.error('- Código:', error.status);
        console.error('- Error completo:', error);
        
        if (error.message.includes('403') || error.message.includes('forbidden')) {
          console.error('🚨 ERROR 403 - CONFIGURACIÓN OAUTH:');
          const supabaseCallback = `${config.supabaseUrl}/auth/v1/callback`;
          console.error(`Google: agrega http://localhost:5174 y http://localhost:5173 en Authorized JavaScript origins, y ${supabaseCallback} en Authorized redirect URIs.`);
          console.error('Supabase: Allowed Redirect URLs debe incluir:');
          console.error('- http://localhost:5174/auth/callback');
          console.error('- http://localhost:5173/auth/callback');
          console.error('- https://futpro.vip/auth/callback');
        }
        
        setError(error.message);
        setLoading(false);
        return { error: error.message };
      }

      // Si Supabase devuelve una URL de redirección, forzarla manualmente
      if (data?.url) {
        console.log('🌐 Forzando redirección manual a Google:', data.url);
        window.location.href = data.url;
        return { redirecting: true };
      }

      console.log('✅ Redirección a Google iniciada (sin URL explícita)');
      // Para OAuth, el flujo continúa en la página de callback
      return { redirecting: true };
    } catch (err) {
      console.error('💥 Error inesperado en Google OAuth:', err);
      setError(err.message || 'Error con Google');
      setLoading(false);
      return { error: err.message || 'Error con Google' };
    }
  };

  const loginWithFacebook = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const config = getConfig();
      const callbackUrl = config.oauthCallbackUrl;
      
      console.log('🚀 Iniciando Facebook OAuth con callback:', callbackUrl);
      console.log('🌍 Configuración:', config);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          queryParams: {
            scope: 'email,public_profile'
          }
        }
      });

      if (error) {
        console.error('❌ Error en Facebook OAuth:', error);
        setError(error.message);
        setLoading(false);
        return { error: error.message };
      }

      console.log('✅ Redirección a Facebook iniciada');
      // Para OAuth, el flujo continúa en la página de callback
      return { redirecting: true };
    } catch (err) {
      console.error('💥 Error inesperado en Facebook OAuth:', err);
      setError(err.message || 'Error con Facebook');
      setLoading(false);
      return { error: err.message || 'Error con Facebook' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole('guest');
    setEquipoId(null);
    setUserProfile(null);
    localStorage.removeItem('session');
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return { error: error.message };
      }

      return {
        success: true,
        message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña.'
      };
    } catch (error) {
      console.error('Error enviando email de recuperación:', error);
      return { error: error.message || 'Error al enviar email' };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      equipoId, 
      userProfile,
      loading, 
      error, 
      login,
      loginWithGoogle,
      loginWithFacebook,
      logout,
      completeUserProfile,
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};