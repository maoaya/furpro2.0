import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { getConfig } from '../config/environment.js';

const gold = '#FFD700';

export default function LoginRegisterForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [categoria, setCategoria] = useState('infantil_femenina');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isRegister, setIsRegister] = useState(false);

  const navigate = useNavigate();
  const config = getConfig();

  const goHome = () => {
    try { navigate('/homepage-instagram.html'); } catch (_) { window.location.href = '/homepage-instagram.html'; }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data?.session?.user) goHome(); });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setSuccess('Inicio de sesión exitoso. Redirigiendo...'); setLoading(false); setTimeout(goHome, 600); }
    });
    return () => authListener?.subscription?.unsubscribe?.();
  }, []);

  const handleLoginSocial = async (provider) => {
    try {
      setLoading(true); setError(null); setSuccess(null);
      await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: config.oauthCallbackUrl } });
    } catch (e) { setLoading(false); setError(`Error con ${provider}: ${e.message}`); }
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setError(null); setSuccess(null);
      if (isRegister) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        try {
          const draft = { email, categoria, creadaEn: new Date().toISOString(), estado: 'pendiente_confirmacion' };
          localStorage.setItem('draft_carfutpro', JSON.stringify(draft));
          try {
            const { database } = await import('../config/firebase.js');
            const { ref, set } = await import('firebase/database');
            const uid = signUpData?.user?.id || 'pending';
            await set(ref(database, `autosave/carfutpro/${uid}`), draft);
          } catch (_) {}
        } catch (aux) { console.warn('Autosave inicial falló (no crítico):', aux); }
        setSuccess('Registro iniciado. Revisa tu correo para confirmar y se creó un borrador de tu CarFutPro.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        try {
          const { data: sessionRes } = await supabase.auth.getSession();
          const userId = sessionRes?.session?.user?.id;
          if (userId) {
            const draftRaw = localStorage.getItem('draft_carfutpro');
            const draft = draftRaw ? JSON.parse(draftRaw) : null;
            const categoriaFinal = draft?.categoria || categoria;
            try {
              const { supabase: sb } = await import('../supabaseClient.js');
              const { data, error } = await sb
                .from('carfutpro')
                .insert([{ user_id: userId, categoria: categoriaFinal, creada_en: new Date().toISOString(), estado: 'activa' }])
                .select()
                .single();
              if (error) throw error;
              try {
                const { database } = await import('../config/firebase.js');
                const { ref, set } = await import('firebase/database');
                await set(ref(database, `carfutpro/${userId}`), data);
                await set(ref(database, `autosave/carfutpro/${userId}`), null);
              } catch (_) {}
            } catch (eCreate) { console.warn('Creación de CarFutPro en Supabase falló (continuando):', eCreate.message); }
          }
        } catch (aux) { console.warn('No se pudo completar creación inicial de CarFutPro:', aux); }
        setSuccess('Ingreso exitoso. Redirigiendo...');
        setTimeout(goHome, 600);
      }
    } catch (e) { setError(e.message || 'Ocurrió un error'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#121212', border: `2px solid ${gold}`, borderRadius: 16, padding: 20, boxShadow: '0 10px 30px #000a' }}>
        <h1 style={{ color: gold, margin: 0, marginBottom: 8, textAlign: 'center' }}>FutPro</h1>
        <p style={{ color: '#bbb', marginTop: 0, textAlign: 'center' }}>{isRegister ? 'Crea tu cuenta' : 'Inicia sesión'}</p>

        {error && (<div style={{ background: '#3b0d0d', color: '#ff9b9b', border: '1px solid #ff4d4f', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>{error}</div>)}
        {success && (<div style={{ background: '#0e3323', color: '#9ff2c3', border: '1px solid #27d17c', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>{success}</div>)}

        <div style={{ display: 'grid', gap: 10 }}>
          <button onClick={() => handleLoginSocial('google')} disabled={loading} style={{ width: '100%', padding: 12, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>Continuar con Google</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#333' }} />
          <span style={{ color: '#999', fontSize: 12 }}>o con email</span>
          <div style={{ flex: 1, height: 1, background: '#333' }} />
        </div>

        <form onSubmit={handleSubmitEmail} style={{ display: 'grid', gap: 10 }}>
          <input type="email" required placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 12, background: '#1c1c1c', color: '#eee', border: '1px solid #333', borderRadius: 10 }}/>
          <input type="password" required placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 12, background: '#1c1c1c', color: '#eee', border: '1px solid #333', borderRadius: 10 }}/>
          {isRegister && (
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required style={{ width: '100%', padding: 12, background: '#1c1c1c', color: '#eee', border: '1px solid #333', borderRadius: 10 }}>
              <option value="infantil_femenina">Infantil Femenina</option>
              <option value="infantil_masculina">Infantil Masculina</option>
              <option value="femenina">Femenina</option>
              <option value="masculina">Masculina</option>
            </select>
          )}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, background: isRegister ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#111', border: 'none', borderRadius: 10, fontWeight: 800, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>{loading ? 'Procesando...' : (isRegister ? 'Crear cuenta' : 'Ingresar')}</button>
        </form>

        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'transparent', color: gold, border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
}

          <p style={{ color: '#ccc', margin: '5px 0 0 0', fontSize: '14px' }}>Plataforma de Fútbol</p>          password,

        </div>          nombre: email.split('@')[0] // Usar parte del email como nombre

        })

        {/* Mensajes */}      });

        {error && (

          <div style={{ background: '#dc3545', color: '#fff', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontSize: '14px' }}>      const result = await response.json();

            {error}      console.log('📋 Respuesta Bypass:', result);

          </div>

        )}      if (!response.ok || result.error) {

        {success && (        console.log('💥 BYPASS FALLÓ - INTERCEPCIÓN NUCLEAR');

          <div style={{ background: '#28a745', color: '#fff', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontSize: '14px' }}>        console.log('🔥 Error original:', result.error);

            {success}        setIsRegister(false);

          </div>        setError(null);

        )}        setLoading(false);

        setSuccess('🎯 ¡Email detectado! Cambiando a modo de ingreso automáticamente...');        

        {showEmailForm ? (        setTimeout(() => {

          <>          setSuccess('💡 Ahora ingresa tu contraseña para continuar.');

            {/* Formulario Email/Password */}        }, 2000);

            <form onSubmit={isRegister ? handleRegister : handleLogin} style={{ marginBottom: 16 }}>        setTimeout(() => {

              <input          setSuccess(null);

                type="email"        }, 6000);

                value={email}        return;

                onChange={(e) => setEmail(e.target.value)}      }

                placeholder="Email"

                required      if (result.user) {

                style={{         console.log('✅ Registro exitoso con bypass');

                  width: '100%',         setSuccess('¡Registro exitoso! Bienvenido a FutPro. Redirigiendo...');

                  padding: '12px',         setLoading(false);

                  marginBottom: '16px', 

                  border: '1px solid #555',         // Redirección ultra-agresiva

                  borderRadius: '8px',         console.log('🚀 REGISTRO: Usuario registrado, forzando redirección a /home');

                  background: '#2a2a2a',         setTimeout(() => {

                  color: '#fff',           try {

                  fontSize: '16px',            navigate('/home');

                  boxSizing: 'border-box'          } catch (err) {

                }}            console.warn('⚠️ navigate falló, usando window.location.href');

              />            window.location.href = '/home';

              <input          }

                type="password"          // Fallback siempre

                value={password}          setTimeout(() => {

                onChange={(e) => setPassword(e.target.value)}            if (window.location.pathname !== '/home') {

                placeholder="Contraseña"              window.location.href = '/home';

                required            }

                style={{           }, 1000);

                  width: '100%',         }, 500);

                  padding: '12px',       }

                  marginBottom: '16px',     } catch (e) {

                  border: '1px solid #555',       console.log('💥 EXCEPCIÓN CAPTURADA - TAMBIÉN ELIMINADA');

                  borderRadius: '8px',       console.log('🔥 Excepción original:', e.message);

                  background: '#2a2a2a',       setIsRegister(false);

                  color: '#fff',       setError(null);

                  fontSize: '16px',      setLoading(false);

                  boxSizing: 'border-box'      setSuccess('🔄 Procesando... Cambiando a modo de ingreso.');

                }}      setTimeout(() => {

              />        setSuccess('💡 Ingresa tu contraseña para continuar.');

              <button       }, 2000);

                type="submit"       setTimeout(() => {

                disabled={loading}         setSuccess(null);

                style={{       }, 5000);

                  width: '100%',     }

                  padding: '12px',   };

                  background: loading ? '#666' : gold,   return (

                  color: loading ? '#ccc' : black,     <div style={{

                  border: 'none',       minHeight: '100vh',

                  borderRadius: '8px',       background: `linear-gradient(135deg, ${black} 0%, #333 100%)`,

                  fontSize: '16px',       display: 'flex',

                  fontWeight: 'bold',       alignItems: 'center',

                  cursor: loading ? 'not-allowed' : 'pointer',       justifyContent: 'center',

                  marginBottom: '10px'       fontFamily: 'Arial, sans-serif'

                }}    }}>

              >      <div style={{

                {loading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Ingresar')}        background: '#1a1a1a',

              </button>        border: `2px solid ${gold}`,

                      borderRadius: '20px',

              <button         padding: '40px',

                type="button"         maxWidth: '400px',

                onClick={() => setIsRegister(!isRegister)}         width: '100%',

                style={{         textAlign: 'center',

                  width: '100%',         boxShadow: `0 10px 30px rgba(255, 215, 0, 0.3)`

                  padding: '8px',       }}>

                  background: 'transparent',         <div style={{ marginBottom: '30px' }}>

                  color: gold,           <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚽</div>

                  border: `1px solid ${gold}`,           <h1 style={{ color: gold, margin: 0, fontSize: '24px' }}>FutPro</h1>

                  borderRadius: '8px',           <p style={{ color: '#ccc', margin: '5px 0 0 0', fontSize: '14px' }}>Plataforma de Fútbol

                  fontSize: '14px', </p>

                  cursor: 'pointer',         </div>

                  marginBottom: '10px'         {error && (

                }}          <div style={{ background: '#dc3545', color: '#fff', padding: '10px', borderRadius: '5px'

              >, marginBottom: '20px', fontSize: '14px' }}>{error}</div>

                {isRegister ? '¿Ya tienes cuenta? Ingresar' : '¿No tienes cuenta? Registrarse'}        )}

              </button>        {success && (

          <div style={{ background: '#28a745', color: '#fff', padding: '10px', borderRadius: '5px'

              <button, marginBottom: '20px', fontSize: '14px' }}>{success}</div>

                type="button"        )}

                onClick={() => navigate('/registro-nuevo')}        {showEmailForm ? (

                style={{          <form onSubmit={isRegister ? handleRegister : handleLogin} style={{ marginBottom: 16 }}>

                  width: '100%',            <input

                  padding: '12px',              type="email"

                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',              value={email}

                  color: 'white',              onChange={(e) => setEmail(e.target.value)}

                  border: 'none',              placeholder="Email"

                  borderRadius: '8px',              required

                  fontSize: '15px',              style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #555', borderRadius: '8px', background: '#2a2a2a', color: '#fff', fontSize: '16px' }}

                  cursor: 'pointer',            />

                  fontWeight: 'bold',            <input

                  display: 'flex',              type="password"

                  alignItems: 'center',              value={password}

                  justifyContent: 'center',              onChange={(e) => setPassword(e.target.value)}

                  gap: '10px'              placeholder="Contraseña"

                }}              required

              >              style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #555', borderRadius: '8px', background: '#2a2a2a', color: '#fff', fontSize: '16px' }}

                <span>🚀</span>Registro Completo            />

              </button>            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#666' : gold, color: loading ? '#ccc' : black, border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '10px' }}>{loading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Ingresar')}</button>    

            </form>            <button type="button" onClick={() => setIsRegister(!isRegister)} style={{ width: '100%', padding: '8px', background: 'transparent', color: gold, border: `1px solid ${gold}`, borderRadius: '8px', fontSize: '14px', cursor: 'pointer', marginBottom: '10px' }}>{isRegister ? '¿Ya tienes cuenta? Ingresar' : '¿No tienes cuenta? Registrarse'}</button>



            <button            <button

              onClick={() => {              type="button"

                setShowEmailForm(false);              onClick={() => {

                setIsRegister(false);                console.log('🚀 Navegando a registro completo...');

                setError(null);

                setSuccess(null);                // Método robusto con múltiples fallbacks

              }}                try {

              style={{                  navigate('/registro-nuevo');

                width: '100%',                  console.log('✅ Navigate ejecutado desde formulario email');

                padding: '8px',                } catch (error) {

                background: 'transparent',                  console.error('❌ Error con navigate desde formulario:', error);

                color: '#ccc',

                border: 'none',                  // Fallback directo

                borderRadius: '8px',                  try {

                fontSize: '14px',                    window.location.href = '/registro-nuevo';

                cursor: 'pointer'                    console.log('✅ Fallback window.location desde formulario');

              }}                  } catch (fallbackError) {

            >                    console.error('❌ Error con fallback desde formulario:', fallbackError);      

              ← Volver 

            </button>                    window.location.href = window.location.origin + '/registro-nuevo';

          </>                  }

        ) : (                }

          <>              }}

            {/* Botones Social */}              style={{

            <button                width: '100%',

              onClick={() => handleLoginSocial('google')}                padding: '12px',

              disabled={loading}                background: 'linear-gradient(135deg, #22c55e, #16a34a)',

              style={{                color: 'white',

                width: '100%',                border: 'none',

                padding: '12px',                borderRadius: '8px',

                marginBottom: '12px',                fontSize: '15px',

                background: '#4285f4',                cursor: 'pointer',

                color: '#fff',                fontWeight: 'bold',

                border: 'none',                display: 'flex',

                borderRadius: '8px',                alignItems: 'center',

                fontSize: '16px',                justifyContent: 'center',

                cursor: loading ? 'not-allowed' : 'pointer',                gap: '10px',

                display: 'flex',                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',

                alignItems: 'center',                transition: 'all 0.3s ease'

                justifyContent: 'center',              }}

                gap: '10px'              onMouseOver={(e) => {

              }}                e.target.style.transform = 'translateY(-2px)';

            >                e.target.style.boxShadow = '0 6px 16px rgba(34, 197, 94, 0.6)';

              <span>🌐</span>Continuar con Google              }}

            </button>              onMouseOut={(e) => {

                e.target.style.transform = 'translateY(0)';

            <button                e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';

              onClick={() => handleLoginSocial('facebook')}              }}

              disabled={loading}            >

              style={{              <span>🚀</span>Registro Completo (Recomendado)

                width: '100%',            </button>

                padding: '12px',          </form>

                marginBottom: '20px',        ) : (

                background: '#1877f2',          <>

                color: '#fff',            <button

                border: 'none',              onClick={() => handleLoginSocial('google')}

                borderRadius: '8px',              disabled={loading}

                fontSize: '16px',              style={{

                cursor: loading ? 'not-allowed' : 'pointer',                width: '100%',

                display: 'flex',                padding: '12px',

                alignItems: 'center',                marginBottom: '12px',

                justifyContent: 'center',                background: '#4285f4',

                gap: '10px'                color: '#fff',

              }}                border: 'none',

            >                borderRadius: '8px',

              <span>📘</span>Continuar con Facebook                fontSize: '16px',

            </button>                cursor: loading ? 'not-allowed' : 'pointer',

                display: 'flex',

            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#666' }}>                alignItems: 'center',

              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #333' }} />                justifyContent: 'center',

              <span style={{ padding: '0 15px', fontSize: '14px' }}>o</span>                gap: '10px'

              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #333' }} />              }}

            </div>            >

              <span>🌐</span>Continuar con Google

            <button            </button>

              onClick={() => setShowEmailForm(true)}

              style={{            <button

                width: '100%',              onClick={() => handleLoginSocial('facebook')}

                padding: '12px',              disabled={loading}

                background: 'transparent',              style={{

                color: gold,                width: '100%',

                border: `2px solid ${gold}`,                padding: '12px',

                borderRadius: '8px',                marginBottom: '20px',

                fontSize: '16px',                background: '#1877f2',

                cursor: 'pointer',                color: '#fff',

                fontWeight: 'bold',                border: 'none',

                marginBottom: '15px'                borderRadius: '8px',

              }}                fontSize: '16px',

            >                cursor: loading ? 'not-allowed' : 'pointer',

              Usar Email y Contraseña                display: 'flex',

            </button>                alignItems: 'center',

                justifyContent: 'center',

            <button                gap: '10px'

              onClick={() => navigate('/registro-nuevo')}              }}

              style={{            >

                width: '100%',              <span>📘</span>Continuar con Facebook

                padding: '15px',            </button>

                background: '#dc2626',

                color: 'white',            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#666' }

                border: 'none',}>

                borderRadius: '12px',              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #333' }} />

                fontSize: '16px',              <span style={{ padding: '0 15px', fontSize: '14px' }}>o</span>

                cursor: 'pointer',              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #333' }} />

                fontWeight: 'bold',            </div>

                display: 'flex',

                alignItems: 'center',            <button

                justifyContent: 'center',              onClick={() => setShowEmailForm(true)}

                gap: '10px'              style={{

              }}                width: '100%',

            >                padding: '12px',

              <span>🔥</span>IR A REGISTRO                background: 'transparent',

            </button>                color: gold,

          </>                border: `2px solid ${gold}`,

        )}                borderRadius: '8px',

      </div>                fontSize: '16px',

    </div>                cursor: 'pointer',

  );                fontWeight: 'bold',

}                marginBottom: '15px'

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
              onClick={() => {
                console.log('🔥 BOTÓN ALTERNATIVO - Navegación ultra-robusta...');

                // Tracking del click
                try {
                  trackButtonClick('crear_usuario_backup', { source: 'login_form', method: 'backup_button' });
                } catch (trackError) {
                  console.warn('⚠️ Error en tracking:', trackError);
                }

                // Método directo inmediato
                const navegarInmediato = () => {
                  const targetUrl = '/registro-nuevo';
                  console.log(`🎯 Navegando a: ${targetUrl}`);

                  // Múltiples métodos en secuencia
                  setTimeout(() => {
                    try {
                      window.location.assign(targetUrl);
                      console.log('✅ Method 1: window.location.assign');
                    } catch (e) {
                      console.error('❌ Method 1 failed:', e);
                      try {
                        window.location.href = targetUrl;
                        console.log('✅ Method 2: window.location.href');
                      } catch (e2) {
                        console.error('❌ Method 2 failed:', e2);
                        try {
                          window.location.replace(targetUrl);
                          console.log('✅ Method 3: window.location.replace');
                        } catch (e3) {
                          console.error('❌ Method 3 failed:', e3);
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