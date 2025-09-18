

import { useContext, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

function SubirFotoVideo() {
  const { user } = useAuth();
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  if (!user) return <div>Debes iniciar sesión para subir archivos.</div>;

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/png", "video/mp4"].includes(file.type) && file.size < 5 * 1024 * 1024) {
      setArchivo(file);
      setPreview(URL.createObjectURL(file));
      setError("");
    } else {
      setError("Archivo no permitido o demasiado grande (máx 5MB)");
      setArchivo(null);
      setPreview(null);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!archivo) {
      setError("Debes seleccionar un archivo válido");
      return;
    }
    setLoading(true);
    // Leer archivo como base64
    const reader = new FileReader();
    reader.onload = function(ev) {
      // Guardar en localStorage
      const publicaciones = JSON.parse(localStorage.getItem('publicaciones') || '[]');
      publicaciones.unshift({
        id: Date.now(),
        userId: user?.uid || user?.id,
        tipo: archivo.type.startsWith('image') ? 'foto' : 'video',
        url: ev.target.result,
        nombre: archivo.name,
        fecha: new Date().toISOString(),
      });
      localStorage.setItem('publicaciones', JSON.stringify(publicaciones));
      setLoading(false);
      setMensaje("Archivo subido correctamente");
      setArchivo(null);
      setPreview(null);
      setTimeout(() => navigate("/perfil"), 1500);
    };
    reader.readAsDataURL(archivo);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/jpeg,image/png,video/mp4" onChange={handleFileChange} />
      {preview && (
        <div>
          {archivo && archivo.type.startsWith("image") ? (
            <img src={preview} alt="Previsualización" width={100} />
          ) : (
            <video src={preview} width={200} controls />
          )}
        </div>
      )}
      {error && <span>{error}</span>}
      <button type="submit" disabled={loading}>Subir</button>
      <button type="button" onClick={() => navigate("/perfil")}>Cancelar</button>
      {mensaje && <div>{mensaje}</div>}
    </form>
  );
}

export default SubirFotoVideo;
