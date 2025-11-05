import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SeleccionCategoria() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('es');

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
    // Redirige al formulario completo con la categoría seleccionada
    navigate(`/formulario-registro?categoria=${encodeURIComponent(value)}`, {
      state: { categoria: value }
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 520, background: '#121212', border: '2px solid #FFD700', borderRadius: 16, padding: 20 }}>
        <h1 style={{ color: '#FFD700', margin: 0, marginBottom: 8, textAlign: 'center' }}>{t('title')}</h1>
        <p style={{ color: '#bbb', marginTop: 0, textAlign: 'center' }}>{t('subtitle')}</p>

        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          {categorias.map((c) => (
            <button
              key={c.value}
              onClick={() => handleSelect(c.value)}
              style={{
                width: '100%',
                padding: 14,
                background: 'linear-gradient(135deg,#2a2a2a,#1a1a1a)',
                color: '#eee',
                border: '1px solid #333',
                borderRadius: 10,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {c.label}
            </button>
          ))}
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
