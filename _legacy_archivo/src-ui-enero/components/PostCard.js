// PostCard: video/foto con overlays y acciones
import React, { useRef, useEffect, useState } from 'react';

export default function PostCard({ post }) {
  const videoRef = useRef();
  const [muted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (post.tipo === 'video' && videoRef.current) {
      videoRef.current.play();
      videoRef.current.muted = muted;
    }
  }, [post, muted]);

  // Pausar video fuera de vista
  useEffect(() => {
    if (post.tipo !== 'video' || !videoRef.current) return;
    const observer = new window.IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) videoRef.current.pause();
      else videoRef.current.play();
    }, { threshold: 0.7 });
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [post]);

  // Doble tap = like
  const handleDoubleClick = () => {
    setLikeCount(likeCount + 1);
  };

  // Mantener pulsado = opciones
  const handleHold = () => {
    alert('Opciones: Reportar, Compartir, Guardar');
  };

  return (
    <div className="post-card-tiktok" style={{position:'relative',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      {post.tipo === 'video' ? (
        <video
          ref={videoRef}
          src={post.url}
          autoPlay
          loop
          muted={muted}
          style={{width:'100%',height:'100%',objectFit:'cover'}}
          onDoubleClick={handleDoubleClick}
          onContextMenu={e => {e.preventDefault(); handleHold();}}
        />
      ) : (
        <img src={post.url} alt="Post" style={{width:'100%',height:'100%',objectFit:'cover'}} />
      )}
      {/* Overlay lateral derecho */}
      <div className="overlay-right" style={{position:'absolute',right:24,top:'40%',display:'flex',flexDirection:'column',gap:18}}>
        <button className="btn-overlay" aria-label="Like" onClick={()=>setLikeCount(likeCount+1)}><i className="fa-solid fa-heart"></i> <span>{likeCount}</span></button>
        <button className="btn-overlay" aria-label="Comentar" onClick={()=>setShowComments(true)}><i className="fa-solid fa-comment"></i> <span>{post.comentarios.length}</span></button>
        <button className="btn-overlay" aria-label="Compartir"><i className="fa-solid fa-share"></i></button>
        <button className="btn-overlay" aria-label="Guardar" onClick={()=>setSaved(s=>!s)}><i className={saved?"fa-solid fa-bookmark":"fa-regular fa-bookmark"}></i></button>
      </div>
      {/* Overlay inferior */}
      <div className="overlay-bottom" style={{position:'absolute',bottom:0,left:0,width:'100%',background:'rgba(0,0,0,0.6)',color:'#FFD700',padding:'18px 24px',borderTopLeftRadius:18,borderTopRightRadius:18}}>
        <div style={{fontWeight:'bold'}}>{post.autorNombre} {post.club && <span style={{color:'#fff',marginLeft:8}}>@{post.club}</span>}</div>
        <div style={{color:'#fff',marginTop:6}}>{post.texto}</div>
        <div style={{marginTop:6}}>{post.hashtags && post.hashtags.map(h=> <span key={h} style={{marginRight:8,color:'#FFD700'}}>#{h}</span>)}</div>
        {post.musica && <div style={{marginTop:6}}><i className="fa-solid fa-music"></i> {post.musica}</div>}
        <button className="btn-seguir" style={{marginTop:8,background:'#FFD700',color:'#222',borderRadius:8,padding:'6px 18px',border:'none'}}>Seguir</button>
      </div>
      {/* Sheet de comentarios */}
      {showComments && (
        <div className="comment-sheet" style={{position:'absolute',bottom:0,left:0,width:'100%',maxHeight:'60vh',background:'#222',color:'#FFD700',borderTopLeftRadius:18,borderTopRightRadius:18,overflowY:'auto',zIndex:10}}>
          <button style={{float:'right',background:'none',border:'none',color:'#FFD700',fontSize:22}} onClick={()=>setShowComments(false)}>&times;</button>
          <h4>Comentarios</h4>
          {post.comentarios.map(c=>(<div key={c.id} style={{marginBottom:12}}><b>{c.autorNombre}</b>: {c.texto}</div>))}
          <input type="text" placeholder="Escribe un comentario..." style={{width:'90%',margin:'12px 0',padding:8,borderRadius:8,border:'1px solid #FFD700'}} />
        </div>
      )}
      {/* Etiqueta partido en vivo */}
      {post.enVivo && <div style={{position:'absolute',top:18,left:18,background:'#e53935',color:'#fff',padding:'4px 12px',borderRadius:8,fontWeight:'bold'}}>Partido en vivo</div>}
    </div>
  );
}
