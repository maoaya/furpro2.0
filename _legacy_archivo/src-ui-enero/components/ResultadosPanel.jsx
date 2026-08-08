
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ResultadosPanel() {
  const { user } = useContext(AuthContext);
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetch(`/api/resultados/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar resultados");
        return res.json();
      })
      .then(data => {
        setResultados(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, navigate]);

  if (loading) return <div>Cargando resultados...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!resultados.length) return <div>No hay resultados disponibles.</div>;

  return (
    <div>
      <h2>Resultados de partidos</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Equipo local</th>
            <th>Equipo visitante</th>
            <th>Marcador</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map(r => (
            <tr key={r.id}>
              <td>{r.fecha}</td>
              <td>{r.local}</td>
              <td>{r.visitante}</td>
              <td>{r.marcador}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate("/partidos")}>Ver partidos</button>
      {/* Panel extra para admin */}
      {user.rol === "admin" && (
        <div style={{marginTop:20, padding:10, border:"1px solid #ccc"}}>
          <h3>Panel de gestión de resultados</h3>
          <button onClick={() => navigate("/admin/resultados")}>Ver todos los resultados</button>
        </div>
      )}
    </div>
  );
}

export default ResultadosPanel;
