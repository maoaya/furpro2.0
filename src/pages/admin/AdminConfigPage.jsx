import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';

const gold = '#FFD700';
const black = '#222';

export default function AdminConfigPage() {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarConfig();
    // eslint-disable-next-line
  }, []);

  const cargarConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from('configuracion').select('*').single();
      if (error) setError('Error al cargar configuración');
      else setConfig(data || {});
    } catch (e) {
      setError('Error al cargar configuración');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const guardarConfig = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase.from('configuracion').upsert([config]);
      setMensaje('Configuración guardada');
    } catch (e) {
      setError('Error al guardar configuración');
    }
    setLoading(false);
    setTimeout(() => setMensaje(''), 2500);
  };

  const exportarBackup = async () => {
    try {
      const res = await fetch('/api/admin/backup');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'futpro-backup.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setMensaje('Error al exportar backup');
    }
  };

  return (
    <div style={{ background: '#181818', color: gold, minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Configuración Global</h2>
      <button onClick={exportarBackup} style={{ background: gold, color: black, borderRadius: 6, padding: '8px 18px', fontWeight: 'bold', marginBottom: 24 }}>Exportar Backup</button>
      {loading && <div style={{ color: gold }}>Cargando...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={guardarConfig} style={{ background: '#232323', borderRadius: 12, padding: 24, minWidth: 320 }}>
        <div style={{ marginBottom: 16 }}>
          <label>Nombre del sitio:</label>
          <input name="nombre_sitio" value={config.nombre_sitio || ''} onChange={handleChange} style={{ borderRadius: 8, padding: 8, width: 220, marginLeft: 12 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Email soporte:</label>
          <input name="email_soporte" value={config.email_soporte || ''} onChange={handleChange} style={{ borderRadius: 8, padding: 8, width: 220, marginLeft: 12 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Modo mantenimiento:</label>
          <select name="mantenimiento" value={config.mantenimiento || 'no'} onChange={handleChange} style={{ borderRadius: 8, padding: 8, marginLeft: 12 }}>
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
        </div>
        <button type="submit" style={{ background: gold, color: black, borderRadius: 6, padding: '8px 18px', fontWeight: 'bold' }}>Guardar</button>
      </form>
      {mensaje && (
        <div style={{ background: '#222', color: gold, padding: 10, borderRadius: 8, marginTop: 18 }}>{mensaje}</div>
      )}
    </div>
  );
}
