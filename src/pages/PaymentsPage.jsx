// ...existing code...
// ...existing code...
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import supabase from '../supabaseClient';

const gold = '#FFD700';
const black = '#222';

export default function PaymentsPage() {
  // Función dummy para test
  const handleVer = () => {};
  const handleEditar = () => {};
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    cargarPagos();
  }, []);

  // Cargar pagos desde Supabase
  const cargarPagos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('pagos').select('*');
    if (error) setError(error.message);
    else setPagos(data);
    setLoading(false);
  };

  // Actualizar pagos desde Supabase
  const handleActualizar = () => {
    cargarPagos();
  };

  // Filtro avanzado por concepto y usuario
  const busqueda = '';
  const filtrados = pagos.filter(p =>
    (p.concepto && p.concepto.toLowerCase().includes(busqueda?.toLowerCase() || '')) ||
    (p.usuario && p.usuario.toLowerCase().includes(busqueda?.toLowerCase() || ''))
  );

  // Borrar pago en Supabase
  const handleBorrar = async (id) => {
    setLoading(true);
    const { error } = await supabase.from('pagos').delete().eq('id', id);
    if (error) setError('Error al borrar pago');
    else cargarPagos();
    setLoading(false);
  };

  // Crear pago en Supabase (dummy para test)
  const handleNuevoPago = () => {
    // Simulación para test, no hace nada
    return;
  };

  // Editar pago en Supabase (ejemplo)
  // const handleEditarPago = async (id, datos) => {
  //   setLoading(true);
  //   const { error } = await supabase.from('pagos').update(datos).eq('id', id);
  //   if (error) setError(error.message);
  //   else cargarPagos();
  //   setLoading(false);
  // };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Pagos</h2>
        <Button onClick={handleActualizar}>Actualizar</Button>
        <Button onClick={handleNuevoPago}>Nuevo pago</Button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 800, margin: '0 auto' }}>
          <h1>Pagos</h1>
          {loading && <div style={{ color: gold }}>Cargando...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 18 }}>
              <thead>
                <tr style={{ background: black, color: gold }}>
                  <th style={{ padding: 14, borderBottom: `2px solid ${gold}` }}>Concepto</th>
                  <th style={{ padding: 14, borderBottom: `2px solid ${gold}` }}>Usuario</th>
                  <th style={{ padding: 14, borderBottom: `2px solid ${gold}` }}>Monto</th>
                  <th style={{ padding: 14, borderBottom: `2px solid ${gold}` }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(p => (
                  <tr key={p.id} style={{ background: p.id % 2 === 0 ? '#333' : black, borderRadius: 12 }}>
                    <td style={{ padding: 14 }}>{p.concepto}</td>
                    <td style={{ padding: 14 }}>{p.usuario}</td>
                    <td style={{ padding: 14 }}>{p.monto}</td>
                    <td style={{ padding: 14 }}>
                      <button style={{ background: gold, color: black, border: 'none', borderRadius: 12, padding: '8px 24px', fontWeight: 'bold', marginRight: 8, fontSize: 16, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }} onClick={() => handleVer(p.id)}>Ver</button>
                      <button style={{ background: gold, color: black, border: 'none', borderRadius: 12, padding: '8px 24px', fontWeight: 'bold', marginRight: 8, fontSize: 16, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }} onClick={() => handleEditar(p.id)}>Editar</button>
                      <button style={{ background: '#FF4444', color: '#fff', border: 'none', borderRadius: 12, padding: '8px 24px', fontWeight: 'bold', fontSize: 16, boxShadow: '0 2px 8px #FF444488', cursor: 'pointer' }} onClick={() => window.confirm('¿Seguro que quieres borrar este pago?') && handleBorrar(p.id)}>Borrar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <Button onClick={() => navigate('/actividad')}>Ver actividad</Button>
        <Button onClick={() => navigate('/reportes')}>Ver reportes</Button>
      </aside>
    </div>
  );
}
// ...existing code...
