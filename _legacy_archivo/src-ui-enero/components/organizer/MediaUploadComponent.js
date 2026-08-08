import React, { useState } from 'react';
import mediaService from '../../services/mediaService';

const MediaUploadComponent = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      await mediaService.uploadMedia(files);
      setMessage('¡Subida exitosa!');
    } catch (err) {
      setMessage('Error al subir archivos');
    }
    setUploading(false);
  };

  return (
    <div>
      <h2>Subir Fotos/Videos</h2>
      <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>Subir</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MediaUploadComponent;
