#!/usr/bin/env node
/*
  Migración: Unificar roles a 'integrado'
  - Actualiza public.users.user_type -> 'integrado' cuando sea NULL o distinto.
  - Si existe tabla public.usuarios, actualiza campo rol -> 'integrado'.

  Requisitos:
  - Variables de entorno:
    SUPABASE_URL
    SUPABASE_SERVICE_ROLE  (clave service_role de Supabase)

  Uso (PowerShell Windows):
    $env:SUPABASE_URL="https://<tu-proyecto>.supabase.co"; \
    $env:SUPABASE_SERVICE_ROLE="<service_role_key>"; \
    npm run migrar:roles
*/

// Cargar variables de entorno desde .env si existe
try {
  require('dotenv').config();
} catch (_) {
  // dotenv es opcional; si no existe, seguimos con process.env
}

const { createClient } = require('@supabase/supabase-js');
const { Client: PgClient } = require('pg');

async function tryWithPg() {
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!dbUrl) return { tried: false };
  console.log('▶ Intentando migración directa vía Postgres (DATABASE_URL) ...');
  const client = new PgClient({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    // users
    const { rowCount: countUsers } = await client.query(
      "UPDATE public.users SET user_type = 'integrado' WHERE user_type IS NULL OR user_type <> 'integrado';"
    );
    console.log(`  - Users actualizados: ${countUsers}`);
    // usuarios (si existe)
    try {
      const { rowCount: countUsuarios } = await client.query(
        "UPDATE public.usuarios SET rol = 'integrado' WHERE rol IS NULL OR rol <> 'integrado';"
      );
      console.log(`  - Usuarios actualizados: ${countUsuarios}`);
    } catch (e) {
      if (/relation .* does not exist/i.test(e.message || '') || e.code === '42P01') {
        console.log("  - Tabla 'public.usuarios' no existe. Se omite.");
      } else {
        throw e;
      }
    }
    console.log('✅ Migración de roles completada vía Postgres.');
    return { tried: true, success: true };
  } finally {
    await client.end();
  }
}

async function main() {
  const url = process.env.SUPABASE_URL;
  // Acepta tanto SUPABASE_SERVICE_ROLE como SUPABASE_SERVICE_ROLE_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('[ERROR] Faltan variables SUPABASE_URL o SUPABASE_SERVICE_ROLE(|_KEY)');
    process.exit(1);
  }

  // PostgREST del proyecto tiene esquemas permitidos: api, graphql_public, storage, graphql, realtime, vault
  // Usamos 'api' como esquema por defecto (Supabase suele exponer vistas ahí cuando public no está expuesto)
  const supabaseApi = createClient(url, serviceKey, { auth: { persistSession: false }, db: { schema: 'api' } });

  // 1) users.user_type -> 'integrado'
  console.log("▶ Unificando roles en 'users' (esquema api) ...");
  const { data: candidatosUsers, error: preErr } = await supabaseApi
    .from('users')
    .select('id, user_type')
    .or('user_type.is.null,user_type.neq.integrado');
  if (preErr) {
    console.error("  - No se pudo consultar 'api.users':", preErr.message || preErr);
    console.log('  Sugerencia: Verifica que exista la vista/tabla api.users o expón el esquema public en la API.');
    // Fallback: intentar con conexión directa a Postgres si está disponible
    const pg = await tryWithPg();
    if (pg.tried) return; // ya migrado o intentado por PG
  }
  const preCount = candidatosUsers?.length || 0;
  if (preCount === 0) {
    console.log('  - No hay usuarios para actualizar en users.');
  } else {
    const { error: updErr } = await supabaseApi
      .from('users')
      .update({ user_type: 'integrado' })
      .or('user_type.is.null,user_type.neq.integrado');
    if (updErr) {
      console.error('Error actualizando users:', updErr.message || updErr);
      console.log('  Sugerencia: Si users es una VIEW, asegúrate de que sea actualizable o crea una RPC específica.');
    }
    console.log(`  - Actualizados ${preCount} registros en users.`);
  }

  // 2) usuarios.rol -> 'integrado' (si la tabla existe)
  console.log("▶ Intentando unificar roles en 'usuarios' (esquema api) ...");
  try {
    // Comprobar existencia intentando consultar count mínimo
    const { data: candidatosUsuarios, error: usuariosSelectErr } = await supabaseApi
      .from('usuarios')
      .select('id, rol')
      .or('rol.is.null,rol.neq.integrado');

    if (usuariosSelectErr) throw usuariosSelectErr;

    const preUsuarios = candidatosUsuarios?.length || 0;
    if (preUsuarios === 0) {
      console.log('  - No hay usuarios para actualizar en usuarios o tabla vacía.');
    } else {
      const { error: upd2Err } = await supabaseApi
        .from('usuarios')
        .update({ rol: 'integrado' })
        .or('rol.is.null,rol.neq.integrado');
      if (upd2Err) throw upd2Err;
      console.log(`  - Actualizados ${preUsuarios} registros en usuarios.`);
    }
  } catch (e) {
    if (e && (e.code === '42P01' || /relation .* does not exist/i.test(e.message || ''))) {
      console.log("  - Relación 'api.usuarios' no existe. Se omite.");
    } else {
      console.error('Error en actualización de public.usuarios:', e);
      // Intentar fallback vía PG si hay permisos
      const pg = await tryWithPg();
      if (!pg.tried) {
        console.log('ℹ️ Para habilitar la migración por REST: añade el esquema public a API > REST > Exposed schemas o crea vistas actualizables en api.*');
        process.exit(1);
      }
    }
  }

  console.log('✅ Migración de roles completada.');
}

main().catch((err) => {
  console.error('Fallo inesperado en la migración:', err);
  process.exit(1);
});
