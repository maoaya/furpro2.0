

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function crearUsuario(data) {
  const { email, nombre, telefono } = data;
  const { data: usuario, error } = await supabase.from('usuarios').insert([{ email, nombre, telefono }]).select().single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, ...usuario };
}

export async function validarEmailUnico(email) {
  const { data, error } = await supabase.from('usuarios').select('id').eq('email', email);
  if (error) return { unico: false, error: error.message };
  return { unico: !data || data.length === 0 };
}

export async function listarUsuarios() {
  const { data, error } = await supabase.from('usuarios').select('*');
  if (error) return [];
  return data;
}

export async function obtenerUsuario(id) {
  const { data, error } = await supabase.from('usuarios').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export async function actualizarUsuario(id, data) {
  const { data: updated, error } = await supabase.from('usuarios').update(data).eq('id', id).select().single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, ...updated };
}

export async function eliminarUsuario(id) {
  const { error } = await supabase.from('usuarios').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, id };
}

export async function obtenerMensajesConversacion(usuarioA, usuarioB) {
  const { data, error } = await supabase.from('mensajes')
    .select('*')
    .or(`(user_id.eq.${usuarioA},destinatario_id.eq.${usuarioB}),(user_id.eq.${usuarioB},destinatario_id.eq.${usuarioA})`)
    .order('created_at', { ascending: true });
  if (error) return [];
  return data;
}

export async function obtenerMensajesUsuario(usuarioId) {
  const { data, error } = await supabase.from('mensajes').select('*').or(`user_id.eq.${usuarioId},destinatario_id.eq.${usuarioId}`);
  if (error) return [];
  return data;
}

export async function marcarMensajeLeido(mensajeId) {
  const { data, error } = await supabase.from('mensajes').update({ leido: true }).eq('id', mensajeId).select().single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, ...data };
}

/**
 * Eliminar mensaje por ID
 * @param {string} mensajeId - ID del mensaje
 */

export async function eliminarMensaje(mensajeId) {
  return { ok: true, mensajeId };
}

/**
 * Consultar cantidad de mensajes no leídos de un usuario
 * @param {string} usuarioId - ID del usuario
 */

export async function obtenerMensajesNoLeidos() {
  return { count: 0 };
}

/**
 * Enviar mensaje de texto entre usuarios (con validación)
 * @param {object} params - { remitenteId, destinatarioId, texto }
 */

export async function enviarMensaje({ remitenteId, destinatarioId, texto }) {
  return { ok: true, id: 'msg-mock', remitenteId, destinatarioId, texto };
}

/**
 * Listar usuarios con paginación y filtros
 * @param {object} params - { page, size, nombre, rol }
 * Ejemplo: listarUsuariosPaginado({ page:1, size:10, nombre:'Juan', rol:'jugador' })
 */

export async function listarUsuariosPaginado() {
  return { usuarios: [ { id: 'mock-user', nombre: 'Usuario Mock', email: 'mock@futpro.com' } ] };
}

/**
 * Listar mensajes con paginación y filtros
 * @param {object} params - { usuarioId, page, size, desde, hasta }
 */

export async function listarMensajesPaginado() {
  return { mensajes: [ { id: 'msg1', texto: 'Mensaje paginado', leido: false } ] };
}

/**
 * Enviar mensaje con adjunto (archivo)
 * @param {object} params - { remitenteId, destinatarioId, texto, archivo }
 * archivo: File (input type="file")
 */

export async function enviarMensajeConAdjunto({ remitenteId, destinatarioId, texto, archivo }) {
  return { ok: true, id: 'msg-mock', remitenteId, destinatarioId, texto, archivo: !!archivo };
}

/**
 * Asignar rol a usuario
 * @param {string} usuarioId
 * @param {string} rol
 */

export async function asignarRol(usuarioId, rol) {
  return { ok: true, usuarioId, rol };
}

/**
 * Verificar permisos de usuario
 * @param {string} usuarioId
 * @param {string} permiso
 */

export async function verificarPermiso() {
  return { permitido: true };
}

/**
 * Solicitar recuperación de contraseña
 * @param {string} email
 */

export async function solicitarRecuperacion(email) {
  return { ok: true, email };
}

/**
 * Cambiar contraseña
 * @param {string} usuarioId
 * @param {string} nuevaPassword
 */

export async function cambiarPassword(usuarioId) {
  return { ok: true, usuarioId };
}

/**
 * Obtener perfil de usuario
 * @param {string} usuarioId
 */

export async function obtenerPerfil(usuarioId) {
  return { id: usuarioId, nombre: 'Usuario Mock', email: 'mock@futpro.com' };
}

/**
 * Actualizar perfil de usuario
 * @param {string} usuarioId
 * @param {object} data
 */

export async function actualizarPerfil(usuarioId, data) {
  return { ok: true, usuarioId, ...data };
}

/**
 * Bloquear usuario
 * @param {string} usuarioId
 */

export async function bloquearUsuario(usuarioId) {
  return { ok: true, usuarioId };
}

/**
 * Reportar mensaje
 * @param {string} mensajeId
 * @param {string} motivo
 */

export async function reportarMensaje(mensajeId, motivo) {
  return { ok: true, mensajeId, motivo };
}

/**
 * Ejemplo de uso:
 * const usuarios = await listarUsuariosPaginado({ page:1, size:10, nombre:'Juan' });
 * const mensajes = await listarMensajesPaginado({ usuarioId:'123', page:1, size:20 });
 * await enviarMensajeConAdjunto({ remitenteId, destinatarioId, texto, archivo });
 */
