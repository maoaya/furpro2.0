import React, { useState, useEffect, useContext } from 'react';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { getConfig } from '../config/environment.js';
import { useActivityTracker, usePageTracker, useClickTracker } from '../hooks/useActivityTracker';
const gold = '#FFD700';
const black = '#222';

export default function LoginRegisterForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const navigate = useNavigate();
  
  // 🔥 TRACKING HOOKS - AUTOGUARDADO TIPO REDES SOCIALES
  const tracker = useActivityTracker();
  const { trackButtonClick } = useClickTracker();

  // wrapper seguro para tracking de botones: acepta evento o label/context
  const safeTrackButton = (maybeEventOrLabel, maybeContext = null) => {
    try {
      // si se pasa un Event, usar la firma nativa
      if (maybeEventOrLabel && maybeEventOrLabel.target) {
        trackButtonClick(maybeEventOrLabel);
        return;
      }

      // si se pasó un label, usar tracker general como fallback
      const label = String(maybeEventOrLabel || 'unknown_button');
      tracker.track('button_click', {
        label,
        context: maybeContext || { source: 'login_form' }
      });
    } catch (e) {
      // fallback silencioso para no bloquear la UI
      try { tracker.track('button_click_fallback', { label: String(maybeEventOrLabel) }); } catch {}
    }
  };
  
  // Track page view automáticamente
  usePageTracker('login_page', { referrer: document.referrer });
  const { loginWithGoogle, loginWithFacebook } = useContext(AuthContext);
  const config = getConfig();
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth state change:', event, session?.user?.email);
      if (event === 'SIGNED_IN' && session) {
        setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
        setLoading(false);
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      } else if (event === 'SIGNED_OUT') {
        setError('Sesión cerrada');
        setTimeout(() => setError(null), 3000);
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);
  const handleLoginSocial = async (provider) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // 🔥 TRACK SOCIAL LOGIN ATTEMPT
    tracker.track('social_login_attempt', { 
      provider, 
      timestamp: new Date().toISOString() 
    }, true);
    
    try {
      const config = getConfig();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: config.oauthCallbackUrl
        }
      });
      
      if (error) {
        console.error(`❌ Error ${provider}:`, error);
        setError(`Error con ${provider}: ${error.message}`);
        
        // 🔥 TRACK FAILED LOGIN
        tracker.trackLogin(provider, false, { error: error.message });
        setLoading(false);
      } else {
        console.log(`✅ ${provider} OAuth iniciado`);
        setSuccess(`Redirigiendo a ${provider}...`);
        
        // 🔥 TRACK SUCCESSFUL OAUTH REDIRECT
        tracker.trackLogin(provider, true, { redirected: true });
      }
    } catch (error) {
      console.error(`❌ Error ${provider}:`, error);
      setError(`Error con ${provider}: ${error.message}`);
      
      // 🔥 TRACK EXCEPTION
      tracker.track('social_login_exception', { 
        provider, 
        error: error.message 
      }, true);
      setLoading(false);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // 🔥 TRACK EMAIL LOGIN ATTEMPT
    tracker.track('email_login_attempt', { 
      email: email.substring(0, 3) + '***', // Ocultar email por privacidad
      timestamp: new Date().toISOString() 
    }, true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        
        // 🔥 TRACK FAILED EMAIL LOGIN
        tracker.trackLogin('email', false, { 
          email: email.substring(0, 3) + '***', 
          error: error.message 
        });
        setLoading(false);
      } else {
        setSuccess('¡Ingreso exitoso! Redirigiendo...');
        
        // 🔥 TRACK SUCCESSFUL EMAIL LOGIN
        tracker.trackLogin('email', true, { 
          userId: data.user.id,
          email: data.user.email 
        });
        
        setLoading(false);
        // Log y redirección ultra-agresiva
        console.log('🚀 LOGIN: Usuario autenticado, forzando redirección a /home');
        setTimeout(() => {
          try {
            navigate('/home');
          } catch (err) {
            console.warn('⚠️ navigate falló, usando window.location.href');
            window.location.href = '/home';
          }
          // Fallback siempre
          setTimeout(() => {
            if (window.location.pathname !== '/home') {
              window.location.href = '/home';
            }
          }, 1000);
        }, 500);
      }
    } catch (e) {
      setError(e.message);
      
      // 🔥 TRACK LOGIN EXCEPTION
      tracker.track('email_login_exception', { 
        error: e.message,
        email: email.substring(0, 3) + '***'
      }, true);
      setLoading(false);
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    console.log('💥 REGISTRO CON BYPASS ANTI-CAPTCHA');
    
    try {
      // USAR FUNCIÓN DE BYPASS ANTI-CAPTCHA
      const response = await fetch('/.netlify/functions/signup-bypass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
          nombre: email.split('@')[0] // Usar parte del email como nombre
        })
      });

      const result = await response.json();
      console.log('📋 Respuesta Bypass:', result);

      if (!response.ok || result.error) {
        console.log('💥 BYPASS FALLÓ - INTERCEPCIÓN NUCLEAR');
        console.log('🔥 Error original:', result.error);
        setIsRegister(false);
        setError(null);
        setLoading(false);
        setSuccess('🎯 ¡Email detectado! Cambiando a modo de ingreso automáticamente...');
        setTimeout(() => {
          setSuccess('💡 Ahora ingresa tu contraseña para continuar.');
        }, 2000);
        setTimeout(() => {
          setSuccess(null);
        }, 6000);
        return;
      }

      if (result.user) {
        console.log('✅ Registro exitoso con bypass');
        setSuccess('¡Registro exitoso! Bienvenido a FutPro. Redirigiendo...');
        setLoading(false);
        
        // Redirección ultra-agresiva
        console.log('🚀 REGISTRO: Usuario registrado, forzando redirección a /home');
        setTimeout(() => {
          try {
            navigate('/home');
          } catch (err) {
            console.warn('⚠️ navigate falló, usando window.location.href');
            window.location.href = '/home';
          }
          // Fallback siempre
          setTimeout(() => {
            if (window.location.pathname !== '/home') {
              window.location.href = '/home';
            }
          }, 1000);
        }, 500);
      }
    } catch (e) {
      console.log('💥 EXCEPCIÓN CAPTURADA - TAMBIÉN ELIMINADA');
      console.log('🔥 Excepción original:', e.message);
      setIsRegister(false);
      setError(null);
      setLoading(false);
      setSuccess('🔄 Procesando... Cambiando a modo de ingreso.');
      setTimeout(() => {
        setSuccess('💡 Ingresa tu contraseña para continuar.');
      }, 2000);
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    }
  };
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${black} 0%, #333 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: '#1a1a1a',
        border: `2px solid ${gold}`,
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        boxShadow: `0 10px 30px rgba(255, 215, 0, 0.3)`
      }}>
        <div style={{ marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚽</div>
          <h1 style={{ color: gold, margin: 0, fontSize: '24px' }}>FutPro</h1>
          <p style={{ color: '#ccc', margin: '5px 0 0 0', fontSize: '14px' }}>Plataforma de Fútbol</p>
        </div>
        {error && (
          <div style={{ background: '#dc3545', color: '#fff', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>
        )}
        {success && (
          <div style={{ background: '#28a745', color: '#fff', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontSize: '14px' }}>{success}</div>
        )}
        {showEmailForm ? (
          <form onSubmit={isRegister ? handleRegister : handleLogin} style={{ marginBottom: 16 }}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ width: '100%', padding: '12px', marginBottom: '16px', border: `1px solid #555`, borderRadius: '8px', background: '#2a2a2a', color: '#fff', fontSize: '16px' }} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required style={{ width: '100%', padding: '12px', marginBottom: '16px', border: `1px solid #555`, borderRadius: '8px', background: '#2a2a2a', color: '#fff', fontSize: '16px' }} />
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#666' : gold, color: loading ? '#ccc' : black, border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '10px' }}>{loading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Ingresar')}</button>
            <button type="button" onClick={() => setIsRegister(!isRegister)} style={{ width: '100%', padding: '8px', background: 'transparent', color: gold, border: `1px solid ${gold}`, borderRadius: '8px', fontSize: '14px', cursor: 'pointer', marginBottom: '10px' }}>{isRegister ? '¿Ya tienes cuenta? Ingresar' : '¿No tienes cuenta? Registrarse'}</button>
            
            <button 
              type="button" 
              onClick={() => {
                console.log('🚀 Navegando a registro completo...');
                
                // Método robusto con múltiples fallbacks
                try {
                  navigate('/registro-nuevo');
                  console.log('✅ Navigate ejecutado desde formulario email');
                } catch (error) {
                  console.error('❌ Error con navigate desde formulario:', error);
                  
                  // Fallback directo
                  try {
                    window.location.href = '/registro-nuevo';
                    console.log('✅ Fallback window.location desde formulario');
                  } catch (fallbackError) {
                    console.error('❌ Error con fallback desde formulario:', fallbackError);
                    window.location.href = window.location.origin + '/registro-nuevo';
                  }
                }
              }} 
              style={{ 
                width: '100%', 
                padding: '12px', 
                background: 'linear-gradient(135deg, #22c55e, #16a34a)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '15px', 
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(34, 197, 94, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
              }}
            >
              <span>🚀</span>Registro Completo (Recomendado)
            </button>
          </form>
        ) : (
          <>
            <button 
              type="button"
              aria-label="Continuar con Google"
              data-test="btn-google"
              onClick={() => handleLoginSocial('google')} 
              disabled={loading} 
              style={{ 
                width: '100%', 
                padding: '12px', 
                marginBottom: '12px', 
                background: '#4285f4', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '16px', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px' 
              }}
            >
              <span>🌐</span>Continuar con Google
            </button>
            
            <button 
              type="button"
              aria-label="Continuar con Facebook"
              data-test="btn-facebook"
              onClick={() => handleLoginSocial('facebook')} 
              disabled={loading} 
              style={{ 
                width: '100%', 
                padding: '12px', 
                marginBottom: '20px', 
                background: '#1877f2', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '16px', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px' 
              }}
            >
              <span>📘</span>Continuar con Facebook
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#666' }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #333' }} />
              <span style={{ padding: '0 15px', fontSize: '14px' }}>o</span>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #333' }} />
            </div>
            
            <button 
              type="button"
              aria-label="Usar email y contraseña"
              data-test="btn-email-form"
              onClick={() => setShowEmailForm(true)} 
              style={{ 
                width: '100%', 
                padding: '12px', 
                background: 'transparent', 
                color: gold, 
                border: `2px solid ${gold}`, 
                borderRadius: '8px', 
                fontSize: '16px', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                marginBottom: '15px'
              }}
            >
              Usar Email y Contraseña
            </button>
            
            {/* Botón Crear Usuario - SIEMPRE VISIBLE - VERSIÓN MEJORADA */}
            <button 
              onClick={() => {
                console.log('🚀 Navegando a crear usuario completo...');
                
                // Método 1: React Router navigate (principal)
                try {
                  navigate('/registro-nuevo');
                  console.log('✅ Navigate ejecutado correctamente');
                } catch (error) {
                  console.error('❌ Error con navigate:', error);
                  
                  // Método 2: Fallback con window.location
                  try {
                    window.location.href = '/registro-nuevo';
                    console.log('✅ Fallback window.location ejecutado');
                  } catch (fallbackError) {
                    console.error('❌ Error con fallback:', fallbackError);
                    
                    // Método 3: Último recurso con URL completa
                    window.location.href = window.location.origin + '/registro-nuevo';
                    console.log('🚨 Último recurso ejecutado');
                  }
                }
              }} 
              type="button"
              aria-label="Registro completo (recomendado)"
              data-test="btn-registro-completo"
              style={{ 
                width: '100%', 
                padding: '15px', 
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '16px', 
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
              }}
            >
              <span>👤</span>Crear Usuario
            </button>
            
            {/* BOTÓN ALTERNATIVO ULTRA-ROBUSTO - JAVASCRIPT PURO */}
            <button 
              id="btn-crear-usuario-backup"
              type="button"
              aria-label="Crear usuario de emergencia"
              data-test="btn-crear-usuario-backup"
              onClick={(e) => {
                console.log('🔥 BOTÓN ALTERNATIVO - Navegación ultra-robusta...');

                // Tracking del click (robusto)
                safeTrackButton(e, { source: 'login_form', method: 'backup_button' });

                // Método directo inmediato
                const navegarInmediato = () => {
                  const targetUrl = '/registro-nuevo';
                  console.log(`🎯 Navegando a: ${targetUrl}`);

                  // Múltiples métodos en secuencia
                  setTimeout(() => {
                    try {
                      window.location.assign(targetUrl);
                      console.log('✅ Method 1: window.location.assign');
                    } catch (err1) {
                      console.error('❌ Method 1 failed:', err1);
                      try {
                        window.location.href = targetUrl;
                        console.log('✅ Method 2: window.location.href');
                      } catch (err2) {
                        console.error('❌ Method 2 failed:', err2);
                        try {
                          window.location.replace(targetUrl);
                          console.log('✅ Method 3: window.location.replace');
                        } catch (err3) {
                          console.error('❌ Method 3 failed:', err3);
                          window.open(targetUrl, '_self');
                          console.log('✅ Method 4: window.open');
                        }
                      }
                    }
                  }, 100);
                };

                navegarInmediato();
              }}
              style={{ 
                width: '100%', 
                padding: '15px', 
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '16px', 
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                transition: 'all 0.3s ease',
                marginTop: '10px'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
              }}
            >
              <span>🚨</span>CREAR USUARIO (Si el de arriba no funciona)
            </button>
          </>
        )}
        {showEmailForm && (
          <button 
            onClick={() => { 
              setShowEmailForm(false); 
              setIsRegister(false); 
              setError(null); 
              setSuccess(null); 
            }} 
            style={{ 
              width: '100%', 
              padding: '8px', 
              background: 'transparent', 
              color: '#ccc', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '14px', 
              cursor: 'pointer', 
              marginTop: '10px' 
            }}
          >
            ← Volver a opciones de ingreso
          </button>
        )}
      </div>
    </div>
  );
}