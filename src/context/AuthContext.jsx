import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../supabaseClient';
import { getConfig } from '../config/environment.js';

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
      
      // Intentar obtener sesión actual de Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session && session.user) {
        setUser(session.user);
        
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
        } else {
          setRole('player');
          setEquipoId(null);
          setUserProfile(null);
        }
        
        // Guardar en localStorage
        localStorage.setItem('session', JSON.stringify(session.user));
      } else {
        // No hay sesión activa
        setUser(null);
        setRole('guest');
        setEquipoId(null);
        localStorage.removeItem('session');
      }
      
      setLoading(false);
    };

    initAuth();

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          setUser(session.user);
          
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
                  console.log('✅ Perfil creado desde datos pendientes');
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
      return false;
    }
    
    if (data.user) {
      setUser(data.user);
      
      // Obtener datos completos del usuario
      const { data: userData } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (userData) {
        setRole(userData.rol || 'player');
        setEquipoId(userData.equipoId || null);
        setUserProfile(userData);
      } else {
        setRole('player');
        setEquipoId(null);
        setUserProfile(null);
      }
      
      // Guardar sesión en localStorage
      localStorage.setItem('session', JSON.stringify(data.user));
    }
    
    setLoading(false);
    return true;
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
      console.log('- Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
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
          console.error('🚨 ERROR 403 - CONFIGURACIÓN DE SUPABASE:');
          console.error('1. Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/url-configuration');
          console.error('2. Site URL: http://localhost:3000');
          console.error('3. Redirect URLs: http://localhost:3000/auth/callback');
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