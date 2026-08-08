
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function OnVenOfertas() {
  const { user } = useContext(AuthContext);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetch(`/api/mercado/ofertas/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar ofertas");
        return res.json();
      })
      .then(data => {
        setOfertas(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, navigate]);

  if (loading) return <div>Cargando ofertas...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!ofertas.length) return <div>No hay ofertas publicadas.</div>;

  return (
    <div>
      <h2>Ofertas publicadas en On Ven</h2>
      <ul>
        {ofertas.map(o => (
          <li key={o.id}>
            <strong>{o.titulo}</strong> - {o.descripcion} ({o.estado})
            <button onClick={() => navigate(`/mercado/oferta/${o.id}`)}>Ver detalle</button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate("/mercado/publicar")}>Publicar nueva oferta</button>
      {/* Panel extra para admin */}
      {user.rol === "admin" && (
        <div style={{marginTop:20, padding:10, border:"1px solid #ccc"}}>
          <h3>Panel de gestión de ofertas</h3>
          <button onClick={() => navigate("/admin/ofertas")}>Ver todas las ofertas</button>
        </div>
      )}
    </div>
  );
}

export default OnVenOfertas;
