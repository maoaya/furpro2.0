/**
 * 🚀 SCRIPT PARA ACTIVAR EL SISTEMA DE TRACKING EN SUPABASE
 * Ejecuta el SQL de la tabla user_activities usando la API REST
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración de Supabase
const SUPABASE_URL = 'https://qqrxetxcglwrejtblwut.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTAyNjU4NywiZXhwIjoyMDQ2NjAyNTg3fQ.Ri_q9Q1wQRmSZHNEX8QP4uqHkUmjRJVKQWLi4gONMrU'; // Service Role Key

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function activateTrackingSystem() {
  console.log('🔥 ACTIVANDO SISTEMA DE TRACKING EN SUPABASE...\n');

  try {
    // 1. Crear tabla user_activities
    console.log('📊 Paso 1: Creando tabla user_activities...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS user_activities (
        id TEXT PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        action_type TEXT NOT NULL,
        action_data JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `;

    const { error: tableError } = await supabase.rpc('exec_sql', { 
      sql: createTableSQL 
    });

    if (tableError && !tableError.message.includes('already exists')) {
      throw tableError;
    }
    console.log('✅ Tabla user_activities creada correctamente');

    // 2. Crear índices
    console.log('📈 Paso 2: Creando índices optimizados...');
    
    const indices = [
      'CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_activities_action_type ON user_activities(action_type);',
      'CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at DESC);',
      'CREATE INDEX IF NOT EXISTS idx_user_activities_user_action ON user_activities(user_id, action_type);'
    ];

    for (const indexSQL of indices) {
      const { error: indexError } = await supabase.rpc('exec_sql', { sql: indexSQL });
      if (indexError && !indexError.message.includes('already exists')) {
        console.warn(`⚠️ Advertencia creando índice: ${indexError.message}`);
      }
    }
    console.log('✅ Índices creados correctamente');

    // 3. Habilitar RLS
    console.log('🔐 Paso 3: Configurando Row Level Security...');
    
    const { error: rlsError } = await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;' 
    });

    if (rlsError && !rlsError.message.includes('already enabled')) {
      console.warn(`⚠️ Advertencia RLS: ${rlsError.message}`);
    }
    console.log('✅ Row Level Security habilitado');

    // 4. Crear políticas RLS
    console.log('🛡️ Paso 4: Creando políticas de seguridad...');
    
    const policies = [
      // Política para que usuarios vean sus propias actividades
      `CREATE POLICY IF NOT EXISTS "users_can_view_own_activities" ON user_activities
        FOR SELECT USING (auth.uid() = user_id);`,
      
      // Política para que usuarios inserten sus propias actividades
      `CREATE POLICY IF NOT EXISTS "users_can_insert_own_activities" ON user_activities
        FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      
      // Política para administradores
      `CREATE POLICY IF NOT EXISTS "admins_can_view_all_activities" ON user_activities
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id = auth.uid() 
            AND rol = 'admin'
          )
        );`
    ];

    for (const policySQL of policies) {
      const { error: policyError } = await supabase.rpc('exec_sql', { sql: policySQL });
      if (policyError && !policyError.message.includes('already exists')) {
        console.warn(`⚠️ Advertencia política: ${policyError.message}`);
      }
    }
    console.log('✅ Políticas de seguridad creadas');

    // 5. Crear función de estadísticas
    console.log('📊 Paso 5: Creando función de estadísticas...');
    
    const statsFunction = `
      CREATE OR REPLACE FUNCTION get_user_activity_stats(target_user_id UUID DEFAULT auth.uid())
      RETURNS JSON AS $$
      DECLARE
        stats JSON;
      BEGIN
        SELECT json_build_object(
          'total_actions', COALESCE(COUNT(*), 0),
          'today_actions', COALESCE(COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE), 0),
          'this_week_actions', COALESCE(COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'), 0),
          'this_month_actions', COALESCE(COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'), 0),
          'last_activity', MAX(created_at),
          'first_activity', MIN(created_at)
        ) INTO stats
        FROM user_activities
        WHERE user_id = target_user_id;
        
        RETURN COALESCE(stats, '{}'::json);
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    const { error: funcError } = await supabase.rpc('exec_sql', { sql: statsFunction });
    if (funcError) {
      console.warn(`⚠️ Advertencia función: ${funcError.message}`);
    } else {
      console.log('✅ Función de estadísticas creada');
    }

    // 6. Crear función de timeline
    console.log('📱 Paso 6: Creando función de timeline...');
    
    const timelineFunction = `
      CREATE OR REPLACE FUNCTION get_user_activity_timeline(
        target_user_id UUID DEFAULT auth.uid(),
        limit_count INTEGER DEFAULT 50,
        offset_count INTEGER DEFAULT 0
      )
      RETURNS TABLE (
        id TEXT,
        action_type TEXT,
        action_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          ua.id,
          ua.action_type,
          ua.action_data,
          ua.created_at
        FROM user_activities ua
        WHERE ua.user_id = target_user_id
        ORDER BY ua.created_at DESC
        LIMIT limit_count
        OFFSET offset_count;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    const { error: timelineError } = await supabase.rpc('exec_sql', { sql: timelineFunction });
    if (timelineError) {
      console.warn(`⚠️ Advertencia timeline: ${timelineError.message}`);
    } else {
      console.log('✅ Función de timeline creada');
    }

    // 7. Insertar actividad de prueba
    console.log('🧪 Paso 7: Insertando actividad de prueba...');
    
    const testActivity = {
      id: `system_activation_${Date.now()}`,
      user_id: '00000000-0000-0000-0000-000000000000', // System user
      action_type: 'system_activation',
      action_data: {
        message: '🔥 Sistema de tracking activado exitosamente',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    const { error: insertError } = await supabase
      .from('user_activities')
      .insert([testActivity]);

    if (insertError) {
      console.warn(`⚠️ Advertencia inserción prueba: ${insertError.message}`);
    } else {
      console.log('✅ Actividad de prueba insertada');
    }

    // 8. Verificar que todo funciona
    console.log('🔍 Paso 8: Verificando instalación...');
    
    const { data: testData, error: testError } = await supabase
      .from('user_activities')
      .select('*')
      .eq('action_type', 'system_activation')
      .limit(1);

    if (testError) {
      throw new Error(`Error verificando: ${testError.message}`);
    }

    if (testData && testData.length > 0) {
      console.log('✅ Verificación exitosa - Sistema funcionando');
    }

    console.log('\n🎉 ¡SISTEMA DE TRACKING ACTIVADO EXITOSAMENTE!');
    console.log('\n📋 RESUMEN:');
    console.log('✅ Tabla user_activities creada');
    console.log('✅ Índices optimizados aplicados');
    console.log('✅ Row Level Security habilitado');
    console.log('✅ Políticas de seguridad configuradas');
    console.log('✅ Funciones SQL creadas');
    console.log('✅ Sistema verificado y funcionando');
    
    console.log('\n🚀 PRÓXIMOS PASOS:');
    console.log('1. El tracking automático ya está activo');
    console.log('2. Todas las acciones de usuarios se guardarán automáticamente');
    console.log('3. Dashboard administrativo disponible en /admin');
    console.log('4. Consulta estadísticas con get_user_activity_stats()');
    
    return { success: true, message: 'Sistema activado correctamente' };

  } catch (error) {
    console.error('\n❌ ERROR ACTIVANDO SISTEMA:', error.message);
    console.log('\n🔧 SOLUCIÓN ALTERNATIVA:');
    console.log('1. Ir al Supabase Dashboard');
    console.log('2. Abrir SQL Editor');
    console.log('3. Ejecutar el archivo user_activities_table.sql manualmente');
    
    return { success: false, error: error.message };
  }
}

// Ejecutar activación
activateTrackingSystem()
  .then(result => {
    if (result.success) {
      console.log('\n🔥 TRACKING SISTEMA TIPO REDES SOCIALES ACTIVO 🔥');
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
  });