
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function EditarLogros() {
  const { user } = useContext(AuthContext);
  const [logros, setLogros] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.rol !== "admin") {
      navigate("/login");
      return;
    }
    fetch("/api/logros")
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar logros");
        return res.json();
      })
      .then(data => setLogros(data))
      .catch(err => setError(err.message));
  }, [user, navigate]);

  const handleSelect = l => {
    setSelected(l);
    setForm({ nombre: l.nombre, descripcion: l.descripcion });
    setError("");
    setSuccess("");
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (!form.descripcion.trim()) {
      setError("La descripción es obligatoria");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/logros/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Error al editar logro");
      setSuccess("Logro editado correctamente");
      setSelected(null);
      setForm({ nombre: "", descripcion: "" });
      // Recargar logros
      const nuevos = await fetch("/api/logros").then(r => r.json());
      setLogros(nuevos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Editar logros</h2>
      <ul>
        {logros.map(l => (
          <li key={l.id}>
            {l.nombre} - {l.descripcion}
            <button onClick={() => handleSelect(l)}>Editar</button>
          </li>
        ))}
      </ul>
      {selected && (
        <form onSubmit={handleSubmit}>
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" />
          <button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar cambios"}</button>
        </form>
      )}
      {error && <div style={{color:"red"}}>{error}</div>}
      {success && <div style={{color:"green"}}>{success}</div>}
      <button onClick={() => navigate("/logros")}>Volver a logros</button>
    </div>
  );
}

export default EditarLogros;
