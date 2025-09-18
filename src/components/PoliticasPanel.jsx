
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function PoliticasPanel() {
  const { user } = useContext(AuthContext);
  const [politicas, setPoliticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/politicas")
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar políticas");
        return res.json();
      })
      .then(data => {
        setPoliticas(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando políticas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Información legal, políticas y privacidad</h2>
      <ul>
        {politicas.map(p => (
          <li key={p.id}><strong>{p.titulo}</strong>: {p.descripcion}</li>
        ))}
      </ul>
      <button onClick={() => navigate("/perfil")}>Volver al perfil</button>
      {/* Panel extra para admin */}
      {user && user.rol === "admin" && (
        <div style={{marginTop:20, padding:10, border:"1px solid #ccc"}}>
          <h3>Panel de gestión de políticas</h3>
          <button onClick={() => navigate("/admin/politicas")}>Editar políticas</button>
        </div>
      )}
    </div>
  );
}

export default PoliticasPanel;
