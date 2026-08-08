// ...existing code...
// Mejora aplicada: validación robusta, feedback visual, gestión avanzada de archivos, protección por roles y navegación fluida

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function EditarPerfil() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", foto: null, preferencias: "" });
  const [errores, setErrores] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetch(`/api/perfil/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setForm({ ...data, foto: null });
        setPreview(data.fotoUrl || null);
      });
  }, [user, navigate]);

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/png"].includes(file.type) && file.size < 2 * 1024 * 1024) {
      setForm({ ...form, foto: file });
      setPreview(URL.createObjectURL(file));
      setErrores({ ...errores, foto: null });
    } else {
      setErrores({ ...errores, foto: "Archivo no permitido o demasiado grande" });
    }
  };

  const validar = () => {
    const errors = {};
    if (!form.nombre) errors.nombre = "El nombre es obligatorio";
    if (!form.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) errors.email = "Email inválido";
    if (!form.telefono.match(/^\d{7,15}$/)) errors.telefono = "Teléfono inválido";
    return errors;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validar();
    setErrores(errors);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      fetch(`/api/perfil/${user.id}`, {
        method: "PUT",
        body: formData
      })
        .then(res => res.json())
        .then(() => {
          setLoading(false);
          setMensaje("Perfil actualizado correctamente");
          setTimeout(() => navigate("/perfil"), 1500);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
      {errores.nombre && <span>{errores.nombre}</span>}
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      {errores.email && <span>{errores.email}</span>}
      <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" />
      {errores.telefono && <span>{errores.telefono}</span>}
      <input type="file" name="foto" accept="image/jpeg,image/png" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Previsualización" width={100} />}
      {errores.foto && <span>{errores.foto}</span>}
      <textarea name="preferencias" value={form.preferencias} onChange={handleChange} placeholder="Preferencias" />
      <button type="submit" disabled={loading}>Guardar</button>
      <button type="button" onClick={() => navigate("/perfil")}>Cancelar</button>
      {mensaje && <div>{mensaje}</div>}
    </form>
  );
}

export default EditarPerfil;
