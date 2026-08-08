
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function EstadisticasPanel() {
  const { user } = useContext(AuthContext);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetch(`/api/estadisticas/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar estadísticas");
        return res.json();
      })
      .then(data => {
        setEstadisticas(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, navigate]);

  if (loading) return <div>Cargando estadísticas...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!estadisticas) return <div>No hay estadísticas disponibles.</div>;

  return (
    <div>
      <h2>Estadísticas Globales</h2>
      <ul>
        <li>Partidos jugados: {estadisticas.partidos}</li>
        <li>Goles: {estadisticas.goles}</li>
        <li>Asistencias: {estadisticas.asistencias}</li>
        <li>Tarjetas: {estadisticas.tarjetas}</li>
        <li>Minutos jugados: {estadisticas.minutos}</li>
        {/* ...otros datos */}
      </ul>
      <button onClick={() => navigate("/estadisticas/comparativa")}>Comparar estadísticas</button>
      <button onClick={() => navigate("/estadisticas/editar")}>Editar estadísticas</button>
      {/* Panel extra para admin */}
      {user.rol === "admin" && (
        <div style={{marginTop:20, padding:10, border:"1px solid #ccc"}}>
          <h3>Panel de métricas globales</h3>
          <button onClick={() => navigate("/admin/estadisticas")}>Ver métricas avanzadas</button>
        </div>
      )}
    </div>
  );
}

export default EstadisticasPanel;
