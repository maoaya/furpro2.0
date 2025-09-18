import React, { useState } from 'react';

const userDemo = {
  nombre: 'Usuario Demo',
  email: 'demo@futpro.com',
  notificaciones: true,
  tema: 'Oscuro',
};

function UserSettingsPage() {
  const [nombre, setNombre] = useState(userDemo.nombre);
  const [email, setEmail] = useState(userDemo.email);
  const [notificaciones, setNotificaciones] = useState(userDemo.notificaciones);
  const [tema, setTema] = useState(userDemo.tema);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 32 }}>
      <div style={{ flex: 1, background: 'black', color: 'gold', padding: 32, borderRadius: 16 }}>
        <h1 style={{ marginBottom: 12 }}>Configuración de Usuario</h1>
        <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <label>
            Nombre:
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid black', marginLeft: 8 }} />
          </label>
          <label>
            Email:
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid black', marginLeft: 8 }} />
          </label>
          <label>
            Notificaciones:
            <input type="checkbox" checked={notificaciones} onChange={e => setNotificaciones(e.target.checked)} style={{ marginLeft: 8 }} />
          </label>
          <label>
            Tema:
            <select value={tema} onChange={e => setTema(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid black', marginLeft: 8 }}>
              <option value="Oscuro">Oscuro</option>
              <option value="Claro">Claro</option>
            </select>
          </label>
          <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            <button type="submit" style={{ background: 'black', color: 'gold', border: '2px solid gold', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold' }}>Guardar cambios</button>
            <button type="button" style={{ background: 'gold', color: 'black', border: '2px solid gold', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold' }}>Cancelar</button>
          </div>
        </form>
      </div>
      <aside style={{ width: 220, background: 'black', borderLeft: '2px solid gold', padding: 24 }}>
        <h2 style={{ color: 'gold' }}>Acciones rápidas</h2>
        <button style={{ background: 'gold', color: 'black', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8 }}>Ver reportes</button>
        <button style={{ background: 'gold', color: 'black', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%' }}>Eliminar cuenta</button>
      </aside>
    </div>
  );
}

export default UserSettingsPage;
