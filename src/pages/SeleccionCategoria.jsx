import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { getConfig } from '../config/environment.js';

export default function SeleccionCategoria() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('es');
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const config = getConfig();

  // Traducciones
  const I18N = {
    es: {
      title: 'Selecciona tu categoría',
      subtitle: 'Usaremos esta información para crear tu perfil, tu card y activar el autoguardado.',
      back: 'Volver',
      infantil_femenina: 'Infantil Femenina',
      infantil_masculina: 'Infantil Masculina',
      femenina: 'Femenina',
      masculina: 'Masculina'
    },
    en: {
      title: 'Select your category',
      subtitle: 'We will use this information to create your profile, card and enable auto-save.',
      back: 'Back',
      infantil_femenina: 'Girls U18',
      infantil_masculina: 'Boys U18',
      femenina: 'Women',
      masculina: 'Men'
    },
    pt: {
      title: 'Selecione sua categoria',
      subtitle: 'Usaremos esta informação para criar seu perfil, card e ativar o salvamento automático.',
      back: 'Voltar',
      infantil_femenina: 'Infantil Feminino',
      infantil_masculina: 'Infantil Masculino',
      femenina: 'Feminino',
      masculina: 'Masculino'
    }
  };

  const t = (key) => (I18N[lang] && I18N[lang][key]) || I18N.es[key] || key;

  const categorias = [
    { value: 'infantil_femenina', label: t('infantil_femenina') },
    { value: 'infantil_masculina', label: t('infantil_masculina') },
    { value: 'femenina', label: t('femenina') },
    { value: 'masculina', label: t('masculina') },
  ];

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

  const handleSelect = (value) => {
    setSelected(value);
  };

  const handleConfirm = () => {
    if (!selected) return;
    try {
      setConfirming(true);
      // Pre-semilla en localStorage para el formulario (compatibilidad con lector draft_carfutpro)
      localStorage.setItem('draft_carfutpro', JSON.stringify({ categoria: selected, ts: Date.now() }));
      console.log('✅ Draft categoría guardado:', selected);
    } catch (e) {
      console.warn('No se pudo guardar draft categoria', e);
    }
    const target = `/formulario-registro?categoria=${encodeURIComponent(selected)}`;
    console.log('➡️ [SeleccionCategoria] Navegando a formulario de registro:', target, 'categoría:', selected);
    
    try {
      navigate(target, { state: { categoria: selected }, replace: true });
      console.log('🔄 React Router navigate() llamado');
      
      // Verificar navegación efectiva y aplicar fallback si no cambió pathname
      setTimeout(() => {
        if (window.location.pathname.indexOf('/formulario-registro') !== 0) {
          console.warn('⚠️ React Router no aplicó la navegación (pathname no cambió), usando window.location');
          try {
            window.location.assign(target);
          } catch (_) {
            window.location.href = target;
          }
        } else {
          console.log('✅ Navegación confirmada a:', window.location.pathname);
        }
      }, 500);
    } catch (navErr) {
      console.warn('❌ Error en navigate(), usando fallback window.location:', navErr);
      try {
        window.location.assign(target);
      } catch (_) {
        window.location.href = target;
      }
    }
  };

  const handleGoogleLogin = async () => {
    if (!selected) return;
    try {
      setGoogleLoading(true);
      // Guardar categoría seleccionada para el callback
      localStorage.setItem('selected_categoria', selected);
      localStorage.setItem('draft_carfutpro', JSON.stringify({ categoria: selected, ts: Date.now() }));
      
      console.log('🔐 [SeleccionCategoria] Iniciando OAuth con Google, categoría:', selected);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false
        }
      });

      if (error) {
        console.error('❌ Error OAuth:', error);
        throw error;
      }

      console.log('✅ OAuth con Google iniciado correctamente');
    } catch (e) {
      console.error('❌ Error en login con Google:', e);
      setGoogleLoading(false);
      alert('Error al iniciar sesión con Google. Inténtalo de nuevo.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 520, background: '#121212', border: '2px solid #FFD700', borderRadius: 16, padding: 20 }}>
        <h1 style={{ color: '#FFD700', margin: 0, marginBottom: 8, textAlign: 'center' }}>{t('title')}</h1>
        <p style={{ color: '#bbb', marginTop: 0, textAlign: 'center' }}>{t('subtitle')}</p>

        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          {categorias.map((c) => {
            const isActive = selected === c.value;
            return (
              <button
                key={c.value}
                onClick={() => handleSelect(c.value)}
                style={{
                  width: '100%',
                  padding: 14,
                  background: isActive ? 'linear-gradient(135deg,#FFD700,#c49c00)' : 'linear-gradient(135deg,#2a2a2a,#1a1a1a)',
                  color: isActive ? '#000' : '#eee',
                  border: isActive ? '2px solid #FFD700' : '1px solid #333',
                  borderRadius: 10,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 0 12px rgba(255,215,0,0.5)' : 'none',
                  transition: 'all .25s'
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button
            onClick={handleConfirm}
            disabled={!selected || confirming}
            style={{
              width: '100%',
              padding: 16,
              background: selected ? '#FFD700' : '#333',
              color: selected ? '#000' : '#777',
              fontWeight: 800,
              border: 'none',
              borderRadius: 12,
              cursor: selected ? 'pointer' : 'not-allowed',
              opacity: confirming ? .7 : 1,
              transition: 'background .3s'
            }}
          >
            {selected ? 'Crear usuario con categoría seleccionada' : 'Selecciona una categoría'}
          </button>
        </div>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button
            onClick={handleGoogleLogin}
            disabled={!selected || googleLoading}
            style={{
              width: '100%',
              padding: 16,
              background: selected ? 'linear-gradient(135deg,#4285f4,#34a853)' : '#333',
              color: '#fff',
              fontWeight: 800,
              border: 'none',
              borderRadius: 12,
              cursor: selected ? 'pointer' : 'not-allowed',
              opacity: googleLoading ? .7 : 1,
              transition: 'background .3s'
            }}
          >
            {googleLoading ? 'Conectando con Google...' : (selected ? 'Continuar con Google' : 'Selecciona categoría primero')}
          </button>
        </div>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', color: '#FFD700', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
            {t('back')}
          </button>
        </div>
      </div>
    </div>
  );
}
