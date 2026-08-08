import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

const GOLD = '#FFD700';

export default function UploadContenidoComponent({ onClose }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [modo, setModo] = useState('menu');
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const resetForm = () => {
    setArchivo(null);
    setPreview(null);
    setDescripcion('');
    setUbicacion('');
    setProgress(0);
    setError('');
    setSuccess('');
    setModo('menu');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setArchivo(file);
    setPreview(URL.createObjectURL(file));
    setModo(file.type.startsWith('video') ? 'video' : 'foto');
    setError('');
    setSuccess('');
  };

  const handlePublicar = async () => {
    setError('');
    setSuccess('');

    if (!user) {
      setError('⚠️ Debes iniciar sesión.');
      return;
    }

    if (!archivo) {
      setError('Selecciona un archivo para publicar.');
      return;
    }

    setLoading(true);
    setProgress(5);

    try {
      const extension = archivo.name?.split('.').pop() || 'dat';
      const tipo = archivo.type.startsWith('video') ? 'video' : 'foto';
      const nombreArchivo = `${tipo}-${Date.now()}.${extension}`;
      const ruta = `${user.id}/${tipo}/${nombreArchivo}`;

      const { error: uploadError } = await supabase.storage
        .from('contenido')
        .upload(ruta, archivo);

      if (uploadError) throw uploadError;

      setProgress(60);

      const { data: urlData } = supabase.storage
        .from('contenido')
        .getPublicUrl(ruta);

      const { data: inserted, error: postError } = await supabase.from('posts').insert([{
        user_id: user.id,
        contenido: descripcion.trim() || 'Sin descripción',
        imagen_url: urlData.publicUrl,
        media_type: tipo,
        ubicacion: ubicacion?.trim() || null
      }]).select();

      if (postError) throw postError;

      setProgress(100);
      setSuccess('✅ ¡Publicado exitosamente!');

      // Sincronizar con homepage y momentos del usuario
      try {
        const postId = inserted?.[0]?.id || `post-${Date.now()}`;
        
        // Obtener datos del autor desde carfutpro
        let autorNombre = user.user_metadata?.name || user.email || 'Usuario';
        let autorAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
        try {
          const { data: cardData } = await supabase
            .from('carfutpro')
            .select('nombre, apellido, avatar_url, photo_url')
            .eq('user_id', user.id)
            .single();
          if (cardData) {
            autorNombre = `${cardData.nombre || ''} ${cardData.apellido || ''}`.trim() || autorNombre;
            autorAvatar = cardData.photo_url || cardData.avatar_url || autorAvatar;
          }
        } catch (_) {}

        // 1. Agregar a feed global (homepage)
        const stored = JSON.parse(localStorage.getItem('futpro_publicaciones_globales') || '[]');
        const nuevaPub = {
          id: postId,
          user_id: user.id,
          tipo: tipo === 'video' ? 'video' : 'imagen',
          archivo: urlData.publicUrl,
          autorNombre,
          autorAvatar: autorAvatar || `https://i.pravatar.cc/300?u=${user.id}`,
          ubicacion: ubicacion?.trim() || '',
          fecha: new Date().toISOString(),
          pie: descripcion.trim(),
          numerales: ''
        };
        const next = [nuevaPub, ...stored].slice(0, 50);
        localStorage.setItem('futpro_publicaciones_globales', JSON.stringify(next));

        // 2. Agregar a momentos del usuario
        try {
          await supabase
            .from('post_moments')
            .insert([{
              user_id: user.id,
              post_id: postId,
              added_at: new Date().toISOString()
            }]);
        } catch (momentErr) {
          console.warn('No se pudo agregar a momentos:', momentErr);
        }
      } catch (e) {
        console.warn('No se pudo sincronizar:', e);
      }

      setTimeout(() => {
        onClose?.();
        resetForm();
      }, 1200);
    } catch (err) {
      console.error('Error publicando:', err);
      setError('Error al publicar: ' + (err.message || 'Intenta nuevamente'));
    } finally {
      setLoading(false);
    }
  };

  if (isMinimized) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed', bottom: 80, right: 20, zIndex: 999,
          background: GOLD, borderRadius: '50%', width: 60, height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,215,0,0.4)', fontSize: 28
        }}
      >
        📸
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          position: 'fixed', bottom: 80, right: 20, zIndex: 999,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
          borderRadius: 16, border: `2px solid ${GOLD}`,
          boxShadow: '0 10px 40px rgba(0,0,0,0.7)', width: 360
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid ${GOLD}33`, background: GOLD, borderRadius: '14px 14px 0 0' }}>
          <h3 style={{ margin: 0, color: '#000', fontSize: 12, fontWeight: 800 }}>📸 Contenido</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setIsMinimized(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 0 }}>_</button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 0 }}>×</button>
          </div>
        </div>

        <div style={{ padding: 12, maxHeight: '65vh', overflowY: 'auto' }}>
          {modo === 'menu' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                onClick={() => { setModo('foto'); fileInputRef.current?.click(); }}
                style={{ padding: 12, background: `linear-gradient(135deg, ${GOLD}, #FFB347)`, border: 'none', borderRadius: 8, color: '#000', cursor: 'pointer', fontWeight: 700, fontSize: 11 }}
              >
                📷 Foto (Galería)
              </button>
              <button
                onClick={() => { setModo('video'); fileInputRef.current?.click(); }}
                style={{ padding: 12, background: 'linear-gradient(135deg, #64c8ff, #00BFFF)', border: 'none', borderRadius: 8, color: '#000', cursor: 'pointer', fontWeight: 700, fontSize: 11 }}
              >
                🎥 Video (Galería)
              </button>
              <button
                onClick={() => { setModo('historia'); fileInputRef.current?.click(); }}
                style={{ padding: 12, background: 'rgba(255,165,0,0.1)', border: '1px solid #FFA500', borderRadius: 8, color: '#FFA500', cursor: 'pointer', fontWeight: 700, fontSize: 11, gridColumn: '1 / 3' }}
              >
                📖 Historia
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept={modo === 'video' ? 'video/*' : 'image/*'}
            capture={modo === 'video' ? 'camcorder' : 'environment'}
            style={{ display: 'none' }}
          />

          {(modo === 'foto' || modo === 'video' || modo === 'historia') && !preview && (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: 24, border: `2px dashed ${GOLD}`, borderRadius: 8, cursor: 'pointer', background: 'rgba(255,215,0,0.05)', textAlign: 'center' }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{modo === 'video' ? '🎬' : '📷'}</div>
              <div style={{ color: GOLD, fontWeight: 700, fontSize: 11 }}>Haz click para seleccionar</div>
            </div>
          )}

          {(modo === 'foto' || modo === 'video' || modo === 'historia') && preview && (
            <div>
              <div style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden', border: `1px solid ${GOLD}`, height: 140 }}>
                {modo === 'video' ? (
                  <video src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls />
                ) : (
                  <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>

              <textarea
                placeholder="Descripción..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                disabled={loading}
                style={{ width: '100%', height: 50, padding: 6, marginBottom: 8, borderRadius: 6, border: `1px solid ${GOLD}`, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11, resize: 'none', boxSizing: 'border-box', fontFamily: 'Arial' }}
                maxLength={150}
              />

              <input
                type="text"
                placeholder="Ubicación (opcional)"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                disabled={loading}
                style={{ width: '100%', padding: 8, marginBottom: 8, borderRadius: 6, border: `1px solid ${GOLD}`, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11, boxSizing: 'border-box', fontFamily: 'Arial' }}
              />

              {error && (
                <div style={{ marginBottom: 8, padding: 6, background: '#FF6B6B', color: '#fff', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{ marginBottom: 8, padding: 6, background: '#2ecc71', color: '#000', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                  {success}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <button
                  onClick={resetForm}
                  disabled={loading}
                  style={{ padding: 10, background: '#333', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 11, opacity: loading ? 0.6 : 1 }}
                >
                  ← Atrás
                </button>
                <button
                  onClick={handlePublicar}
                  disabled={loading || !archivo}
                  style={{ padding: 10, background: GOLD, border: 'none', borderRadius: 6, color: '#000', cursor: 'pointer', fontWeight: 700, fontSize: 11, opacity: loading || !archivo ? 0.6 : 1 }}
                >
                  {loading ? `${progress}%` : 'Publicar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

