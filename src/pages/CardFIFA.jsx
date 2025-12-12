import React, { useRef, useState } from 'react';

const defaultStats = {
  rating: 85,
  position: 'ST',
  pace: 88,
  shooting: 86,
  passing: 82,
  dribbling: 87,
  defending: 42,
  physical: 78,
  name: 'Jugador FutPro',
  country: '🇦🇷',
  club: 'FutPro FC'
};

export default function CardFIFA() {
  const cardRef = useRef(null);
  const [stats, setStats] = useState(defaultStats);
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (key, value) => {
    setStats(prev => ({ ...prev, [key]: value }));
  };

  const handleNumber = (key, value) => {
    const n = Math.max(1, Math.min(99, parseInt(value || '0', 10)));
    setStats(prev => ({ ...prev, [key]: isNaN(n) ? prev[key] : n }));
  };

  const onPhoto = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const exportPNG = async () => {
    if (!cardRef.current) return;
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `card-futpro-${stats.name.replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('No se pudo exportar PNG', err);
      alert('Error al exportar PNG. Ver consola.');
    }
  };

  const saveDraft = () => {
    setSaving(true);
    try {
      const payload = { stats, photo };
      localStorage.setItem('card_futpro_borrador', JSON.stringify(payload));
      alert('Borrador guardado');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Card FutPro</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div ref={cardRef} className="relative w-80 h-112 md:w-96 md:h-[28rem] mx-auto rounded-xl shadow-2xl bg-gradient-to-br from-yellow-200 to-yellow-500 text-gray-900 overflow-hidden">
            <div className="absolute top-2 left-3 text-5xl font-extrabold">{stats.rating}</div>
            <div className="absolute top-2 right-3 text-xl font-bold">{stats.position}</div>
            <div className="absolute top-16 left-0 right-0 flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-white/50 overflow-hidden shadow">
                {photo ? (<img src={photo} alt="foto" className="w-full h-full object-cover" />) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">Foto</div>
                )}
              </div>
              <div className="mt-2 text-lg font-bold">{stats.name}</div>
              <div className="text-sm">{stats.country} • {stats.club}</div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-black/20 text-white p-3 grid grid-cols-2 gap-1 text-xs">
              <div>PAC {stats.pace}</div>
              <div>SHO {stats.shooting}</div>
              <div>PAS {stats.passing}</div>
              <div>DRI {stats.dribbling}</div>
              <div>DEF {stats.defending}</div>
              <div>PHY {stats.physical}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="text-sm">Nombre</span>
            <input className="w-full border rounded px-2 py-1" value={stats.name} onChange={e => handleChange('name', e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm">Club</span>
            <input className="w-full border rounded px-2 py-1" value={stats.club} onChange={e => handleChange('club', e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm">País (emoji/texto)</span>
            <input className="w-full border rounded px-2 py-1" value={stats.country} onChange={e => handleChange('country', e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm">Posición</span>
            <input className="w-full border rounded px-2 py-1" value={stats.position} onChange={e => handleChange('position', e.target.value.toUpperCase().slice(0, 3))} />
          </label>
          <label className="block">
            <span className="text-sm">Rating</span>
            <input type="number" min="1" max="99" className="w-full border rounded px-2 py-1" value={stats.rating} onChange={e => handleNumber('rating', e.target.value)} />
          </label>

          <div className="grid grid-cols-2 gap-2">
            {[
              ['pace', 'PAC'], ['shooting', 'SHO'], ['passing', 'PAS'], ['dribbling', 'DRI'], ['defending', 'DEF'], ['physical', 'PHY']
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-sm">{label}</span>
                <input type="number" min="1" max="99" className="w-full border rounded px-2 py-1" value={stats[key]} onChange={e => handleNumber(key, e.target.value)} />
              </label>
            ))}
          </div>

          <label className="block">
            <span className="text-sm">Foto del jugador</span>
            <input type="file" accept="image/*" onChange={onPhoto} />
          </label>

          <div className="flex gap-2 pt-2">
            <button onClick={saveDraft} disabled={saving} className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300">Guardar borrador</button>
            <button onClick={exportPNG} className="px-3 py-2 rounded bg-yellow-400 hover:bg-yellow-500">Exportar PNG</button>
          </div>
        </div>
      </div>
    </div>
  );
}
