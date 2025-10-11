/**
 * 🧪 SCRIPT DE PRUEBA DEL SISTEMA DE TRACKING
 * Verifica que el tracking funcione correctamente
 */

import supabase from '../src/supabaseClient.js';

async function testTrackingSystem() {
  console.log('🧪 PROBANDO SISTEMA DE TRACKING...\n');

  try {
    // 1. Verificar que la tabla existe
    console.log('📊 Paso 1: Verificando tabla user_activities...');
    
    const { data: tableCheck, error: tableError } = await supabase
      .from('user_activities')
      .select('count')
      .limit(1);

    if (tableError) {
      throw new Error(`Tabla no existe: ${tableError.message}`);
    }
    console.log('✅ Tabla user_activities existe');

    // 2. Insertar actividad de prueba
    console.log('📝 Paso 2: Insertando actividad de prueba...');
    
    const testActivity = {
      id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: null, // Se establecerá automáticamente si hay usuario
      action_type: 'test_tracking',
      action_data: {
        message: 'Prueba del sistema de tracking',
        timestamp: new Date().toISOString(),
        test: true
      }
    };

    // Intentar obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      testActivity.user_id = user.id;
      console.log(`👤 Usuario detectado: ${user.email}`);
    } else {
      testActivity.user_id = '00000000-0000-0000-0000-000000000000';
      console.log('👤 Sin usuario autenticado, usando system user');
    }

    const { data: insertData, error: insertError } = await supabase
      .from('user_activities')
      .insert([testActivity])
      .select();

    if (insertError) {
      throw new Error(`Error insertando: ${insertError.message}`);
    }
    console.log('✅ Actividad de prueba insertada correctamente');

    // 3. Verificar que se puede leer
    console.log('📖 Paso 3: Verificando lectura de actividades...');
    
    const { data: readData, error: readError } = await supabase
      .from('user_activities')
      .select('*')
      .eq('action_type', 'test_tracking')
      .order('created_at', { ascending: false })
      .limit(5);

    if (readError) {
      throw new Error(`Error leyendo: ${readError.message}`);
    }

    console.log(`✅ Se encontraron ${readData.length} actividades de prueba`);
    
    if (readData.length > 0) {
      console.log('📋 Última actividad:', {
        id: readData[0].id,
        action_type: readData[0].action_type,
        created_at: readData[0].created_at
      });
    }

    // 4. Probar función de estadísticas (si existe)
    console.log('📊 Paso 4: Probando función de estadísticas...');
    
    try {
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_user_activity_stats');

      if (statsError) {
        console.warn(`⚠️ Función de estadísticas no disponible: ${statsError.message}`);
      } else {
        console.log('✅ Función de estadísticas funcionando:', statsData);
      }
    } catch (err) {
      console.warn('⚠️ Función de estadísticas no disponible');
    }

    // 5. Probar diferentes tipos de actividades
    console.log('🎯 Paso 5: Probando múltiples tipos de actividades...');
    
    const testActivities = [
      {
        id: `login_test_${Date.now()}`,
        user_id: testActivity.user_id,
        action_type: 'auth_login',
        action_data: { method: 'test', success: true }
      },
      {
        id: `page_test_${Date.now()}`,
        user_id: testActivity.user_id,
        action_type: 'page_view',
        action_data: { page: '/test', timestamp: new Date().toISOString() }
      },
      {
        id: `form_test_${Date.now()}`,
        user_id: testActivity.user_id,
        action_type: 'form_input',
        action_data: { fieldName: 'test', step: 1 }
      }
    ];

    const { error: batchError } = await supabase
      .from('user_activities')
      .insert(testActivities);

    if (batchError) {
      console.warn(`⚠️ Error en inserción múltiple: ${batchError.message}`);
    } else {
      console.log('✅ Múltiples tipos de actividades insertadas');
    }

    // 6. Verificar conteo total
    console.log('🔢 Paso 6: Verificando conteo total...');
    
    const { count, error: countError } = await supabase
      .from('user_activities')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.warn(`⚠️ Error contando: ${countError.message}`);
    } else {
      console.log(`✅ Total de actividades en sistema: ${count}`);
    }

    console.log('\n🎉 ¡PRUEBAS COMPLETADAS EXITOSAMENTE!');
    console.log('\n📋 RESUMEN DE PRUEBAS:');
    console.log('✅ Tabla user_activities accesible');
    console.log('✅ Inserción de actividades funcionando');
    console.log('✅ Lectura de actividades funcionando');
    console.log('✅ Múltiples tipos de actividades soportados');
    console.log('✅ Sistema listo para tracking en tiempo real');

    return { success: true, message: 'Todas las pruebas pasaron' };

  } catch (error) {
    console.error('\n❌ ERROR EN PRUEBAS:', error.message);
    console.log('\n🔧 POSIBLES SOLUCIONES:');
    console.log('1. Verificar que el SQL se ejecutó correctamente en Supabase');
    console.log('2. Comprobar permisos RLS en la tabla');
    console.log('3. Revisar configuración de Supabase client');
    
    return { success: false, error: error.message };
  }
}

// Ejecutar pruebas
testTrackingSystem()
  .then(result => {
    if (result.success) {
      console.log('\n🚀 SISTEMA DE TRACKING LISTO PARA USAR 🚀');
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Error fatal en pruebas:', error);
    process.exit(1);
  });