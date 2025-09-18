
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { marcas, agregarMarca } from "./CrearMarcaPage.logic";


const CrearMarcaPage = () => {
  const [lista, setLista] = useState(marcas);
  const [nombre, setNombre] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!nombre) return;
    const nuevo = { id: lista.length + 1, nombre };
    agregarMarca(nuevo);
    setLista([...lista, nuevo]);
    setNombre("");
  };

  return (
    <Layout>
      <h1>Crear Marca</h1>
      <p>Formulario para crear una nueva marca.</p>
      <nav>
        <Link to="/">Inicio</Link> | <Link to="/transporte">Transporte</Link> | <Link to="/categorias">Categorías</Link>
      </nav>
      <form onSubmit={handleAdd} style={{ marginBottom: "1rem" }}>
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre de la marca" />
        <button type="submit">Agregar</button>
      </form>
      <ul>
        {lista.map(m => (
          <li key={m.id}>{m.nombre}</li>
        ))}
      </ul>
    </Layout>
  );
};

export default CrearMarcaPage;
