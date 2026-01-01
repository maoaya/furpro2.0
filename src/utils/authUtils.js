import { supabase } from '../lib/supabase';

/**
 * Función robusta de signup que maneja errores 502
 * Implementa múltiples estrategias de fallback
 */
export const robustSignUp = async (email, password, additionalData = {}) => {
    console.log('🚀 Iniciando signup robusto para:', email);
    
    const maxRetries = 3;
    const retryDelay = 2000; // 2 segundos
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(`🔄 Intento ${attempt}/${maxRetries} de signup`);
        
        try {
            // Estrategia 1: Signup estándar
            const signUpOptions = {
                email: email.toLowerCase().trim(),
                password: password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    shouldCreateUser: true,
                    data: {
                        nombre: additionalData.nombre || '',
                        apellido: additionalData.apellido || '',
                        created_via: 'futpro-web'
                    }
                }
            };

            const { data: authData, error: authError } = await supabase.auth.signUp(signUpOptions);

            if (!authError && authData.user) {
                console.log(`✅ Signup exitoso en intento ${attempt}`);
                return { success: true, data: authData, method: 'signup', attempt };
            }

            // Manejo específico de errores
            if (authError) {
              console.warn(`⚠️ Error en intento ${attempt}:`, authError.message);

              // Fallback vía función Netlify (signup-proxy)
              try {
                const resp = await fetch('/.netlify/functions/signup-proxy', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    email,
                    password,
                    metadata: {
                      nombre: additionalData.nombre || '',
                      apellido: additionalData.apellido || ''
                    }
                  })
                });
                const json = await resp.json();
                if (resp.ok && json?.data?.user) {
                  console.log('✅ Signup vía Netlify Function exitoso');
                  return { success: true, data: json.data, method: 'netlify-signup', attempt };
                } else {
                  console.warn('⚠️ Fallback Netlify signup falló:', json?.error || json);
                }
              } catch (fnErr) {
                console.warn('⚠️ Error llamando a función Netlify signup:', fnErr.message);
              }

              // Error 502 específico
              if (authError.message?.includes('502') || 
                  authError.message?.includes('bypass') ||
                  authError.message?.includes('Bad Gateway')) {
                    
                    console.log('🔄 Error 502 detectado, probando estrategia alternativa...');
                    
                    // Estrategia 2: Verificar si usuario ya existe e intentar login
                    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                        email: email.toLowerCase().trim(),
                        password: password
                    });

                    if (!loginError && loginData.user) {
                        console.log(`✅ Usuario ya existía - Login exitoso en intento ${attempt}`);
                        return { 
                            success: true, 
                            data: loginData, 
                            method: 'existing-user-login', 
                            attempt,
                            message: 'Usuario ya registrado - sesión iniciada exitosamente'
                        };
                    }
                    
                    // Estrategia 3: Signup sin confirmación de email
                    if (attempt === maxRetries) {
                        console.log('🔄 Intentando signup sin confirmación de email...');
                        
                        const { data: simpleSignup, error: simpleError } = await supabase.auth.signUp({
                            email: email.toLowerCase().trim(),
                            password: password
                        });
                        
                        if (!simpleError && simpleSignup.user) {
                            console.log('✅ Signup simple exitoso');
                            return { 
                                success: true, 
                                data: simpleSignup, 
                                method: 'simple-signup', 
                                attempt,
                                message: 'Registro completado con método alternativo'
                            };
                        }
                    }
                }

                // Usuario ya registrado
                if (authError.message?.includes('already registered') || 
                    authError.message?.includes('already been registered')) {
                    
                    console.log('🔄 Usuario ya registrado, intentando login...');
                    
                    const { data: existingLoginData, error: existingLoginError } = await supabase.auth.signInWithPassword({
                        email: email.toLowerCase().trim(),
                        password: password
                    });

                    if (!existingLoginError && existingLoginData.user) {
                        console.log('✅ Login exitoso para usuario existente');
                        return { 
                            success: true, 
                            data: existingLoginData, 
                            method: 'existing-user-login', 
                            attempt,
                            message: 'Usuario ya registrado - sesión iniciada'
                        };
                    } else {
                        return { 
                            success: false, 
                            error: 'Usuario ya registrado pero la contraseña es incorrecta',
                            attempt 
                        };
                    }
                }

                // Si no es el último intento, esperar antes de reintentar
                if (attempt < maxRetries) {
                    console.log(`⏳ Esperando ${retryDelay}ms antes del siguiente intento...`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    continue;
                }

                // Último intento fallido
                return { 
                    success: false, 
                    error: authError.message, 
                    attempt,
                    originalError: authError
                };
            }

        } catch (networkError) {
            console.error(`💥 Error de red en intento ${attempt}:`, networkError);
            
            if (attempt < maxRetries) {
                console.log(`⏳ Reintentando después de error de red...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                continue;
            }
            
            return { 
                success: false, 
                error: `Error de red: ${networkError.message}`, 
                attempt,
                originalError: networkError
            };
        }
    }

    return { 
        success: false, 
        error: 'Todos los intentos de registro fallaron', 
        attempt: maxRetries
    };
};

/**
 * Función robusta de login
 */
export const robustSignIn = async (email, password) => {
  console.log('🔐 Iniciando login robusto para:', email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: password
    });

    if (error) {
      // Fallback vía función Netlify (signin-proxy)
      try {
        const resp = await fetch('/.netlify/functions/signin-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const json = await resp.json();
        if (resp.ok && json?.data?.user) {
          console.log('✅ Login vía Netlify Function exitoso');
          return { success: true, data: json.data, method: 'netlify-signin' };
        }
      } catch (fnErr) {
        console.warn('⚠️ Error llamando a función Netlify signin:', fnErr.message);
      }

      return { success: false, error: error.message };
    }

    if (data.user) {
      console.log('✅ Login exitoso');
      return { success: true, data, method: 'password-login' };
    }

    return { success: false, error: 'No se recibieron datos del usuario' };
  } catch (networkError) {
    console.error('💥 Error de red en login:', networkError);
    return { success: false, error: `Error de red: ${networkError.message}` };
  }
};

/**
 * Crear perfil de usuario con reintentos
 */
export const createUserProfile = async (userData) => {
    console.log('👤 Creando perfil de usuario:', userData.id);
    
    const maxRetries = 3;
    const retryDelay = 1000;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const profileData = {
                id: userData.id,
                email: userData.email,
                nombre: userData.nombre || 'Usuario',
                apellido: userData.apellido || '',
                rol: 'usuario',
                tipo_usuario: 'jugador',
                estado: 'activo',
                posicion: 'Por definir',
                frecuencia_juego: 1,
                pais: 'España',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('usuarios')
                .insert([profileData])
                .select();

            if (!error) {
                console.log(`✅ Perfil creado exitosamente en intento ${attempt}`);
                return { success: true, data };
            }

            console.warn(`⚠️ Error creando perfil en intento ${attempt}:`, error.message);
            
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                continue;
            }

            return { success: false, error: error.message };

        } catch (networkError) {
            console.error(`💥 Error de red creando perfil en intento ${attempt}:`, networkError);
            
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                continue;
            }
            
            return { success: false, error: `Error de red: ${networkError.message}` };
        }
    }
};

export default {
    robustSignUp,
    robustSignIn,
    createUserProfile
};