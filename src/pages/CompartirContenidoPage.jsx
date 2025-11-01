import React from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://YOUR_SUPABASE_URL.supabase.co';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
      .from('contenido_compartido')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else {
          setPosts(data || []);
        }
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase
      .from('contenido_compartido')
      .insert([
        { text, url, descripcion, tipo }
      ]);
    
    if (error) {
      setError(error.message);
    } else {
      setText('');
      setUrl('');
      setDescripcion('');
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 style={{color:'#FFD700'}}>Compartir Contenido</h1>
      
      <form onSubmit={handleSubmit} style={{marginBottom:24}}>
        <div style={{marginBottom:24}}>
          <label>Tipo de contenido</label>
          <select value={tipo} onChange={(e)=>setTipo(e.target.value)} style={{marginBottom:16}}>
            <option value="foto">Foto</option>
            <option value="video">Video</option>
            <option value="link">Link</option>
          </select>
        </div>
        
        <div style={{marginBottom:24}}>
          <input type="text" placeholder="URL" value={url} onChange={(e)=>setUrl(e.target.value)} style={{marginBottom:16,padding:8,width:'100%'}} />
        </div>
        
        <div style={{marginBottom:24}}>
          <textarea placeholder="Descripción" value={descripcion} onChange={(e)=>setDescripcion(e.target.value)} style={{marginBottom:16,padding:8,width:'100%',height:100}} />
        </div>
        
        <div style={{marginBottom:24}}>
          <textarea placeholder="Texto" value={text} onChange={(e)=>setText(e.target.value)} style={{marginBottom:16,padding:8,width:'100%',height:60}} />
        </div>
        
        <button type="submit" disabled={loading} style={{padding:'8px 16px',background:'#FFD700',color:'#000',border:'none',borderRadius:4,cursor:loading?'not-allowed':'pointer'}}>
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>

      {error && <div style={{color:'red',marginBottom:16}}>{error}</div>}
      
      {loading && <div style={{color:'#FFD700'}}>Cargando...</div>}
      
      <div>
        {posts.map((post) => (
          <div key={post.id} style={{marginBottom:24,padding:16,background:'#333',borderRadius:8}}>
            <p style={{color:'#FFD700'}}>{post.text}</p>
            {post.url && <a href={post.url} target="_blank" rel="noopener noreferrer" style={{color:'#4A9EFF'}}>{post.url}</a>}
            <p style={{color:'#999',fontSize:12,marginTop:8}}>{post.tipo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompartirContenidoPage;
