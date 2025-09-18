import React from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://YOUR_SUPABASE_URL.supabase.co';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Contenido placeholder

function CompartirContenidoPage() {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [text, setText] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [descripcion, setDescripcion] = React.useState('');
  const [tipo, setTipo] = React.useState('foto');

  React.useEffect(() => {
    setLoading(true);
    supabase
      .from('posts_compartidos')
      .select('*')
      .order('fecha', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setPosts(data || []);
        setLoading(false);
      });
  }, []);

  const handleShare = async () => {
    if (!text) return;
    setLoading(true);
    const { error } = await supabase
      .from('posts_compartidos')
      .insert([{ contenido: text, fecha: new Date().toISOString() }]);
    if (error) setError(error.message);
    setText('');
    // Recargar posts
    const { data } = await supabase.from('posts_compartidos').select('*').order('fecha', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  const handleAgregar = async () => {
    if (!url || !descripcion || !tipo) return;
    setLoading(true);
    const { error } = await supabase
      .from('posts_compartidos')
      .insert([{ url, descripcion, tipo, fecha: new Date().toISOString() }]);
    if (error) setError(error.message);
    setUrl('');
    setDescripcion('');
    setTipo('foto');
    // Recargar posts
    const { data } = await supabase.from('posts_compartidos').select('*').order('fecha', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  if (loading) return <div className="loader" />;
  if (error) return <div style={{color:'red'}}>Error: {error}</div>;

  return (
    <div>
      <h1 style={{color:'#FFD700'}}>Compartir Contenido</h1>
      <div style={{marginBottom:24}}>
        <input type="text" placeholder="URL" value={url} onChange={e=>setUrl(e.target.value)} style={{marginRight:8}} />
        <input type="text" placeholder="Descripción" value={descripcion} onChange={e=>setDescripcion(e.target.value)} style={{marginRight:8}} />
        <select value={tipo} onChange={e=>setTipo(e.target.value)} style={{marginRight:8}}>
          <option value="foto">Foto</option>
          <option value="video">Video</option>
        </select>
        <button onClick={handleAgregar}>Agregar</button>
      </div>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Escribe tu publicación..." style={{marginBottom:12,padding:8,borderRadius:8,border:'2px solid #FFD700',width:'100%',fontSize:16}} />
      <button onClick={handleShare} style={{color:'#232323',background:'#FFD700',border:'none',borderRadius:8,padding:'8px 24px',fontWeight:'bold'}}>Compartir</button>
      <div style={{marginTop:32}}>
        {posts.map((post, idx) => (
          <div key={post.id} style={{background:'#222',borderRadius:12,padding:16,marginBottom:24,boxShadow:'0 2px 8px #FFD70022',animation:'fadeInUp 0.5s',animationDelay:`${idx*0.07}s`,animationFillMode:'both'}}>
            <div style={{fontWeight:'bold',fontSize:18}}>{post.contenido || post.descripcion}</div>
            <div style={{margin:'12px 0',color:'#FFD70099'}}>Fecha: {post.fecha}</div>
            {post.url && (
              post.tipo === 'foto' ?
                <img src={post.url} alt={post.descripcion} style={{maxWidth:'100%',borderRadius:8,marginTop:8}} /> :
                <a href={post.url} target="_blank" rel="noopener noreferrer" style={{color:'#FFD700'}}>Ver video</a>
            )}
          </div>
        ))}
        <style>{`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(24px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default CompartirContenidoPage;
