import React, { useState } from 'react';
import { Button } from '../components/Button';
import './TorneoEditar.css';

const gold = '#FFD700';
const black = '#222';

const torneoDemo = {
  nombre: 'Liga FutPro',
  estado: 'Activo',
  equipos: ['FutPro FC', 'Oro United', 'Black Stars'],
};

const TorneoEditar = () => {
  const [nombre, setNombre] = useState(torneoDemo.nombre);
  const [estado, setEstado] = useState(torneoDemo.estado);
  const [equipos, setEquipos] = useState(torneoDemo.equipos.join(', '));

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
          <h1 style={{ marginBottom: 12 }}>Editar Torneo</h1>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <label>
              Nombre:
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${black}`, marginLeft: 8 }} />
            </label>
            <label>
              Estado:
              <input type="text" value={estado} onChange={e => setEstado(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${black}`, marginLeft: 8 }} />
            </label>
            <label>
              Equipos:
              <input type="text" value={equipos} onChange={e => setEquipos(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${black}`, marginLeft: 8 }} />
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
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8, transition: 'background 0.3s, color 0.3s' }}>Ver clasificaciones</Button>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', transition: 'background 0.3s, color 0.3s' }}>Eliminar torneo</Button>
      </aside>
    </div>
  );
};

export default TorneoEditar;
