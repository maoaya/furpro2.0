
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LogrosEquipo() {
  const { user, role, equipoId } = useContext(AuthContext);
  const [logros, setLogros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!equipoId) {
      setError("No tienes equipo asignado.");
      setLogros([]);
      setLoading(false);
      return;
    }
    // Supabase: cargar logros del equipo del usuario
    fetch(`/api/logros/equipo/${equipoId}`)
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar logros de equipo");
        return res.json();
      })
      .then(data => {
        setLogros(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, equipoId, navigate]);

  if (loading) return <div>Cargando logros de equipo...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!logros.length) return <div>No hay logros de equipo.</div>;

  return (
    <div>
      <h2>Logros del equipo</h2>
      <ul>
        {logros.map(l => (
          <li key={l.id}>{l.nombre} - {l.descripcion}</li>
        ))}
      </ul>
      <button onClick={() => navigate("/logros")}>Ver logros personales</button>
      {/* Panel extra para admin/manager */}
      {(role === "admin" || role === "manager") && (
        <div style={{marginTop:20, padding:10, border:"1px solid #ccc"}}>
          <h3>Panel de gestión de logros de equipo</h3>
          <button onClick={() => navigate("/admin/logros/equipo")}>Ver todos los logros de equipo</button>
        </div>
      )}
    </div>
  );
}

export default LogrosEquipo;
