import React from 'react';

export default function Card({ children, style }) {
  return (
    <div className={"card bg-gradient-to-br from-zinc-900 via-yellow-50/10 to-yellow-400/10 text-yellow-400 rounded-2xl shadow-2xl p-8 flex flex-col items-center border-2 border-yellow-400/60 min-w-[280px] min-h-[220px] transition-transform duration-200 hover:scale-105 hover:shadow-yellow-400/30 animate-fadeInUp " + (style || "") }>
      {children}
    </div>
  );
}
