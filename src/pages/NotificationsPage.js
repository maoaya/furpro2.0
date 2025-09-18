import React from 'react';
import supabase from '../supabaseClient';

function NotificationsPage() {


    const [notificaciones, setNotificaciones] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
      setLoading(true);
      supabase
        .from('notificaciones')
        .select('*')
        .order('fecha', { ascending: false })
        .then(({ data, error }) => {
          if (error) setError(error.message);
          else setNotificaciones(data || []);
          setLoading(false);
        });
    }, []);

    const marcarLeida = async (id) => {
      await supabase.from('notificaciones').update({ leida: true }).eq('id', id);
      setNotificaciones(n => n.map(notif => notif.id === id ? { ...notif, leida: true } : notif));
    };

    if (loading) return <div style={{color:'#FFD700'}}>Cargando notificaciones...</div>;
    if (error) return <div style={{color:'red'}}>Error: {error}</div>;

    return (
      <div>
        <h1 style={{color:'#FFD700'}}>Notificaciones</h1>
        {notificaciones.map(notif => (
          <div key={notif.id} style={{background:'#222',borderRadius:12,padding:16,marginBottom:24,boxShadow:'0 2px 8px #FFD70022',opacity:notif.leida?0.5:1}}>
            <div style={{fontWeight:'bold',fontSize:18}}>{notif.titulo}</div>
            <div style={{margin:'12px 0',color:'#FFD70099'}}>{notif.mensaje}</div>
            <div style={{margin:'12px 0'}}>Fecha: {notif.fecha}</div>
            {!notif.leida && <button onClick={()=>marcarLeida(notif.id)} style={{color:'#232323',background:'#FFD700',border:'none',borderRadius:8,padding:'8px 24px',fontWeight:'bold'}}>Marcar como leída</button>}
          </div>
        ))}
      </div>
    );
}

export default NotificationsPage;
