
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProgresoPanel() {
  const { user } = useContext(AuthContext);
  const [progreso, setProgreso] = useState(null);
  const [logros, setLogros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    Promise.all([
      fetch(`/api/progreso/${user.id}`).then(res => {
        if (!res.ok) throw new Error("Error al cargar progreso");
        return res.json();
      }),
      fetch(`/api/logros/${user.id}`).then(res => {
        if (!res.ok) throw new Error("Error al cargar logros");
        return res.json();
      })
    ])
      .then(([progresoData, logrosData]) => {
        setProgreso(progresoData);
        setLogros(logrosData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, navigate]);

  if (loading) return <div>Cargando progreso y logros...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!progreso) return <div>No hay datos de progreso disponibles.</div>;

  return (
    <div>
      <h2>Barra de progreso</h2>
      <div style={{width:"100%", background:"#eee", borderRadius:8, marginBottom:20}}>
        <div style={{width:`${progreso.porcentaje}%`, background:"#4caf50", height:24, borderRadius:8, color:"white", textAlign:"center"}}>
          {progreso.porcentaje}%
        </div>
      </div>
      <h3>Logros obtenidos</h3>
      <ul>
        {logros.map(l => (
          <li key={l.id}>{l.nombre} - {l.descripcion}</li>
        ))}
      </ul>
      <button onClick={() => navigate("/logros")}>Ver todos los logros</button>
      {/* Panel extra para admin */}
      {user.rol === "admin" && (
        <div style={{marginTop:20, padding:10, border:"1px solid #ccc"}}>
          <h3>Panel de gestión de progreso</h3>
          <button onClick={() => navigate("/admin/progreso")}>Ver progreso global</button>
        </div>
      )}
    </div>
  );
}

export default ProgresoPanel;
