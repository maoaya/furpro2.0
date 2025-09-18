
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function PenaltisJugar() {
  const { user } = useContext(AuthContext);
  const [resultado, setResultado] = useState(null);
  const [intentos, setIntentos] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  // Simulación simple de minijuego de penaltis
  const jugarPenalti = () => {
    setLoading(true);
    setIntentos(intentos + 1);
    setTimeout(() => {
      const exito = Math.random() > 0.5;
      setResultado(exito ? "¡Gol!" : "Fallaste");
      setMensaje(exito ? "¡Felicidades, anotaste!" : "Intenta de nuevo");
      setLoading(false);
      // Registrar resultado en backend
      fetch("/api/penaltis/jugar", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ userId: user.id, exito })
      });
    }, 1000);
  };

  return (
    <div>
      <h2>Minijuego de Penaltis</h2>
      <button onClick={jugarPenalti} disabled={loading}>
        {loading ? "Jugando..." : "Lanzar penalti"}
      </button>
      {resultado && <div style={{marginTop:10}}>{resultado}</div>}
      {mensaje && <div style={{color: resultado === "¡Gol!" ? "green" : "red"}}>{mensaje}</div>}
      <div>Intentos: {intentos}</div>
      <button onClick={() => navigate("/penaltis/historial")}>Ver historial</button>
      {/* Panel extra para admin */}
      {user.rol === "admin" && (
        <div style={{marginTop:20, padding:10, border:"1px solid #ccc"}}>
          <h3>Panel de gestión de penaltis</h3>
          <button onClick={() => navigate("/admin/penaltis")}>Ver todos los registros</button>
        </div>
      )}
    </div>
  );
}

export default PenaltisJugar;
