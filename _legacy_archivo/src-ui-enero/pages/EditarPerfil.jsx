import React, { useEffect, useState } from 'react';
import { UserService } from '../services/UserService';
import { supabase } from '../config/supabase';
export default function EditarPerfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [pais, setPais] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function fetchPerfil() {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      if (userId) {
        const perfilData = await UserService.getUserProfile(userId);
        setPerfil(perfilData);
        setNombre(perfilData.nombre || '');
        setApellido(perfilData.apellido || '');
        setPais(perfilData.pais || '');
        setCiudad(perfilData.ciudad || '');
      }
      setLoading(false);
    }
    fetchPerfil();
  }, []);

  const handleGuardar = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await UserService.updateUser(perfil.id, { nombre, apellido, pais, ciudad });
      setMsg('Perfil actualizado correctamente');
    } catch {
      setMsg('Error al actualizar perfil');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!perfil) return <div>No se encontró el perfil.</div>;

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0002' }}>
      <h1 style={{ color: '#FFD700', textAlign: 'center' }}>Editar Perfil</h1>
      <form onSubmit={handleGuardar}>
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" style={{ width: '100%', marginBottom: 8 }} />
        <input type="text" value={apellido} onChange={e => setApellido(e.target.value)} placeholder="Apellido" style={{ width: '100%', marginBottom: 8 }} />
        <input type="text" value={pais} onChange={e => setPais(e.target.value)} placeholder="País" style={{ width: '100%', marginBottom: 8 }} />
        <input type="text" value={ciudad} onChange={e => setCiudad(e.target.value)} placeholder="Ciudad" style={{ width: '100%', marginBottom: 8 }} />
        <button type="submit" style={{ background: '#FFD700', color: '#232323', padding: '8px 16px', borderRadius: 8 }}>Guardar cambios</button>
      </form>
      {msg && <div style={{ color: msg.includes('Error') ? 'red' : 'green', marginTop: 8 }}>{msg}</div>}
    </div>
  );
}
