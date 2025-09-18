

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function OnVenPublicar() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ titulo: "", descripcion: "", precio: "", contacto: "", foto: null });
  const [errores, setErrores] = useState({});
  const [preview, setPreview] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/png"].includes(file.type) && file.size < 2 * 1024 * 1024) {
      setForm({ ...form, foto: file });
      setPreview(URL.createObjectURL(file));
      setErrores({ ...errores, foto: null });
    } else {
      setErrores({ ...errores, foto: "Archivo no permitido o demasiado grande" });
      setPreview(null);
    }
  };

  const validar = () => {
    const errors = {};
    if (!form.titulo.trim()) errors.titulo = "El título es obligatorio";
    if (!form.descripcion || form.descripcion.length < 10) errors.descripcion = "La descripción debe tener al menos 10 caracteres";
    if (!form.precio.match(/^\d+(\.\d{1,2})?$/)) errors.precio = "Precio inválido";
    if (!form.contacto) errors.contacto = "El contacto es obligatorio";
    if (!form.foto) errors.foto = "La foto es obligatoria";
    return errors;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setMensaje("");
    setLoading(true);
    const errors = validar();
    setErrores(errors);
    if (Object.keys(errors).length === 0) {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      try {
        const res = await fetch("/api/onven/oferta", { method: "POST", body: formData, headers: { Authorization: `Bearer ${user.token}` } });
        if (!res.ok) throw new Error("Error al publicar oferta");
        setSuccess("Oferta publicada correctamente");
        setForm({ titulo: "", descripcion: "", precio: "", contacto: "", foto: null });
        setPreview(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Publicar oferta en el mercado de fichajes</h2>
      <form onSubmit={handleSubmit}>
        <input name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} />
        {errores.titulo && <span style={{color:"red"}}>{errores.titulo}</span>}
        <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
        {errores.descripcion && <span style={{color:"red"}}>{errores.descripcion}</span>}
        <input name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} />
        {errores.precio && <span style={{color:"red"}}>{errores.precio}</span>}
        <input name="contacto" placeholder="Contacto" value={form.contacto} onChange={handleChange} />
        {errores.contacto && <span style={{color:"red"}}>{errores.contacto}</span>}
        <input type="file" name="foto" accept="image/jpeg,image/png" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Previsualización" width={100} />}
        {errores.foto && <span style={{color:"red"}}>{errores.foto}</span>}
        <button type="submit" disabled={loading}>{loading ? "Publicando..." : "Publicar"}</button>
      </form>
      {success && <div style={{color:"green"}}>{success}</div>}
      {error && <div style={{color:"red"}}>{error}</div>}
      <button onClick={() => navigate("/mercado")}>Volver al mercado</button>
      {/* Panel extra para admin */}
      {user.rol === "admin" && (
        <div style={{marginTop:20, padding:10, border:"1px solid #ccc"}}>
          <h3>Panel de gestión de ofertas</h3>
          <button onClick={() => navigate("/admin/ofertas")}>Ver todas las ofertas</button>
        </div>
      )}
    </div>
  );
}

export default OnVenPublicar;
