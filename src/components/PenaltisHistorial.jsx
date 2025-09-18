
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function PenaltisHistorial() {
  const { user } = useContext(AuthContext);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetch(`/api/penaltis/historial/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar historial");
        return res.json();
      })
      .then(data => {
        setHistorial(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, navigate]);

  if (loading) return <div>Cargando historial...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!historial.length) return <div>No hay partidas registradas.</div>;

  return (
    <div>
      <h2>Historial de penaltis</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Resultado</th>
            <th>Intentos</th>
          </tr>
        </thead>
        <tbody>
          {historial.map(h => (
            <tr key={h.id}>
              <td>{h.fecha}</td>
              <td>{h.resultado}</td>
              <td>{h.intentos}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate("/penaltis/jugar")}>Jugar penaltis</button>
      {/* Panel extra para admin */}
      {user.rol === "admin" && (
        <div style={{marginTop:20, padding:10, border:"1px solid #ccc"}}>
          <h3>Panel de gestión de historial</h3>
          <button onClick={() => navigate("/admin/penaltis/historial")}>Ver historial global</button>
        </div>
      )}
    </div>
  );
}

export default PenaltisHistorial;
