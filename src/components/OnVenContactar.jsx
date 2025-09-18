
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

function OnVenContactar() {
  const { user } = useContext(AuthContext);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { ofertaId } = useParams();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!mensaje.trim()) {
      setError("El mensaje es obligatorio");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/mercado/contactar/${ofertaId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ mensaje })
      });
      if (!res.ok) throw new Error("Error al enviar mensaje");
      setSuccess("Mensaje enviado correctamente");
      setMensaje("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Contactar vendedor/servicio</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={mensaje}
          onChange={e => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar mensaje"}</button>
      </form>
      {error && <div style={{color:"red"}}>{error}</div>}
      {success && <div style={{color:"green"}}>{success}</div>}
      <button onClick={() => navigate("/mercado")}>Volver al mercado</button>
      {/* Panel extra para admin */}
      {user.rol === "admin" && (
        <div style={{marginTop:20, padding:10, border:"1px solid #ccc"}}>
          <h3>Panel de gestión de contactos</h3>
          <button onClick={() => navigate("/admin/contactos")}>Ver todos los mensajes</button>
        </div>
      )}
    </div>
  );
}

export default OnVenContactar;
