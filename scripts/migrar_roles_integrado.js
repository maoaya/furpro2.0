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

const { createClient } = require('@supabase/supabase-js');

async function main() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE;

  if (!url || !serviceKey) {
    console.error('[ERROR] Faltan variables SUPABASE_URL o SUPABASE_SERVICE_ROLE');
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  // 1) users.user_type -> 'integrado'
  console.log('▶ Unificando roles en tabla public.users ...');
  const { data: candidatosUsers, error: preErr } = await supabase
    .from('users')
    .select('id, user_type')
    .or('user_type.is.null,user_type.neq.integrado');
  if (preErr) {
    console.error('Error consultando users:', preErr);
    process.exit(1);
  }
  const preCount = candidatosUsers?.length || 0;
  if (preCount === 0) {
    console.log('  - No hay usuarios para actualizar en users.');
  } else {
    const { error: updErr } = await supabase
      .from('users')
      .update({ user_type: 'integrado' })
      .or('user_type.is.null,user_type.neq.integrado');
    if (updErr) {
      console.error('Error actualizando users:', updErr);
      process.exit(1);
    }
    console.log(`  - Actualizados ${preCount} registros en users.`);
  }

  // 2) usuarios.rol -> 'integrado' (si la tabla existe)
  console.log('▶ Intentando unificar roles en tabla public.usuarios ...');
  try {
    // Comprobar existencia intentando consultar count mínimo
    const { data: candidatosUsuarios, error: usuariosSelectErr } = await supabase
      .from('usuarios')
      .select('id, rol')
      .or('rol.is.null,rol.neq.integrado');

    if (usuariosSelectErr) throw usuariosSelectErr;

    const preUsuarios = candidatosUsuarios?.length || 0;
    if (preUsuarios === 0) {
      console.log('  - No hay usuarios para actualizar en usuarios o tabla vacía.');
    } else {
      const { error: upd2Err } = await supabase
        .from('usuarios')
        .update({ rol: 'integrado' })
        .or('rol.is.null,rol.neq.integrado');
      if (upd2Err) throw upd2Err;
      console.log(`  - Actualizados ${preUsuarios} registros en usuarios.`);
    }
  } catch (e) {
    if (e && (e.code === '42P01' || /relation .* does not exist/i.test(e.message || ''))) {
      console.log('  - Tabla public.usuarios no existe. Se omite.');
    } else {
      console.error('Error en actualización de public.usuarios:', e);
      process.exit(1);
    }
  }

  console.log('✅ Migración de roles completada.');
}

main().catch((err) => {
  console.error('Fallo inesperado en la migración:', err);
  process.exit(1);
});
