import React, { useRef, useState } from 'react';
import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

export default function LiveStreamPage() {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [title, setTitle] = useState('Transmisión en FutPro');
  const [description, setDescription] = useState('');
  const [streamId, setStreamId] = useState(null);
  const [teams, setTeams] = useState([]);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [viewers, setViewers] = useState(0);
  const [likes, setLikes] = useState(0);
  const [viewerIntervalId, setViewerIntervalId] = useState(null);

  useEffect(() => {
    if (streamId) {
      loadComments();
      loadStats();
      const channel = supabase
        .channel(`live-comments-${streamId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'live_stream_comments', filter: `stream_id=eq.${streamId}` }, (payload) => {
          setComments((prev) => [payload.new, ...prev].slice(0, 20));
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [streamId]);

  useEffect(() => {
    if (streaming) {
      const id = setInterval(() => {
        setViewers((prev) => prev + Math.floor(Math.random() * 3));
      }, 5000);
      setViewerIntervalId(id);
      return () => clearInterval(id);
    }
    if (viewerIntervalId) {
      clearInterval(viewerIntervalId);
      setViewerIntervalId(null);
    }
  }, [streaming]);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const { data } = await supabase
        .from('teams')
        .select('id, name, logo_url')
        .order('name');
      setTeams(data || []);
    } catch (err) {
      console.error('Error cargando equipos:', err);
    }
  };

  const updateScore = async (team, increment) => {
    if (!streamId) return;
    const newHomeScore = team === 'home' ? Math.max(0, homeScore + increment) : homeScore;
    const newAwayScore = team === 'away' ? Math.max(0, awayScore + increment) : awayScore;
    
    setHomeScore(newHomeScore);
    setAwayScore(newAwayScore);

    try {
      await supabase
        .from('live_streams')
        .update({ home_score: newHomeScore, away_score: newAwayScore })
        .eq('id', streamId);
    } catch (err) {
      console.error('Error actualizando marcador:', err);
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || !streamId) return;

    try {
      const { error: commentErr } = await supabase
        .from('live_stream_comments')
        .insert([{
          stream_id: streamId,
          user_id: user?.id,
          comment_text: newComment.trim()
        }]);

      if (commentErr) throw commentErr;

      setNewComment('');
      loadComments();
    } catch (err) {
      console.error('Error enviando comentario:', err);
    }
  };

  const handleLike = async () => {
    if (!streamId || !user?.id) return;
    try {
      const { error: likeErr } = await supabase
        .from('live_stream_likes')
        .insert([{ stream_id: streamId, user_id: user.id }]);
      if (likeErr && likeErr.code !== '23505') throw likeErr; // ignora duplicado
      setLikes((prev) => prev + 1);
      await supabase.from('live_streams').update({ likes_count: likes + 1 }).eq('id', streamId);
    } catch (err) {
      console.error('Error agregando like:', err);
    }
  };

  const loadComments = async () => {
    if (!streamId) return;
    try {
      const { data } = await supabase
        .from('live_stream_comments')
        .select('*, user:carfutpro!user_id(nombre, apellido, avatar_url)')
        .eq('stream_id', streamId)
        .order('created_at', { ascending: false })
        .limit(20);
      setComments(data || []);
    } catch (err) {
      console.error('Error cargando comentarios:', err);
    }
  };

  const loadStats = async () => {
    if (!streamId) return;
    try {
      const { data } = await supabase
        .from('live_streams')
        .select('viewers_count, likes_count, home_score, away_score')
        .eq('id', streamId)
        .single();
      if (data) {
        setViewers(data.viewers_count || 0);
        setLikes(data.likes_count || 0);
        setHomeScore(data.home_score || 0);
        setAwayScore(data.away_score || 0);
      }
    } catch (err) {
      console.error('Error cargando métricas:', err);
    }
  };

  const urlLive = `${window.location.origin}/live`;
  const handleCompartir = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Transmisión en Vivo FutPro',
          text: '¡Mira mi transmisión en FutPro!',
          url: urlLive,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(urlLive);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    }
  };

  const startStream = async () => {
    setError('');
    if (!title.trim()) {
      setError('Ingresa un título para la transmisión');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      setStreaming(true);

      // Registrar transmisión en Supabase
      try {
        const { data, error: insertErr } = await supabase
          .from('live_streams')
          .insert([{
            title,
            description,
            status: 'live',
            user_id: user?.id || null,
            home_team_id: homeTeam?.id || null,
            away_team_id: awayTeam?.id || null,
            home_score: 0,
            away_score: 0,
            viewers_count: 0,
            started_at: new Date().toISOString()
          }])
          .select()
          .single();
        if (insertErr) throw insertErr;
        setStreamId(data?.id || null);
        loadComments();
        loadStats();
      } catch (dbErr) {
        console.warn('No se pudo registrar la transmisión:', dbErr);
      }
    } catch (e) {
      setError('No se pudo acceder a la cámara/micrófono.');
    }
  };

    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Video principal */}
        <div>
          <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 16 }}>📡 Transmisión en Vivo</h2>
          
          {!streaming && (
            <div style={{ marginBottom: 16 }}>
              <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Título" style={{ width: '100%', background:'#232323', color:'#FFD700', border:'1px solid #FFD700', borderRadius:8, padding:'12px', marginBottom: 8, fontSize: 16 }} />
              <input value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Descripción" style={{ width: '100%', background:'#232323', color:'#FFD700', border:'1px solid #FFD700', borderRadius:8, padding:'12px', fontSize: 16 }} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                <select value={homeTeam?.id || ''} onChange={(e) => setHomeTeam(teams.find(t => t.id === e.target.value))} style={{ background:'#232323', color:'#FFD700', border:'1px solid #FFD700', borderRadius:8, padding:'12px' }}>
                  <option value="">Equipo Local</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <select value={awayTeam?.id || ''} onChange={(e) => setAwayTeam(teams.find(t => t.id === e.target.value))} style={{ background:'#232323', color:'#FFD700', border:'1px solid #FFD700', borderRadius:8, padding:'12px' }}>
                  <option value="">Equipo Visitante</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>
          )}

          <video ref={videoRef} autoPlay muted style={{ width: '100%', borderRadius: 16, background: '#232323', marginBottom: 16 }} />

          {streaming && homeTeam && awayTeam && (
            <div style={{ background: 'rgba(0,0,0,0.8)', padding: 20, borderRadius: 12, marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>{homeTeam.name}</div>
                  <div style={{ fontSize: 48, fontWeight: 'bold' }}>{homeScore}</div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                    <button onClick={() => updateScore('home', 1)} style={{ background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold' }}>+1</button>
                    <button onClick={() => updateScore('home', -1)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold' }}>-1</button>
                  </div>
                </div>
                <div style={{ fontSize: 32, fontWeight: 'bold' }}>VS</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>{awayTeam.name}</div>
                  <div style={{ fontSize: 48, fontWeight: 'bold' }}>{awayScore}</div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                    <button onClick={() => updateScore('away', 1)} style={{ background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold' }}>+1</button>
                    <button onClick={() => updateScore('away', -1)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold' }}>-1</button>
                  </div>
                </div>
              </div>
            </div>
          )}


    // Actualizar transmisión en Supabase
          <button onClick={startStream} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '14px 40px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>🔴 Iniciar transmisión</button>
      try {
          <button onClick={stopStream} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 40px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>⏹️ Detener transmisión</button>
          .from('live_streams')
          .update({ status: 'ended', ended_at: new Date().toISOString() })
      } catch (updErr) {
          
          {streaming && (
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: 12, borderRadius: 8, display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
              <div>👁️ {viewers} espectadores</div>
              <button onClick={handleLike} style={{ background: '#FFD700', color: '#000', border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer' }}>❤️ {likes} Like</button>
              <div>💬 {comments.length} comentarios</div>
            </div>
          )}

      }
        </div>

        {/* Chat lateral */}
        <div style={{ background: '#232323', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
          <h3 style={{ marginBottom: 16, fontSize: 20 }}>💬 Comentarios en vivo</h3>
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
            {comments.length === 0 ? (
              <div style={{ color: '#666', textAlign: 'center', padding: 32 }}>Sé el primero en comentar</div>
            ) : (
              comments.map(c => (
                <div key={c.id} style={{ marginBottom: 12, background: 'rgba(255,215,0,0.1)', padding: 10, borderRadius: 8 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>
                    {c.user?.nombre || 'Usuario'} {c.user?.apellido || ''}
                  </div>
                  <div style={{ fontSize: 13, color: '#ddd' }}>{c.comment_text}</div>
                </div>
              ))
            )}
          </div>
          {streaming && (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addComment()}
                placeholder="Escribe un comentario..."
                style={{ flex: 1, background: '#1a1a1a', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 10 }}
              />
              <button onClick={addComment} style={{ background: '#FFD700', color: '#000', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar</button>
            </div>
          )}
        </div>
      </div>
  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32, textAlign: 'center' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Transmisión en Vivo</h2>
      <div style={{ display:'flex', justifyContent:'center', gap:12, marginBottom:16, flexWrap:'wrap' }}>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Ej: Equipo A vs Equipo B" style={{ background:'#232323', color:'#FFD700', border:'1px solid #FFD700', borderRadius:8, padding:'8px 12px', flex:1, minWidth:200 }} />
        <input value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Descripción" style={{ background:'#232323', color:'#FFD700', border:'1px solid #FFD700', borderRadius:8, padding:'8px 12px', flex:1, minWidth:200 }} />
      </div>
      {streaming && (
        <div style={{ textAlign:'center', marginBottom:16, color:'#FFD700', fontWeight:'bold' }}>
          🔴 TRANSMITIENDO EN VIVO - {title}
        </div>
      )}
      <video ref={videoRef} autoPlay muted style={{ width: '100%', maxWidth:480, borderRadius: 16, background: '#232323' }} />
      <div style={{ margin: '24px 0', display: 'flex', justifyContent: 'center', gap: 16 }}>
        {!streaming ? (
          <button onClick={startStream} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Iniciar transmisión</button>
        ) : (
          <button onClick={stopStream} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Detener transmisión</button>
        )}
        <button onClick={handleCompartir} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Compartir transmisión</button>
        {copiado && <span style={{ color: '#FFD700', fontSize: 14, alignSelf: 'center' }}>¡Enlace copiado!</span>}
      </div>
      <div style={{ fontSize: 13, color: '#FFD70099', marginBottom: 10 }}>URL: <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{urlLive}</span></div>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      <div style={{ marginTop: 32, color: '#FFD70099' }}>
        * Solo tú puedes ver tu transmisión en este demo local. Para transmitir a otros usuarios se requiere backend.
      </div>
    </div>
  );
}
