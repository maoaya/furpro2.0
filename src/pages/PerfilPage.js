import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function PerfilPage() {
  const { userId } = useParams();
  const [perfil, setPerfil] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      supabase.from('users').select('*').eq('id', userId).single(),
      supabase.from('posts').select('*').eq('user_id', userId)
    ]).then(([userRes, postsRes]) => {
      if (userRes.error) setError(userRes.error.message);
      else setPerfil(userRes.data);
      if (postsRes.error) setError(postsRes.error.message);
      else setPosts(postsRes.data || []);
      setLoading(false);
    });
  }, [userId]);

  const MemoPostsList = React.memo(function MemoPostsList({ posts, perfil }) {
    return (
      <>
        {posts.map((post, idx) => (
          <div key={post.id} style={{background:'#222',borderRadius:12,padding:16,marginBottom:24,boxShadow:'0 2px 8px #FFD70022',animation:'fadeInUp 0.5s',animationDelay:`${idx*0.07}s`,animationFillMode:'both'}}>
            <div style={{fontWeight:'bold',fontSize:18}}>{perfil.username}</div>
            <div style={{margin:'12px 0'}}>{post.content}</div>
            <div style={{display:'flex',gap:16}}>
              <span>❤️ {post.likes}</span>
              <span>💬 {post.comments.length}</span>
            </div>
          </div>
        ))}
      </>
    );
  });

  if (loading) return <div className="loader" />;
  if (error) return <div style={{color:'red'}}>Error: {error}</div>;
  if (!perfil) return <div style={{color:'#FFD700'}}>Perfil no encontrado</div>;

  return (
    <div>
      <h1 style={{color:'#FFD700'}}>{perfil.username}</h1>
      <div style={{margin:'12px 0',color:'#FFD70099'}}>{perfil.bio}</div>
      <div style={{display:'flex',gap:32,marginBottom:24}}>
        <div>Seguidores: <b>{perfil.followers}</b></div>
        <div>Likes: <b>{perfil.likes}</b></div>
        <div>Posts: <b>{posts.length}</b></div>
      </div>
      <h2 style={{color:'#FFD700'}}>Publicaciones</h2>
      <MemoPostsList posts={posts} perfil={perfil} />
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default PerfilPage;
