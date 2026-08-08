


import { useEffect, useState, useRef } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import FifaCard from "./FifaCard";
import html2canvas from "html2canvas";
import html2canvas from "html2canvas";


function Perfil() {

  const { user } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const navigate = useNavigate();
  const cardRef = useRef();
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Cargar perfil local
    try {
      const p = JSON.parse(localStorage.getItem('perfil'));
      setPerfil(p);
    } catch {
      setPerfil(null);
    }
    // Cargar publicaciones del usuario
    const pubs = JSON.parse(localStorage.getItem('publicaciones') || '[]');
    setPublicaciones(pubs.filter(pub => pub.userId === (user.uid || user.id)));
  }, [user, navigate]);


  if (!perfil) return <div>No se encontró el perfil.</div>;

  // Datos demo para la card (puedes expandir con más campos del perfil)
  const fifaData = {
    nombre: perfil.nombre,
    pais: perfil.pais || "Argentina",
    posicion: perfil.posicion || "Delantero",
    foto: perfil.foto,
    goles: perfil.goles || 10,
    asistencias: perfil.asistencias || 5,
    partidos: perfil.partidos || 20,
    onContact: () => alert("Función de contacto próximamente")
  };

  const handleDescargarCard = async () => {
    setDescargando(true);
    const canvas = await html2canvas(cardRef.current);
    const url = canvas.toDataURL("image/png");
    // Descargar imagen
    const link = document.createElement('a');
    link.href = url;
    link.download = `fifa_card_${perfil.nombre}.png`;
    link.click();
    // Publicar automáticamente la card como publicación
    const nuevaPub = {
      id: Date.now(),
      nombre: perfil.nombre + ' (FIFA Card)',
      tipo: 'foto',
      url,
      descripcion: 'Mi card personalizada de FutPro',
      fecha: new Date().toISOString(),
      userId: user.uid || user.id
    };
    const pubs = JSON.parse(localStorage.getItem('publicaciones') || '[]');
    localStorage.setItem('publicaciones', JSON.stringify([nuevaPub, ...pubs]));
    setDescargando(false);
  };

  // Compartir perfil
  const [copiado, setCopiado] = useState(false);
  const urlPerfil = `${window.location.origin}/perfil/${perfil.nombre?.replace(/\s+/g, '').toLowerCase()}`;
  const handleCompartirPerfil = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil de ${perfil.nombre}`,
          text: '¡Mira mi perfil en FutPro!',
          url: urlPerfil,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(urlPerfil);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    }
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32, borderRadius: 18, maxWidth: 900, margin: 'auto' }}>
      <div ref={cardRef} style={{ display: 'flex', justifyContent: 'center' }}>
        <FifaCard {...fifaData} />
      </div>
      <div style={{ display: 'flex', gap: 12, margin: '18px 0' }}>
        <button onClick={handleDescargarCard} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', cursor: 'pointer' }} disabled={descargando}>
          {descargando ? 'Generando imagen...' : 'Descargar mi FIFA Card'}
        </button>
        <button onClick={handleCompartirPerfil} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', cursor: 'pointer' }}>
          Compartir perfil
        </button>
        {copiado && <span style={{ color: '#FFD700', fontSize: 12 }}>¡Enlace copiado!</span>}
      </div>
      <div style={{ fontSize: 13, color: '#FFD70099', marginBottom: 10 }}>Tu URL: <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{urlPerfil}</span></div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <button onClick={() => navigate("/perfil/editar")}
          style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', cursor: 'pointer' }}>
          Editar perfil
        </button>
        <button onClick={() => navigate("/perfil/subir")}
          style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', cursor: 'pointer' }}>
          Subir foto/video
        </button>
      </div>
      <h3 style={{ marginTop: 32 }}>Mis publicaciones</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {publicaciones.length === 0 && <div>No has subido fotos ni videos.</div>}
        {publicaciones.map(pub => (
          <div key={pub.id} style={{ background: '#232323', borderRadius: 12, padding: 12, width: 220, boxShadow: '0 2px 12px #FFD70033' }}>
            {pub.tipo === 'foto' && <img src={pub.url} alt={pub.nombre} style={{ width: '100%', borderRadius: 8, border: '2px solid #FFD700' }} />}
            {pub.tipo === 'video' && <video src={pub.url} controls style={{ width: '100%', borderRadius: 8, border: '2px solid #FFD700' }} />}
            <div style={{ fontWeight: 'bold', marginTop: 8 }}>{pub.nombre}</div>
            {/* Mostrar etiquetas si existen */}
            {pub.etiquetas && pub.etiquetas.length > 0 && (
              <div style={{ margin: '6px 0' }}>
                {pub.etiquetas.map((tag, i) => (
                  <span key={i} style={{ background: '#FFD700', color: '#232323', borderRadius: 6, padding: '2px 8px', marginRight: 6, fontSize: 12 }}>@{tag}</span>
                ))}
              </div>
            )}
            <div style={{ fontSize: 12, color: '#FFD70099' }}>{new Date(pub.fecha).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Perfil;
