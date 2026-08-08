import React, { useState } from 'react';
import Button from '../components/Button';

const gold = '#FFD700';
const black = '#222';


export default function MediaPage() {
  const [media, setMedia] = useState([
    { id: 1, nombre: 'Foto equipo', tipo: 'imagen' },
    { id: 2, nombre: 'Video gol', tipo: 'video' },
  ]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadMsg('Subiendo...');
    // Simulación de subida, aquí iría la llamada real al backend
    setTimeout(() => {
      setMedia(prev => [
        ...prev,
        { id: prev.length + 1, nombre: file.name, tipo: file.type.startsWith('image') ? 'imagen' : 'video', url: preview }
      ]);
      setUploading(false);
      setUploadMsg('¡Archivo subido!');
      setFile(null);
      setPreview(null);
      setTimeout(() => setUploadMsg(''), 1500);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Media</h2>
        <div style={{ marginBottom: 24 }}>
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} style={{ color: gold, marginBottom: 8 }} />
          {preview && (
            <div style={{ margin: '12px 0' }}>
              {file && file.type.startsWith('image') ? (
                <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8 }} />
              ) : (
                <video src={preview} controls style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8 }} />
              )}
            </div>
          )}
          <Button onClick={handleUpload} disabled={!file || uploading} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', transition: 'background 0.3s, color 0.3s', marginTop: 8 }}>
            {uploading ? 'Subiendo...' : 'Subir media'}
          </Button>
          {uploadMsg && <div style={{ color: gold, marginTop: 8, fontWeight: 'bold' }}>{uploadMsg}</div>}
        </div>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1>Media</h1>
          <ul>
            {media.map(m => (
              <li key={m.id} style={{ marginBottom: 12 }}>
                <strong>{m.nombre}</strong> <span style={{ color: black, background: gold, borderRadius: 6, padding: '2px 8px', marginLeft: 8 }}>{m.tipo}</span>
                {m.url && m.tipo === 'imagen' && <img src={m.url} alt={m.nombre} style={{ display: 'block', maxWidth: 120, maxHeight: 80, marginTop: 8, borderRadius: 6 }} />}
                {m.url && m.tipo === 'video' && <video src={m.url} controls style={{ display: 'block', maxWidth: 120, maxHeight: 80, marginTop: 8, borderRadius: 6 }} />}
              </li>
            ))}
          </ul>
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', transition: 'background 0.3s, color 0.3s' }}>Ver reportes</Button>
      </aside>
    </div>
  );
}