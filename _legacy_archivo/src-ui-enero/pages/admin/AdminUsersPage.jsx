import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import supabase from '../../supabaseClient';

const gold = '#FFD700';
const black = '#222';
const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [accion, setAccion] = useState(null); // { tipo, usuario }
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, [pagina, filtro]);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError(null);
    let query = supabase.from('usuarios').select('*', { count: 'exact' });
    if (filtro) {
      query = query.ilike('nombre', `%${filtro}%`);
    }
    const from = (pagina - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, error, count } = await query.range(from, to);
    if (error) setError('Error al cargar usuarios');
    else {
      setUsuarios(data || []);
      setTotalPaginas(Math.max(1, Math.ceil((count || 1) / PAGE_SIZE)));
    }
    setLoading(false);
  };

  const handleAccion = (tipo, usuario) => {
    setAccion({ tipo, usuario });
  };

  const confirmarAccion = async () => {
    if (!accion) return;
    setLoading(true);
    let res;
    if (accion.tipo === 'promover') {
      res = await supabase.from('usuarios').update({ rol: 'admin' }).eq('id', accion.usuario.id);
      setMensaje('Usuario promovido a admin');
    } else if (accion.tipo === 'bloquear') {
      res = await supabase.from('usuarios').update({ rol: 'bloqueado' }).eq('id', accion.usuario.id);
      setMensaje('Usuario bloqueado');
    } else if (accion.tipo === 'eliminar') {
      res = await supabase.from('usuarios').delete().eq('id', accion.usuario.id);
      setMensaje('Usuario eliminado');
    }
    setAccion(null);
    setLoading(false);
    cargarUsuarios();
    setTimeout(() => setMensaje(''), 2500);
  };

  const cancelarAccion = () => setAccion(null);

  const handleBuscar = (e) => {
    setFiltro(e.target.value);
    setPagina(1);
  };

  return (
    <div style={{ background: '#181818', color: gold, minHeight: '100vh', padding: 32 }}>
  <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }} id="admin-users-title">{t('Gestión de Usuarios')}</h2>
  <label htmlFor="filtro-usuarios" style={{ display: 'block', marginBottom: 4 }}>Buscar:</label>
  <input id="filtro-usuarios" value={filtro} onChange={handleBuscar} placeholder={t('Buscar usuario...')} style={{ borderRadius: 8, padding: 8, marginBottom: 18 }} aria-label={t('Buscar usuario...')} />
      {loading && <div style={{ color: gold }}>Cargando...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
  <table style={{ width: '100%', background: '#232323', color: gold, borderRadius: 12, marginBottom: 24 }} role="table" aria-labelledby="admin-users-title">
  <thead role="rowgroup">
          <tr role="row">
            <th style={{ padding: 12 }} scope="col">Nombre</th>
            <th style={{ padding: 12 }} scope="col">Email</th>
            <th style={{ padding: 12 }} scope="col">Rol</th>
            <th style={{ padding: 12 }} scope="col">Acciones</th>
          </tr>
        </thead>
  <tbody role="rowgroup">
          {usuarios.map(usuario => (
            <tr key={usuario.id} role="row">
              <td style={{ padding: 12 }} role="cell">{usuario.nombre}</td>
              <td style={{ padding: 12 }} role="cell">{usuario.email}</td>
              <td style={{ padding: 12 }} role="cell">{usuario.rol || 'usuario'}</td>
              <td style={{ padding: 12, display: 'flex', gap: 8 }} role="cell">
                {usuario.rol !== 'admin' && (
                  <button onClick={() => handleAccion('promover', usuario)} style={{ background: gold, color: black, borderRadius: 6, padding: '4px 10px', fontWeight: 'bold' }} tabIndex={0} aria-label={t('Promover') + ' ' + usuario.nombre}>{t('Promover') || 'Promover'}</button>
                )}
                {usuario.rol !== 'bloqueado' && (
                  <button onClick={() => handleAccion('bloquear', usuario)} style={{ background: '#e67e22', color: black, borderRadius: 6, padding: '4px 10px', fontWeight: 'bold' }} tabIndex={0} aria-label={t('Bloquear') + ' ' + usuario.nombre}>{t('Bloquear') || 'Bloquear'}</button>
                )}
                <button onClick={() => handleAccion('eliminar', usuario)} style={{ background: '#c0392b', color: gold, borderRadius: 6, padding: '4px 10px', fontWeight: 'bold' }} tabIndex={0} aria-label={t('Eliminar') + ' ' + usuario.nombre}>{t('Eliminar') || 'Eliminar'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {accion && (
        <div style={{ background: '#333', color: gold, padding: 18, borderRadius: 10, marginBottom: 18 }}>
          <div>¿Seguro que deseas <b>{accion.tipo}</b> al usuario <b>{accion.usuario.nombre}</b>?</div>
          <div style={{ marginTop: 12 }}>
            <button onClick={confirmarAccion} style={{ background: gold, color: black, borderRadius: 6, padding: '6px 18px', fontWeight: 'bold', marginRight: 12 }}>{t('Confirmar') || 'Confirmar'}</button>
            <button onClick={cancelarAccion} style={{ background: '#c0392b', color: gold, borderRadius: 6, padding: '6px 18px', fontWeight: 'bold' }}>{t('Cancelar') || 'Cancelar'}</button>
          </div>
        </div>
      )}
      {mensaje && (
        <div style={{ background: '#222', color: gold, padding: 10, borderRadius: 8, marginBottom: 18 }}>{mensaje}</div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
        <button disabled={pagina === 1} onClick={() => setPagina(p => Math.max(1, p - 1))} style={{ padding: '8px 18px', borderRadius: 8, background: gold, color: black, fontWeight: 'bold' }}>{t('Anterior')}</button>
        <span style={{ alignSelf: 'center' }}>Página {pagina} de {totalPaginas}</span>
        <button disabled={pagina === totalPaginas} onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} style={{ padding: '8px 18px', borderRadius: 8, background: gold, color: black, fontWeight: 'bold' }}>{t('Siguiente')}</button>
      </div>
    </div>
  );
}
