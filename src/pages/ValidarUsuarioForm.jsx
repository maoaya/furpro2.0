import React, { useState } from 'react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

const gold = '#FFD700';
const black = '#222';

export default function ValidarUsuarioForm() {
  const [usuario, setUsuario] = useState('');
  const [resultado, setResultado] = useState(null);
  const navigate = useNavigate();

  const irAlDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      {/* Panel izquierdo: navegación */}
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Validar Usuario</h2>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8, transition: 'background 0.3s, color 0.3s' }}>Consultar</Button>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8, transition: 'background 0.3s, color 0.3s' }}>Actualizar</Button>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', transition: 'background 0.3s, color 0.3s' }}>Ver historial</Button>
      </aside>

      {/* Feed central: formulario de validación */}
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ marginBottom: 12 }}>Validar Usuario</h1>
          <p style={{ marginBottom: 24, fontSize: 14, opacity: 0.8 }}>
            ¡Bienvenido! Completa tu registro o continúa al dashboard para empezar a usar FutPro.
          </p>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <label>
              Usuario:
              <input type="text" value={usuario} onChange={e => setUsuario(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${black}`, marginLeft: 8 }} />
            </label>
            <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
              <Button type="button" style={{ background: black, color: gold, border: `2px solid ${gold}`, borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', transition: 'background 0.3s, color 0.3s' }} onClick={() => setResultado('Usuario válido')}>Validar</Button>
              <Button type="button" style={{ background: black, color: gold, border: `2px solid ${gold}`, borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', transition: 'background 0.3s, color 0.3s' }} onClick={() => setResultado(null)}>Limpiar</Button>
            </div>
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${black}40` }}>
              <Button 
                type="button" 
                style={{ 
                  background: black, 
                  color: gold, 
                  border: `2px solid ${gold}`, 
                  borderRadius: 8, 
                  padding: '12px 24px', 
                  fontWeight: 'bold', 
                  fontSize: 16,
                  transition: 'all 0.3s',
                  width: '100%'
                }} 
                onClick={irAlDashboard}
              >
                🏆 Continuar al Dashboard
              </Button>
            </div>
          </form>
          {resultado && (
            <div style={{ marginTop: 24, fontWeight: 'bold', fontSize: 18 }}>{resultado}</div>
          )}
        </div>
      </main>

      {/* Panel derecho: acciones rápidas */}
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8, transition: 'background 0.3s, color 0.3s' }}>Ver reportes</Button>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', transition: 'background 0.3s, color 0.3s' }}>Contactar soporte</Button>
      </aside>
    </div>
  );
}
