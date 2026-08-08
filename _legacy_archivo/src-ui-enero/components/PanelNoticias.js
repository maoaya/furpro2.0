import React from 'react';

export default function PanelNoticias({ noticias }) {
  const noticiasMock = [
    { id: 1, titulo: 'Nuevo torneo anunciado', descripcion: 'El torneo Clausura 2025 inicia el próximo mes.' },
    { id: 2, titulo: 'Actualización de reglas', descripcion: 'Se han actualizado las reglas para la temporada.' }
  ];
  const noticiasFinal = noticias && noticias.length > 0 ? noticias : noticiasMock;
  return (
    <div className="panel-noticias bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border-2 border-yellow-400/30 my-6 animate-fadeInUp">
      <h3 className="text-lg font-bold text-yellow-400 mb-4">Noticias Recientes</h3>
      <ul className="space-y-4">
        {noticiasFinal.map(n => (
          <li key={n.id} className="p-4 rounded-lg bg-yellow-50/60 dark:bg-yellow-900/10 border border-yellow-200/30">
            <strong className="text-yellow-700 dark:text-yellow-300">{n.titulo}</strong><br />
            <span className="text-zinc-700 dark:text-zinc-200">{n.descripcion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
