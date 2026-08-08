import React, { useState } from 'react';
import { supabase } from '../config/supabase.js';
import CondicionesUsoPanel from './CondicionesUsoPanel.jsx';

export default function AgregarUsuarioButton() {
  const [showPanel, setShowPanel] = useState(false);
  const [usuarioCreado, setUsuarioCreado] = useState(false);
  const DEFAULT_ROLE = 'integrado'; // Rol unificado por solicitud: el usuario puede hacer todo

  const handleCrearUsuario = async () => {
    setUsuarioCreado(false);
    setShowPanel(false);
    // Lógica real de creación de usuario en Supabase
    const email = prompt('Introduce el email del nuevo usuario:');
    const nombre = prompt('Introduce el nombre del nuevo usuario:');
    if (!email || !nombre) {
      alert('Email y nombre requeridos');
      return;
    }
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ email, nombre, user_type: DEFAULT_ROLE }])
      .select()
      .single();
    if (error) {
      alert('Error al crear usuario: ' + error.message);
    } else {
      setUsuarioCreado(true);
      alert('Usuario creado exitosamente: ' + data.email);
    }
  };

  return (
    <div>
      {/* UI de rol desactivada: los usuarios son "integrado" y no necesitan cambiar rol */}

      {/* Botón para mostrar el panel de condiciones */}
      {!showPanel && !usuarioCreado && (
        <button
          style={{
            background: '#FFD700',
            color: '#111',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 2rem',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            marginTop: '1rem'
          }}
          onClick={() => setShowPanel(true)}
        >
          Crear usuario
        </button>
      )}

      {/* Panel de condiciones de uso */}
      {showPanel && !usuarioCreado && (
        <CondicionesUsoPanel
          onAccept={() => {
            handleCrearUsuario();
            setShowPanel(false);
          }}
          onClose={() => setShowPanel(false)}
        />
      )}

      {/* Mensaje de éxito */}
      {usuarioCreado && (
        <div style={{ color: '#FFD700', marginTop: '1rem', fontWeight: 'bold' }}>
          ¡Usuario creado exitosamente!
        </div>
      )}
    </div>
  );
}