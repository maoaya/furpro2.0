import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

export default function CrearPublicacion() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mediaType, setMediaType] = useState('imagen'); // 'imagen' o 'video'
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      setError('Solo se permiten imágenes o videos');
      return;
    }

    // Validar tamaño (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      setError('El archivo no puede superar los 50MB');
      return;
    }

    setMediaFile(file);
    setMediaType(isImage ? 'imagen' : 'video');
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;
    
    if (tags.length >= 10) {
      setError('Máximo 10 etiquetas');
      return;
    }

    if (tags.includes(tag)) {
      setError('Esta etiqueta ya existe');
      return;
    }

    setTags([...tags, tag]);
    setTagInput('');
    setError('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!caption.trim()) {
      setError('Escribe un pie de foto');
      return;
    }

    if (!mediaFile && !mediaUrl) {
      setError('Selecciona una imagen o video');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let finalMediaUrl = mediaUrl;

      // Si hay archivo, subirlo a Supabase Storage
      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const filePath = `posts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, mediaFile);

        if (uploadError) throw uploadError;

        // Obtener URL pública
        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        finalMediaUrl = urlData.publicUrl;
      }

      // Crear post
      const { error: insertError } = await supabase
        .from('posts')
        .insert([{
          user_id: user.id,
          content: caption,
          image_url: mediaType === 'imagen' ? finalMediaUrl : null,
          video_url: mediaType === 'video' ? finalMediaUrl : null,
          tags: tags,
          created_at: new Date().toISOString()
        }]);

      if (insertError) throw insertError;

      // Redirigir al feed
      navigate('/');
    } catch (err) {
      console.error('Error creando publicación:', err);
      setError('Error al crear la publicación. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      padding: '32px 16px',
      color: '#fff'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFD700',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ← Volver
          </button>
          <h1 style={{
            fontSize: '32px',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            📸 Nueva Publicación
          </h1>
          <div style={{ width: '60px' }} />
        </div>

        <form onSubmit={handleSubmit} style={{
          background: '#181818',
          border: '2px solid #FFD700',
          borderRadius: '16px',
          padding: '32px'
        }}>
          {/* Preview Area */}
          <div style={{
            background: '#0a0a0a',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            border: '2px dashed #333'
          }}>
            {previewUrl ? (
              <div style={{ width: '100%', position: 'relative' }}>
                {mediaType === 'imagen' ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={{
                      width: '100%',
                      maxHeight: '400px',
                      objectFit: 'contain',
                      borderRadius: '8px'
                    }}
                  />
                ) : (
                  <video 
                    src={previewUrl} 
                    controls
                    style={{
                      width: '100%',
                      maxHeight: '400px',
                      borderRadius: '8px'
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl('');
                    setMediaFile(null);
                    setMediaUrl('');
                  }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0,0,0,0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    color: '#fff',
                    fontSize: '20px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                  📷
                </div>
                <div style={{ color: '#aaa', marginBottom: '16px' }}>
                  Sube una foto o video
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#000',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Seleccionar archivo
                </button>
                <div style={{ color: '#666', fontSize: '12px', marginTop: '12px' }}>
                  o pega una URL
                </div>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => {
                    setMediaUrl(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    marginTop: '12px'
                  }}
                />
              </div>
            )}
          </div>

          {/* Caption */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#FFD700',
              marginBottom: '8px',
              fontWeight: 'bold'
            }}>
              📝 Pie de foto *
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Escribe un pie de foto..."
              required
              maxLength={2200}
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '15px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            <div style={{
              textAlign: 'right',
              color: '#666',
              fontSize: '12px',
              marginTop: '4px'
            }}>
              {caption.length}/2200
            </div>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#FFD700',
              marginBottom: '8px',
              fontWeight: 'bold'
            }}>
              🏷️ Etiquetas (Opcional)
            </label>
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Escribe una etiqueta..."
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#0a0a0a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '15px'
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                style={{
                  background: '#FFD700',
                  color: '#000',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Agregar
              </button>
            </div>
            
            {/* Tags list */}
            {tags.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {tags.map((tag, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      color: '#000',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      style={{
                        background: 'rgba(0,0,0,0.2)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div style={{
              color: '#666',
              fontSize: '12px',
              marginTop: '8px'
            }}>
              {tags.length}/10 etiquetas
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#ff3366',
              color: '#fff',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Info */}
          <div style={{
            background: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid #FFD700',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '24px',
            fontSize: '13px',
            color: '#aaa'
          }}>
            💡 <strong style={{ color: '#FFD700' }}>Consejos:</strong><br/>
            • Usa hashtags relevantes para que más personas vean tu publicación<br/>
            • Escribe pies de foto descriptivos y atractivos<br/>
            • Las imágenes de alta calidad obtienen más interacción
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                background: '#333',
                color: '#fff',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#666' : 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: loading ? '#aaa' : '#000',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(255,215,0,0.3)'
              }}
            >
              {loading ? '📤 Publicando...' : '📤 Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
