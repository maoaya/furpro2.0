
import express from 'express';
import { createClient } from '@supabase/supabase-js';
const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Validar dominio (ejemplo: buscar en tabla dominios)
router.post('/validador-web/dominio', async (req, res) => {
  const { dominio } = req.body;
  if (!dominio) return res.status(400).json({ error: 'Dominio requerido' });
  const { data, error } = await supabase.from('dominios').select('*').eq('dominio', dominio).single();
  if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });
  if (!data) return res.json({ valido: false });
  res.json({ valido: true, ...data });
});

// Guardar dominio
router.post('/validador-web/dominio/guardar', async (req, res) => {
  const { dominio, email, telefono, direccion } = req.body;
  if (!dominio || !email) return res.status(400).json({ error: 'Faltan datos' });
  const { data, error } = await supabase.from('dominios').insert([{ dominio, email, telefono, direccion }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ guardado: true, ...data });
});

// Validar usuario
router.post('/validador-web/usuario', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requerido' });
  const { data, error } = await supabase.from('usuarios').select('*').eq('email', email).single();
  if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });
  if (!data) return res.json({ valido: false });
  res.json({ valido: true, ...data });
});

// Guardar usuario
router.post('/validador-web/usuario/guardar', async (req, res) => {
  const { email, nombre, telefono, direccion } = req.body;
  if (!email || !nombre) return res.status(400).json({ error: 'Faltan datos' });
  const { data, error } = await supabase.from('usuarios').insert([{ email, nombre, telefono, direccion }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ guardado: true, ...data });
});

// Guardar formulario
router.post('/validador-web/formulario/guardar', async (req, res) => {
  const { datos } = req.body;
  if (!datos) return res.status(400).json({ error: 'Datos requeridos' });
  const { data, error } = await supabase.from('formularios').insert([{ datos }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ guardado: true, ...data });
});

// Obtener registros
router.get('/validador-web/registros', async (req, res) => {
  const { data, error } = await supabase.from('formularios').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ registros: data });
});

export default router;
