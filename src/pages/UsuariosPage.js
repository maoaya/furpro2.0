import React, { useState } from 'react';

import { Button, Input } from './Button';
import supabase from '../supabaseClient';
import './UsuariosPage.css';

const gold = '#FFD700';
const black = '#222';

export default function UsuariosPage() {
  // const { user, role } = useContext(AuthContext);
  const [busqueda, setBusqueda] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar usuarios desde Supabase
  React.useEffect(() => {
    setLoading(true);
    supabase.from('users').select('*').then(({ data, error }) => {
      if (error) setError(error.message);
      else setUsuarios(data);
      setLoading(false);
    });
  }, []);

  const handleEditar = async () => {
    setLoading(true);
    // ... lógica de edición ...
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      {/* Panel izquierdo: navegación */}
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Panel de Usuarios</h2>
        <Button onClick={() => window.location.href = '/usuarios'}>Consultar</Button>
        <Button onClick={() => window.location.href = '/usuarios'}>Actualizar</Button>
        <Button onClick={() => window.location.href = '/historial'}>Ver historial</Button>
      </aside>

      {/* Feed central: listado de usuarios */}
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ marginBottom: 12 }}>Usuarios FutPro</h1>
          <Input
            type="text"
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ marginBottom: 18, width: '100%' }}
          />
          {loading && <div style={{ color: gold }}>Cargando...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
            <thead>
              <tr style={{ background: black, color: gold }}>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Nombre</th>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Actividad</th>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.filter(u => u.nombre?.toLowerCase().includes(busqueda.toLowerCase())).map(usuario => (
                <tr key={usuario.id} style={{ background: usuario.id % 2 === 0 ? '#333' : black }}>
                  <td style={{ padding: 10 }}>{usuario.nombre}</td>
                  <td style={{ padding: 10 }}>
                    <svg width="80" height="24" style={{ verticalAlign: 'middle' }}>
                      {(usuario.actividad || [1,2,3,4,5]).map((valor, i) => (
                        <rect key={i} x={i * 16} y={24 - valor * 4} width={12} height={valor * 4} fill={gold} />
                      ))}
                    </svg>
                  </td>
                  <td style={{ padding: 10 }}>
                    <Button onClick={() => handleEditar(usuario.id)}>Editar</Button>
                    <Button onClick={() => window.location.href = `/usuarios/${usuario.id}/historial`}>Ver historial</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Panel derecho: acciones rápidas */}
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <Button onClick={() => window.location.href = '/usuarios/nuevo'}>Crear usuario</Button>
        <Button onClick={() => window.location.href = '/reportes'}>Ver reportes</Button>
      </aside>
    </div>
  );
}