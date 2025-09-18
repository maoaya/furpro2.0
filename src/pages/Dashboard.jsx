import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Panel FutPro</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Próximos partidos */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-5 flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Próximos Partidos</h2>
          <ul className="flex-1 space-y-2">
            <li className="bg-gray-800 rounded p-2">Equipo A vs Equipo B - 10/09</li>
            <li className="bg-gray-800 rounded p-2">Equipo C vs Equipo D - 12/09</li>
          </ul>
          <button className="mt-4 bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-300">Ver todos</button>
        </div>
        {/* Notificaciones */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-5 flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Notificaciones</h2>
          <ul className="flex-1 space-y-2">
            <li className="bg-gray-800 rounded p-2">¡Nuevo torneo disponible!</li>
            <li className="bg-gray-800 rounded p-2">Has sido invitado a un amistoso</li>
          </ul>
          <button className="mt-4 bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-300">Ver todas</button>
        </div>
        {/* Estadísticas */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-5 flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Estadísticas</h2>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="text-4xl font-bold">12</div>
            <div className="text-sm">Partidos jugados</div>
            <div className="text-4xl font-bold mt-2">7</div>
            <div className="text-sm">Goles</div>
          </div>
          <button className="mt-4 bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-300">Ver más</button>
        </div>
        {/* Logros */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-5 flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Logros</h2>
          <ul className="flex-1 space-y-2">
            <li className="bg-gray-800 rounded p-2">🏅 MVP Torneo Primavera</li>
            <li className="bg-gray-800 rounded p-2">🥅 Máximo goleador</li>
          </ul>
          <button className="mt-4 bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-300">Ver todos</button>
        </div>
        {/* Marketplace */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-5 flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Marketplace</h2>
          <ul className="flex-1 space-y-2">
            <li className="bg-gray-800 rounded p-2">Botines Nike - $50</li>
            <li className="bg-gray-800 rounded p-2">Camiseta oficial - $30</li>
          </ul>
          <button className="mt-4 bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-300">Ir al marketplace</button>
        </div>
        {/* Publicidad */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-5 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold mb-2">Publicidad</span>
          <div className="bg-yellow-300 text-black rounded p-4 w-full text-center font-bold">¡Patrocina tu equipo aquí!</div>
        </div>
      </div>
    </div>
  );
}
