
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function JugadoresInvitados() {
  const { user } = useContext(AuthContext);
  const [invitados, setInvitados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetch(`/api/invitados/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar invitados");
        return res.json();
      })
      .then(data => {
        setInvitados(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, navigate]);

  if (loading) return <div>Cargando jugadores invitados...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!invitados.length) return <div>No hay jugadores invitados.</div>;

  return (
    <div>
      <h2>Jugadores invitados</h2>
      <ul>
        {invitados.map(i => (
          <li key={i.id}>{i.nombre} ({i.estado})</li>
        ))}
      </ul>
      <button onClick={() => navigate("/invitados/agregar")}>Agregar invitado</button>
      {/* Panel extra para admin */}
      {user.rol === "admin" && (
        <div style={{marginTop:20, padding:10, border:"1px solid #ccc"}}>
          <h3>Panel de gestión de invitados</h3>
          <button onClick={() => navigate("/admin/invitados")}>Ver todos los invitados</button>
        </div>
      )}
    </div>
  );
}

export default JugadoresInvitados;
