import React, { useState, useRef } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const HistoriasComponent = ({ onClose }) => {
  const { user } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);
  const [modo, setModo] = useState('menu');
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const GOLD = '#FFD700';

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setError('El archivo no debe superar 50MB');
      return;
    }

    setArchivo(file);
    setPreview(URL.createObjectURL(file));
    setModo(file.type.startsWith('video') ? 'video' : 'foto');
    setError('');
    setSuccess('');
  };

  const subirHistoria = async () => {
    setError('');
    setSuccess('');

    if (!user) {
      setError('Debes iniciar sesión');
      return;
    }

    if (!archivo) {
      setError('Selecciona un archivo');
      return;
    }

    setLoading(true);
    setProgress(10);

    try {
      const extension = archivo.name?.split('.').pop() || 'dat';
      const tipo = archivo.type.startsWith('video') ? 'video' : 'image';
      const nombreArchivo = `historia-${Date.now()}.${extension}`;
      const ruta = `${user.id}/historias/${nombreArchivo}`;

      // Subir a storage
      const { error: uploadError } = await supabase.storage
        .from('contenido')
        .upload(ruta, archivo);

      if (uploadError) throw uploadError;

      setProgress(60);

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('contenido')
        .getPublicUrl(ruta);

      // Registrar en tabla stories
      const { error: storyError } = await supabase
        .from('stories')
        .insert([{
          user_id: user.id,
          media_url: urlData.publicUrl,
          media_type: tipo,
          caption: '',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }]);

      if (storyError) throw storyError;

      setProgress(100);
      setSuccess('✅ Historia publicada por 24 horas');

      setTimeout(() => {
        onClose?.();
        resetForm();
      }, 1200);
    } catch (err) {
      console.error('Error subiendo historia:', err);
      setError('Error: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setArchivo(null);
    setPreview(null);
    setProgress(0);
    setError('');
    setSuccess('');
    setModo('menu');
  };

  if (isMinimized) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed',
          bottom: 150,
          right: 20,
          zIndex: 999,
          background: GOLD,
          borderRadius: '50%',
          width: 60,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(255,215,0,0.4)',
          fontSize: 28
        }}
      >
        📖
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          position: 'fixed',
          bottom: 150,
          right: 20,
          zIndex: 999,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
          borderRadius: 16,
          border: `2px solid ${GOLD}`,
          boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
          width: 340
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: `1px solid ${GOLD}33`,
          background: GOLD,
          borderRadius: '14px 14px 0 0'
        }}>
          <h3 style={{ margin: 0, color: '#000', fontSize: 12, fontWeight: 800 }}>📖 Historias (24h)</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setIsMinimized(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 0 }}
            >
              _
            </button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 0 }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div style={{ padding: 12, maxHeight: '65vh', overflowY: 'auto' }}>
          {modo === 'menu' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                onClick={() => { setModo('foto'); fileInputRef.current?.click(); }}
                style={{
                  padding: 12,
                  background: `linear-gradient(135deg, ${GOLD}, #FFB347)`,
                  border: 'none',
                  borderRadius: 8,
                  color: '#000',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 11
                }}
              >
                📷 Foto
              </button>
              <button
                onClick={() => { setModo('video'); fileInputRef.current?.click(); }}
                style={{
                  padding: 12,
                  background: 'linear-gradient(135deg, #64c8ff, #00BFFF)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#000',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 11
                }}
              >
                🎥 Video
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

          {(modo === 'foto' || modo === 'video') && !preview && (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: 24,
                border: `2px dashed ${GOLD}`,
                borderRadius: 8,
                cursor: 'pointer',
                background: 'rgba(255,215,0,0.05)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>
                {modo === 'video' ? '🎬' : '📷'}
              </div>
              <div style={{ color: GOLD, fontWeight: 700, fontSize: 11 }}>
                Tap para seleccionar
              </div>
            </div>
          )}

          {preview && (
            <div>
              <div style={{
                marginBottom: 8,
                borderRadius: 8,
                overflow: 'hidden',
                border: `1px solid ${GOLD}`,
                height: 140
              }}>
                {modo === 'video' ? (
                  <video src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls />
                ) : (
                  <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>

              {error && (
                <div style={{
                  marginBottom: 8,
                  padding: 6,
                  background: '#FF6B6B',
                  color: '#fff',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 700
                }}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{
                  marginBottom: 8,
                  padding: 6,
                  background: '#2ecc71',
                  color: '#000',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 700
                }}>
                  {success}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <button
                  onClick={resetForm}
                  disabled={loading}
                  style={{
                    padding: 10,
                    background: '#333',
                    border: 'none',
                    borderRadius: 6,
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 11,
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  ← Atrás
                </button>
                <button
                  onClick={subirHistoria}
                  disabled={loading || !archivo}
                  style={{
                    padding: 10,
                    background: GOLD,
                    border: 'none',
                    borderRadius: 6,
                    color: '#000',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 11,
                    opacity: loading || !archivo ? 0.6 : 1
                  }}
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
};

export default HistoriasComponent;
