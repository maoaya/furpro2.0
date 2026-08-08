
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { transportes, agregarTransporte } from "./TransportePage.logic";


const TransportePage = () => {
  const [lista, setLista] = useState(transportes);
  const [nombre, setNombre] = useState("");
  const [capacidad, setCapacidad] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!nombre || !capacidad) return;
    const nuevo = { id: lista.length + 1, nombre, capacidad: Number(capacidad) };
    agregarTransporte(nuevo);
    setLista([...lista, nuevo]);
    setNombre("");
    setCapacidad("");
  };

  return (
    <Layout>
      <h1>Transporte</h1>
      <p>Gestión de transportes y logística.</p>
      <nav>
        <Link to="/">Inicio</Link> | <Link to="/crear-marca">Crear Marca</Link> | <Link to="/categorias">Categorías</Link>
      </nav>
      <form onSubmit={handleAdd} style={{ marginBottom: "1rem" }}>
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" />
        <input value={capacidad} onChange={e => setCapacidad(e.target.value)} placeholder="Capacidad" type="number" min="1" />
        <button type="submit">Agregar</button>
      </form>

      <ul>
        {lista.map(t => (
          <li key={t.id} style={{ marginBottom: 12, background: '#232323', color: '#FFD700', borderRadius: 8, padding: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            {t.nombre} - Capacidad: {t.capacidad}
            <TransporteShareButton id={t.id} />
          </li>
        ))}
      </ul>
    </Layout>
  );
};


// Botón compartir para cada transporte
function TransporteShareButton({ id }) {
  const [feedback, setFeedback] = React.useState('');
  const url = window.location.origin + '/transporte/' + id;
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Transporte FutPro', url });
        setFeedback('¡Compartido!');
        setTimeout(() => setFeedback(''), 1500);
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setFeedback('¡Copiado!');
        setTimeout(() => setFeedback(''), 1500);
      } catch {}
    }
  };
  return (
    <>
      <button onClick={handleShare} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '4px 12px', fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}>Compartir</button>
      <input value={url} readOnly style={{ width: 120, fontSize: 12, border: '1px solid #FFD700', borderRadius: 6, background: '#181818', color: '#FFD700', padding: '2px 6px' }} onFocus={e => e.target.select()} />
      {feedback && <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 13 }}>{feedback}</span>}
    </>
  );
}
