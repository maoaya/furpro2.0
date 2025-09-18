import React from 'react';

export default function Tabla({ columns, data }) {
  return (
    <div className="overflow-x-auto rounded-2xl shadow-xl animate-fadeInUp my-6">
      <table className="min-w-full bg-white dark:bg-zinc-900 border-2 border-yellow-400/40 rounded-2xl">
        <thead>
          <tr className="bg-yellow-400/80 text-zinc-900">
            {columns.map(col => <th key={col} className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row,i) => (
            <tr key={i} className="hover:bg-yellow-100/60 dark:hover:bg-yellow-900/30 transition-colors">
              {columns.map(col => <td key={col} className="px-6 py-3 border-b border-yellow-200/30">{row[col]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
