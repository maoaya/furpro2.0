import React, { useState } from 'react';
import { supabase } from '../config/supabase.js';
import CondicionesUsoPanel from './CondicionesUsoPanel.jsx';

export default function AgregarUsuarioButton({ userId }) {
  const [role, setRole] = useState('player');
  const [showPanel, setShowPanel] = useState(false);
  const [usuarioCreado, setUsuarioCreado] = useState(false);

  const cambiarRol = async () => {
    const { error } = await supabase
      .from('users')
      .update({ user_type: role })
      .eq('id', userId);

    if (error) {
      alert('Error al cambiar el rol: ' + error.message);
    } else {
      alert('Rol actualizado correctamente a ' + role);
      // Aquí puedes actualizar la vista según el nuevo rol
    }
  };

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
    const { data, error } = await supabase.from('usuarios').insert([{ email, nombre, user_type: role }]).select().single();
    if (error) {
      alert('Error al crear usuario: ' + error.message);
    } else {
      setUsuarioCreado(true);
      alert('Usuario creado exitosamente: ' + data.email);
    }
  };

  return (
    <div>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="player">Jugador</option>
        <option value="sponsor">Patrocinador</option>
        <option value="coach">Entrenador</option>
        <option value="admin">Administrador</option>
        <option value="referee">Árbitro</option>
        <option value="fan">Aficionado</option>
      </select>
      <button onClick={cambiarRol}>Cambiar rol</button>

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