import React, { useState } from 'react';
import { Button } from '../components/Button';
import './UsuarioEditar.css';

const gold = '#FFD700';
const black = '#222';

const usuarioDemo = {
  nombre: 'Ana Torres',
  rol: 'Admin',
  email: 'ana.torres@futpro.com',
  telefono: '+34 600 123 456',
};

const UsuarioEditar = () => {
  const [nombre, setNombre] = useState(usuarioDemo.nombre);
  const [rol, setRol] = useState(usuarioDemo.rol);
  const [email, setEmail] = useState(usuarioDemo.email);
  const [telefono, setTelefono] = useState(usuarioDemo.telefono);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      {/* Panel izquierdo: navegación */}
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Panel de Edición</h2>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8, transition: 'background 0.3s, color 0.3s' }}>Consultar</Button>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8, transition: 'background 0.3s, color 0.3s' }}>Actualizar</Button>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', transition: 'background 0.3s, color 0.3s' }}>Ver historial</Button>
      </aside>

      {/* Feed central: formulario de edición */}
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ marginBottom: 12 }}>Editar Usuario</h1>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <label>
              Nombre:
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${black}`, marginLeft: 8 }} />
            </label>
            <label>
              Rol:
              <input type="text" value={rol} onChange={e => setRol(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${black}`, marginLeft: 8 }} />
            </label>
            <label>
              Email:
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${black}`, marginLeft: 8 }} />
            </label>
            <label>
              Teléfono:
              <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${black}`, marginLeft: 8 }} />
            </label>
            <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
              <Button type="submit" style={{ background: black, color: gold, border: `2px solid ${gold}`, borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', transition: 'background 0.3s, color 0.3s' }}>Guardar cambios</Button>
              <Button type="button" style={{ background: black, color: gold, border: `2px solid ${gold}`, borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', transition: 'background 0.3s, color 0.3s' }}>Cancelar</Button>
            </div>
          </form>
        </div>
      </main>

      {/* Panel derecho: acciones rápidas */}
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8, transition: 'background 0.3s, color 0.3s' }}>Ver permisos</Button>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', transition: 'background 0.3s, color 0.3s' }}>Eliminar usuario</Button>
      </aside>
    </div>
  );
};

export default UsuarioEditar;
