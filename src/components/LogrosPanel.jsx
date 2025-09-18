
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LogrosPanel() {
  const { user } = useContext(AuthContext);
  const [logrosPersonales, setLogrosPersonales] = useState([]);
  const [logrosEquipo, setLogrosEquipo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  return (
    <div className="panel bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 border-2 border-yellow-400/40 animate-fadeInUp my-8">
      <h2 className="text-xl font-bold text-yellow-400 mb-6">Logros personales</h2>
      {logrosPersonales.length === 0 ? (
        <div className="text-zinc-500">No tienes logros personales aún.</div>
      ) : (
        <ul className="space-y-2 mb-8">
          {logrosPersonales.map(l => (
            <li key={l.id} className="p-3 rounded-lg bg-yellow-50/60 dark:bg-yellow-900/10 border border-yellow-200/30">
              <span className="font-semibold text-yellow-700 dark:text-yellow-300">{l.nombre}</span> - <span className="text-zinc-700 dark:text-zinc-200">{l.descripcion}</span>
            </li>
          ))}
        </ul>
      )}
      <h2 className="text-xl font-bold text-yellow-400 mb-6">Logros de equipo</h2>
      {logrosEquipo.length === 0 ? (
        <div className="text-zinc-500">No tienes logros de equipo aún.</div>
      ) : (
        <ul className="space-y-2">
          {logrosEquipo.map(l => (
            <li key={l.id} className="p-3 rounded-lg bg-yellow-50/60 dark:bg-yellow-900/10 border border-yellow-200/30">
              <span className="font-semibold text-yellow-700 dark:text-yellow-300">{l.nombre}</span> - <span className="text-zinc-700 dark:text-zinc-200">{l.descripcion}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
      });
  }, [user, navigate]);

  if (loading) return <div>Cargando logros...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Logros personales</h2>
      {logrosPersonales.length === 0 ? (
        <div>No tienes logros personales aún.</div>
      ) : (
        <ul>
          {logrosPersonales.map(l => (
            <li key={l.id}>{l.nombre} - {l.descripcion}</li>
          ))}
        </ul>
      )}
      <h2>Logros de equipo</h2>
      {logrosEquipo.length === 0 ? (
        <div>No tienes logros de equipo aún.</div>
      ) : (
        <ul>
          {logrosEquipo.map(l => (
            <li key={l.id}>{l.nombre} - {l.descripcion}</li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/progreso")}>Ver progreso</button>
      {/* Panel extra para admin */}
      {user.rol === "admin" && (
        <div style={{marginTop:20, padding:10, border:"1px solid #ccc"}}>
          <h3>Panel de gestión de logros</h3>
          <button onClick={() => navigate("/admin/logros")}>Ver todos los logros</button>
        </div>
      )}
    </div>
  );
}

export default LogrosPanel;
