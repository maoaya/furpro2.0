import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TablasPanel() {
  const [tablas] = useState([]);
  const navigate = useNavigate();
  return (
    <div className="panel bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 border-2 border-yellow-400/40 animate-fadeInUp my-8">
      <h2 className="text-xl font-bold text-yellow-400 mb-6">Tablas de posiciones</h2>
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full bg-white dark:bg-zinc-900 border-2 border-yellow-400/20 rounded-xl">
          <thead>
            <tr className="bg-yellow-400/80 text-zinc-900">
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Equipo</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Puntos</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Partidos</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Goles</th>
            </tr>
          </thead>
          <tbody>
            {tablas.map(t => (
              <tr key={t.equipo} className="hover:bg-yellow-100/60 dark:hover:bg-yellow-900/30 transition-colors">
                <td className="px-6 py-3 border-b border-yellow-200/30">{t.equipo}</td>
                <td className="px-6 py-3 border-b border-yellow-200/30">{t.puntos}</td>
                <td className="px-6 py-3 border-b border-yellow-200/30">{t.partidos}</td>
                <td className="px-6 py-3 border-b border-yellow-200/30">{t.goles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => navigate("/torneos")} className="mt-6 bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-bold rounded-lg px-6 py-2 shadow-lg transition-all duration-200">Ver torneos</button>
    </div>
  );
}

export default TablasPanel;
