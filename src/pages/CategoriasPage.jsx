
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { categorias, agregarCategoria } from "./CategoriasPage.logic";


const CategoriasPage = () => {
  const [lista, setLista] = useState(categorias);
  const [nombre, setNombre] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!nombre) return;
    const nuevo = { id: lista.length + 1, nombre };
    agregarCategoria(nuevo);
    setLista([...lista, nuevo]);
    setNombre("");
  };

  return (
    <Layout>
      <h1>Categorías</h1>
      <p>Listado y gestión de categorías.</p>
      <nav>
        <Link to="/">Inicio</Link> | <Link to="/transporte">Transporte</Link> | <Link to="/crear-marca">Crear Marca</Link>
      </nav>
      <form onSubmit={handleAdd} style={{ marginBottom: "1rem" }}>
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre de la categoría" />
        <button type="submit">Agregar</button>
      </form>
      <ul>
        {lista.map(c => (
          <li key={c.id}>{c.nombre}</li>
        ))}
      </ul>
    </Layout>
  );
};

export default CategoriasPage;
