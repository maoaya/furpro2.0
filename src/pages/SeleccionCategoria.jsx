import React, { useState, useEffect } from 'react';
import {
  handleSelect as stubHandleSelect,
  handleConfirm as stubHandleConfirm,
  handleGoogleLogin as stubHandleGoogleLogin
} from '../stubs/seleccionCategoriaFunctions';
import {
  handleSelect,
  handleConfirm,
  handleGoogleLogin
} from '../stubs/seleccionCategoriaFunctions';
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

  // --- STUB: Selección de categoría ---
  const handleSelect = (value) => {
    setSelected(value);
    stubHandleSelect(value);
    console.log('[INTEGRACIÓN STUB] handleSelect ejecutado', value);
  };

  // --- STUB: Confirmar selección ---
  const handleConfirm = () => {
    if (!selected) return;
    setConfirming(true);
    stubHandleConfirm(selected, navigate);
    console.log('[INTEGRACIÓN STUB] handleConfirm ejecutado', selected);
    setTimeout(() => setConfirming(false), 500); // Simula feedback visual
  };

  return (
    <div style={{ padding: 24, maxWidth: 500, margin: 'auto', fontFamily: 'Arial, sans-serif', color: '#fff' }}>
      <div>
        <h1 style={{ marginBottom: 8, fontSize: 28, fontWeight: 800 }}>{t('title')}</h1>
        <p style={{ color: '#aaa', marginBottom: 24 }}>{t('subtitle')}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {categorias.map((c) => {
            const isActive = selected === c.value;
            return (
              <button
                key={c.value}
                onClick={() => handleSelect(c.value)}
                style={{
                  padding: 16,
                  background: isActive ? '#FFD700' : '#222',
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

        {/* Botón Google eliminado. El flujo OAuth solo va al final del formulario de registro. */}

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', color: '#FFD700', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
            {t('back')}
          </button>
        </div>
      </div>
    </div>
  );
}
