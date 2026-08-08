
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function SorteoJugadores() {
  const { user } = useContext(AuthContext);
  const [jugadores, setJugadores] = useState("");
  const [equipos, setEquipos] = useState([]);
  const [resultado, setResultado] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSorteo = () => {
    setLoading(true);
    setError("");
    // Simulación de sorteo
    try {
      const listaJugadores = jugadores.split(",").map(j => j.trim()).filter(j => j);
      if (listaJugadores.length < 2 || equipos.length < 2) throw new Error("Debes ingresar al menos 2 jugadores y 2 equipos");
      // Shuffle jugadores
      const shuffled = listaJugadores.sort(() => Math.random() - 0.5);
      const asignacion = equipos.map((eq, i) => ({ equipo: eq, jugador: shuffled[i % shuffled.length] }));
      setResultado(asignacion);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEquiposChange = e => {
    setEquipos(e.target.value.split(",").map(e => e.trim()).filter(e => e));
  };

  return (
    <div>
      <h2>Sorteo de jugadores para equipos</h2>
      <div>
        <label>Jugadores (separados por coma):</label>
        <input type="text" value={jugadores} onChange={e => setJugadores(e.target.value)} />
      </div>
      <div>
        <label>Equipos (separados por coma):</label>
        <input type="text" onChange={handleEquiposChange} />
      </div>
      <button onClick={handleSorteo} disabled={loading}>{loading ? "Sorteando..." : "Realizar sorteo"}</button>
      {error && <div style={{color:"red"}}>{error}</div>}
      {resultado.length > 0 && (
        <div>
          <h3>Resultado del sorteo:</h3>
          <ul>
            {resultado.map((r, idx) => (
              <li key={idx}>{r.equipo}: {r.jugador}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => navigate("/equipos")}>Ver equipos</button>
      {/* Panel extra para admin */}
      {user.rol === "admin" && (
        <div style={{marginTop:20, padding:10, border:"1px solid #ccc"}}>
          <h3>Panel de gestión de sorteos</h3>
          <button onClick={() => navigate("/admin/sorteos")}>Ver todos los sorteos</button>
        </div>
      )}
    </div>
  );
}

export default SorteoJugadores;
