import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AmigosPanel() {
  const { user } = useContext(AuthContext);
  const [amigos, setAmigos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetch(`/api/amigos/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar amigos");
        return res.json();
      })
      .then(data => {
        setAmigos(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, navigate]);

  if (loading) return <div>Cargando amigos...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!amigos.length) return <div>No tienes amigos agregados.</div>;

  return (
    <div>
      <h2>Mis amigos</h2>
      <ul>
        {amigos.map(a => (
          <li key={a.id}>{a.nombre} ({a.estado})</li>
        ))}
      </ul>
      <button onClick={() => navigate("/amigos/agregar")}>Agregar amigo</button>
      <button onClick={() => navigate("/amistosos")}>Ver amistosos</button>
      {/* Panel extra para admin */}
      {user.rol === "admin" && (
        <div style={{marginTop:20, padding:10, border:"1px solid #ccc"}}>
          <h3>Panel de gestión de amistades</h3>
          <button onClick={() => navigate("/admin/amigos")}>Ver todos los usuarios</button>
        </div>
      )}
    </div>
  );
}

export default AmigosPanel;
