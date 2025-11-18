import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { getConfig } from '../config/environment.js';

const gold = '#FFD700';

export default function LoginRegisterFormClean() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [categoria, setCategoria] = useState('infantil_femenina');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [lang, setLang] = useState('es');

  const navigate = useNavigate();
  const config = getConfig();

  // Traducciones
  const I18N = {
    es: {
      title: 'FutPro',
      createAccount: 'Crea tu cuenta',
      signIn: 'Inicia sesión',
      continueGoogle: 'Continuar con Google',
      orEmail: 'o con email',
      emailPlaceholder: 'Correo',
      passwordPlaceholder: 'Contraseña',
      processing: 'Procesando...',
      createBtn: 'Crear cuenta',
      signInBtn: 'Ingresar',
      hasAccount: '¿Ya tienes cuenta? Inicia sesión',
      noAccount: '¿No tienes cuenta? Regístrate',
      loginSuccess: 'Inicio de sesión exitoso. Redirigiendo...',
      signupSuccess: 'Registro iniciado. Revisa tu correo para confirmar y se creó un borrador de tu CarFutPro.',
      signupSuccess2: 'Ingreso exitoso. Redirigiendo...',
      errorWith: 'Error con',
      infantil_femenina: 'Infantil Femenina',
      infantil_masculina: 'Infantil Masculina',
      femenina: 'Femenina',
      masculina: 'Masculina'
    },
    en: {
      title: 'FutPro',
      createAccount: 'Create your account',
      signIn: 'Sign in',
      continueGoogle: 'Continue with Google',
      orEmail: 'or with email',
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Password',
      processing: 'Processing...',
      createBtn: 'Create account',
      signInBtn: 'Sign in',
      hasAccount: 'Already have an account? Sign in',
      noAccount: "Don't have an account? Sign up",
      loginSuccess: 'Sign in successful. Redirecting...',
      signupSuccess: 'Registration started. Check your email to confirm and a draft of your CarFutPro was created.',
      signupSuccess2: 'Sign in successful. Redirecting...',
      errorWith: 'Error with',
      infantil_femenina: 'Girls U18',
      infantil_masculina: 'Boys U18',
      femenina: 'Women',
      masculina: 'Men'
    },
    pt: {
      title: 'FutPro',
      createAccount: 'Crie sua conta',
      signIn: 'Entrar',
      continueGoogle: 'Continuar com Google',
      orEmail: 'ou com e-mail',
      emailPlaceholder: 'E-mail',
      passwordPlaceholder: 'Senha',
      processing: 'Processando...',
      createBtn: 'Criar conta',
      signInBtn: 'Entrar',
      hasAccount: 'Já tem uma conta? Entre',
      noAccount: 'Não tem uma conta? Cadastre-se',
      loginSuccess: 'Login bem-sucedido. Redirecionando...',
      signupSuccess: 'Cadastro iniciado. Verifique seu e-mail para confirmar e um rascunho do seu CarFutPro foi criado.',
      signupSuccess2: 'Login bem-sucedido. Redirecionando...',
      errorWith: 'Erro com',
      infantil_femenina: 'Infantil Feminino',
      infantil_masculina: 'Infantil Masculino',
      femenina: 'Feminino',
      masculina: 'Masculino'
    }
  };

  const t = (key) => (I18N[lang] && I18N[lang][key]) || I18N.es[key] || key;

  // Auto-detectar idioma
  useEffect(() => {
    try {
      const nav = (navigator.language || 'es').toLowerCase();
      if (nav.startsWith('es')) setLang('es');
      else if (nav.startsWith('pt')) setLang('pt');
      else setLang('en');
    } catch (_) {
      setLang('es');
    }
  }, []);

  const goHome = () => {
    // Redirigir a home después del login exitoso
    try { navigate('/home'); } catch (_) { window.location.href = '/home'; }
  };

  // NO verificar sesión al cargar - dejar que el usuario vea el login
  // La redirección solo ocurre después de un login activo
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // Solo redirigir en SIGNED_IN (login activo), no en INITIAL_SESSION
      if (event === 'SIGNED_IN' && session?.user) { 
        setSuccess(t('loginSuccess')); 
        setLoading(false); 
        setTimeout(goHome, 600); 
      }
    });
    return () => authListener?.subscription?.unsubscribe?.();
  }, [lang]);

  const handleLoginSocial = async (provider) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Iniciar OAuth directamente con Google
      console.log(`🔐 [LOGIN] Iniciando OAuth con ${provider}...`);
      console.log('📍 Redirect URL:', `${window.location.origin}/auth/callback`);
      console.log('🌐 Supabase URL:', config.supabaseUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false
        }
      });

      if (error) {
        console.error('❌ Error OAuth:', error);
        throw error;
      }

      console.log('✅ OAuth iniciado correctamente:', data);
      // La navegación a Google ocurre automáticamente
      // No se necesita código adicional aquí
      
    } catch (e) {
      console.error('❌ Error completo OAuth:', e);
      setLoading(false);
      
      let errorMsg = `Error al iniciar sesión con ${provider}`;
      if (e?.message) {
        errorMsg += `: ${e.message}`;
      }
      
      setError(errorMsg);
    }
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
        setSuccess(t('signupSuccess'));
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
        setSuccess(t('signupSuccess2'));
        setTimeout(goHome, 600);
      }
    } catch (e) { setError(e.message || 'Ocurrió un error'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top,#1a1a1a,#050505)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      {/* Barra de navegación SOLO visible DESPUÉS del login - NO antes */}
      {/* La navegación se muestra en homepage-instagram.html después de autenticarse */}
      
      {/* Contenedor del formulario */}
      <div style={{ width: '100%', maxWidth: 440, background: 'linear-gradient(165deg,#121212,#0b0b0b 60%)', border: `2px solid ${gold}`, borderRadius: 20, padding: 24, boxShadow: '0 12px 38px #000c, inset 0 0 0 1px #333' }}>
        <h1 style={{ color: gold, margin: 0, marginBottom: 8, textAlign: 'center' }}>{t('title')}</h1>
        <p style={{ color: '#bbb', marginTop: 0, textAlign: 'center' }}>{isRegister ? t('createAccount') : t('signIn')}</p>

        {error && (<div style={{ background: '#3b0d0d', color: '#ff9b9b', border: '1px solid #ff4d4f', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>{error}</div>)}
        {success && (<div style={{ background: '#0e3323', color: '#9ff2c3', border: '1px solid #27d17c', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>{success}</div>)}

        <div style={{ display: 'grid', gap: 10 }}>
          <button onClick={() => handleLoginSocial('google')} disabled={loading} style={{ width: '100%', padding: 12, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>{t('continueGoogle')}</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#333' }} />
          <span style={{ color: '#999', fontSize: 12 }}>{t('orEmail')}</span>
          <div style={{ flex: 1, height: 1, background: '#333' }} />
        </div>

        <form onSubmit={handleSubmitEmail} style={{ display: 'grid', gap: 12 }}>
          <input type="email" required placeholder={t('emailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 12, background: '#1c1c1c', color: '#eee', border: '1px solid #333', borderRadius: 10 }}/>
          <input type="password" required placeholder={t('passwordPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 12, background: '#1c1c1c', color: '#eee', border: '1px solid #333', borderRadius: 10 }}/>
          {isRegister && (
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required style={{ width: '100%', padding: 12, background: '#1c1c1c', color: '#eee', border: '1px solid #333', borderRadius: 10 }}>
              <option value="infantil_femenina">{t('infantil_femenina')}</option>
              <option value="infantil_masculina">{t('infantil_masculina')}</option>
              <option value="femenina">{t('femenina')}</option>
              <option value="masculina">{t('masculina')}</option>
            </select>
          )}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 14, background: isRegister ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#111', border: 'none', borderRadius: 12, fontWeight: 800, letterSpacing: '.5px', cursor: 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 14px rgba(0,0,0,.5)' }}>{loading ? t('processing') : (isRegister ? t('createBtn') : t('signInBtn'))}</button>
        </form>

        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <button onClick={() => {
            if (isRegister) {
              // Si está en registro, volver a login
              setIsRegister(false);
            } else {
              // Si está en login, ir a seleccionar categoría
              navigate('/seleccionar-categoria');
            }
          }} style={{ background: 'transparent', color: gold, border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}>
            {isRegister ? t('hasAccount') : t('noAccount')}
          </button>
        </div>
      </div>
    </div>
  );
}
