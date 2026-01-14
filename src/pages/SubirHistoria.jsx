import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

export default function SubirHistoria() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 50 * 1024 * 1024) {
      setError('El archivo no debe superar 50MB');
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Selecciona una imagen o video');
      return;
    }

    setUploading(true);
    setProgress(10);
    setError('');

    try {
      const ext = file.name.split('.').pop();
      const mediaType = file.type.startsWith('video') ? 'video' : 'image';
      const fileName = `${user?.id}-${Date.now()}.${ext}`;
      const filePath = `stories/${fileName}`;

      // Subir a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('contenido')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setProgress(60);

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('contenido')
        .getPublicUrl(filePath);

      // Crear registro en tabla stories
      const { error: dbError } = await supabase
        .from('stories')
        .insert([{
          user_id: user?.id,
          media_url: urlData.publicUrl,
          media_type: mediaType,
          caption: caption.trim() || null
        }]);

      if (dbError) throw dbError;

      setProgress(100);
      setSuccess('✅ ¡Historia publicada! Se eliminará en 24 horas.');

      setTimeout(() => {
        navigate('/feed');
      }, 1500);
    } catch (err) {
      console.error('Error subiendo historia:', err);
      setError('Error al publicar: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', padding: '32px 16px', color: '#fff' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={() => navigate('/feed')} style={{ background: '#333', color: '#FFD700', border: 'none', borderRadius: '8px', padding: '8px 16px', marginBottom: '16px', cursor: 'pointer' }}>
          ← Volver
        </button>

        <h1 style={{ fontSize: '2rem', color: '#FFD700', marginBottom: '24px' }}>📖 Subir Historia</h1>

        {!preview ? (
          <div 
            onClick={() => document.getElementById('storyInput').click()}
            style={{ 
              border: '3px dashed #FFD700', 
              borderRadius: '16px', 
              padding: '64px 32px', 
              textAlign: 'center', 
              cursor: 'pointer',
              background: 'rgba(255,215,0,0.05)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,215,0,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,215,0,0.05)'}
          >
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📷</div>
            <div style={{ color: '#FFD700', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>
              Haz click para seleccionar
            </div>
            <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
              Imagen o video (máx. 50MB)
            </div>
          </div>
        ) : (
          <div>
            <div style={{ position: 'relative', marginBottom: '16px', borderRadius: '16px', overflow: 'hidden', border: '3px solid #FFD700' }}>
              {file?.type.startsWith('video') ? (
                <video src={preview} controls style={{ width: '100%', display: 'block' }} />
              ) : (
                <img src={preview} alt="preview" style={{ width: '100%', display: 'block' }} />
              )}
            </div>

            <textarea
              placeholder="Agrega un texto a tu historia (opcional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={uploading}
              maxLength={200}
              style={{ width: '100%', height: '80px', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '2px solid #FFD700', background: '#1a1a1a', color: '#fff', fontSize: '1rem', resize: 'none', boxSizing: 'border-box' }}
            />

            {error && <div style={{ background: '#e74c3c', color: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}
            {success && <div style={{ background: '#2ecc71', color: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 'bold' }}>{success}</div>}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => { setFile(null); setPreview(null); setCaption(''); setError(''); }}
                disabled={uploading}
                style={{ flex: 1, background: '#333', color: '#FFD700', border: 'none', borderRadius: '8px', padding: '14px', fontWeight: 'bold', cursor: 'pointer', opacity: uploading ? 0.6 : 1 }}
              >
                ↺ Cambiar
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !file}
                style={{ flex: 2, background: uploading ? '#666' : '#FFD700', color: '#000', border: 'none', borderRadius: '8px', padding: '14px', fontWeight: 'bold', cursor: 'pointer', opacity: (uploading || !file) ? 0.6 : 1 }}
              >
                {uploading ? `Publicando... ${progress}%` : '✅ Publicar Historia'}
              </button>
            </div>

            <div style={{ marginTop: '16px', color: '#aaa', fontSize: '0.85rem', textAlign: 'center' }}>
              ⏱️ Tu historia se eliminará automáticamente en 24 horas
            </div>
          </div>
        )}

        <input
          id="storyInput"
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
