import React, { useState } from 'react';

export default function ValidadorWeb() {
  const [usuarioEmail, setUsuarioEmail] = useState('');
  const [usuarioTelefono, setUsuarioTelefono] = useState('');
  const [usuarioDireccion, setUsuarioDireccion] = useState('');
  const [formulario, setFormulario] = useState('');
  const [result, setResult] = useState('');
  const [registros, setRegistros] = useState([]);

  const validarUsuario = () => setResult('Usuario validado (simulado)');
  const guardarUsuario = () => setResult('Usuario guardado (simulado)');
  const guardarFormulario = () => setResult('Formulario guardado (simulado)');
  const verRegistros = () => setRegistros([{usuario:'Ejemplo', email:'ejemplo@mail.com'}]);

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 40, borderRadius: 18, boxShadow: '0 4px 24px #FFD70044', maxWidth: 700, margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Validador Web</h2>
      <div style={{ marginBottom: 24 }}>
        <input value={usuarioEmail} onChange={e => setUsuarioEmail(e.target.value)} placeholder="Email del usuario" style={{ marginRight: 8, padding: 8, borderRadius: 8, border: '1px solid #FFD700', background: '#232323', color: '#FFD700' }} />
        <input value={usuarioTelefono} onChange={e => setUsuarioTelefono(e.target.value)} placeholder="Teléfono del usuario" style={{ marginRight: 8, padding: 8, borderRadius: 8, border: '1px solid #FFD700', background: '#232323', color: '#FFD700' }} />
        <input value={usuarioDireccion} onChange={e => setUsuarioDireccion(e.target.value)} placeholder="Dirección del usuario" style={{ padding: 8, borderRadius: 8, border: '1px solid #FFD700', background: '#232323', color: '#FFD700' }} />
        <button onClick={validarUsuario} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, marginLeft: 12, cursor: 'pointer' }}>Validar Usuario</button>
        <button onClick={guardarUsuario} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, marginLeft: 8, cursor: 'pointer' }}>Guardar Usuario</button>
      </div>
      <div style={{ marginBottom: 24 }}>
        <textarea value={formulario} onChange={e => setFormulario(e.target.value)} placeholder="Datos del formulario" style={{ width: '100%', minHeight: 60, borderRadius: 8, border: '1px solid #FFD700', background: '#232323', color: '#FFD700', padding: 8 }} />
        <button onClick={guardarFormulario} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, marginTop: 8, cursor: 'pointer' }}>Guardar Formulario</button>
      </div>
      <div style={{ marginBottom: 24 }}>
        <strong>Resultado:</strong> {result}
      </div>
      <div style={{ marginBottom: 24 }}>
        <button onClick={verRegistros} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>Ver registros guardados</button>
        <ul>
          {registros.map((r, i) => (
            <li key={i}>{JSON.stringify(r)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
