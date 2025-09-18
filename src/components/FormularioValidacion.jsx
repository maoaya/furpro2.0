
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function FormularioValidacion() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    precio: "",
    fecha: "",
    archivo: null,
    descripcion: ""
  });
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  // Validaciones
  const validar = () => {
    return (
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-2xl animate-fadeInUp border-2 border-yellow-400/60 mt-10">
        <h2 className="text-2xl font-bold text-yellow-400 mb-8 text-center tracking-wide">Formulario de Validación</h2>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Nombre</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className="input input-bordered w-full" autoComplete="off" />
          {errores.nombre && <span className="text-red-500 text-xs mt-1 block animate-pulse">{errores.nombre}</span>}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="input input-bordered w-full" autoComplete="off" />
          {errores.email && <span className="text-red-500 text-xs mt-1 block animate-pulse">{errores.email}</span>}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Teléfono</label>
          <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} className="input input-bordered w-full" autoComplete="off" />
          {errores.telefono && <span className="text-red-500 text-xs mt-1 block animate-pulse">{errores.telefono}</span>}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Precio</label>
          <input type="text" name="precio" value={form.precio} onChange={handleChange} className="input input-bordered w-full" autoComplete="off" />
          {errores.precio && <span className="text-red-500 text-xs mt-1 block animate-pulse">{errores.precio}</span>}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Fecha</label>
          <input type="date" name="fecha" value={form.fecha} onChange={handleChange} className="input input-bordered w-full" />
          {errores.fecha && <span className="text-red-500 text-xs mt-1 block animate-pulse">{errores.fecha}</span>}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Archivo</label>
          <input type="file" name="archivo" onChange={handleChange} className="input input-bordered w-full" />
          {errores.archivo && <span className="text-red-500 text-xs mt-1 block animate-pulse">{errores.archivo}</span>}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Descripción</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="input input-bordered w-full min-h-[80px]" />
          {errores.descripcion && <span className="text-red-500 text-xs mt-1 block animate-pulse">{errores.descripcion}</span>}
        </div>
        <button type="submit" disabled={loading} className="bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-bold rounded-lg px-8 py-3 shadow-lg transition-all duration-200 w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
        {success && <div className="text-green-600 font-semibold mt-4 animate-fadeInUp">{success}</div>}
        {error && <div className="text-red-500 font-semibold mt-4 animate-fadeInUp">{error}</div>}
      </form>
    );
        if (!res.ok) throw new Error("Error al enviar formulario");
        setSuccess("Formulario enviado correctamente");
        setForm({ nombre: "", email: "", telefono: "", precio: "", fecha: "", archivo: null, descripcion: "" });
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
    <form onSubmit={handleSubmit}>
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
      {errores.nombre && <span style={{color:"red"}}>{errores.nombre}</span>}

      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      {errores.email && <span style={{color:"red"}}>{errores.email}</span>}

      <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
      {errores.telefono && <span style={{color:"red"}}>{errores.telefono}</span>}

      <input name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} />
      {errores.precio && <span style={{color:"red"}}>{errores.precio}</span>}

      <input type="date" name="fecha" value={form.fecha} onChange={handleChange} />
      {errores.fecha && <span style={{color:"red"}}>{errores.fecha}</span>}

      <input type="file" name="archivo" onChange={handleChange} />
      {errores.archivo && <span style={{color:"red"}}>{errores.archivo}</span>}

      <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
      {errores.descripcion && <span style={{color:"red"}}>{errores.descripcion}</span>}

      <button type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar"}</button>
      {success && <div style={{color:"green"}}>{success}</div>}
      {error && <div style={{color:"red"}}>{error}</div>}
    </form>
  );
}

export default FormularioValidacion;
