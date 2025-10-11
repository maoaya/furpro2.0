import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../supabaseClient';
import { getConfig } from '../config/environment.js';
import trackingInitializer from '../services/TrackingInitializer.js';

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
          trackingInitializer.setUser(session.user);
          
          // Establecer indicadores si no están presentes
          if (!authCompleted) {
            localStorage.setItem('authCompleted', 'true');
            localStorage.setItem('loginSuccess', 'true');
            localStorage.setItem('userEmail', session.user.email);
            localStorage.setItem('userId', session.user.id);
          }
          
          // Obtener rol y equipoId desde la base de datos
          const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (userData) {
            setRole(userData.rol || 'player');
            setEquipoId(userData.equipoId || null);
            setUserProfile(userData);
            console.log('✅ Perfil de usuario cargado:', userData.nombre);
          } else {
            console.log('⚠️ No se encontró perfil de usuario, estableciendo valores por defecto');
            setRole('player');
            setEquipoId(null);
            setUserProfile(null);
          }
          
          // Guardar en localStorage
          localStorage.setItem('session', JSON.stringify(session.user));
          localStorage.setItem('authCompleted', 'true');
          
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

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Cambio en autenticación:', event, session?.user?.email);
        
        if (session && session.user) {
          setUser(session.user);
          
          // 🔥 ESTABLECER USUARIO EN TRACKING SYSTEM
          trackingInitializer.setUser(session.user);
          
          // Obtener datos del usuario
          const { data: userData } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', session.user.id)
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
                const { error: insertError } = await supabase
                  .from('usuarios')
                  .insert([
                    {
                      id: session.user.id,
                      email: session.user.email,
                      ...profileData,
                      updated_at: new Date().toISOString()
                    }
                  ]);

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

    return () => subscription.unsubscribe();
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
      trackingInitializer.setUser(data.user);
      
      // Obtener datos completos del usuario
      const { data: userData } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', data.user.id)
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
        .from('usuarios')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
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

      console.log('✅ Redirección a Google iniciada');
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
          redirectTo: callbackUrl,
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
      completeUserProfile 
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