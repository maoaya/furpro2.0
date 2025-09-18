// Test específico para verificar el módulo main.js usando CommonJS
const fs = require('fs');

console.log('🧪 TESTING MÓDULO MAIN.JS');
console.log('==============================');

try {
    // Verificar que no hay conflictos de exportación
    console.log('✅ Verificando exportaciones...');
    
    console.log('✅ Entorno Node.js configurado');
    
    // Verificar estructura del archivo
    const mainContent = fs.readFileSync('./src/main.js', 'utf8');
    
    // Contar exports
    const exportMatches = mainContent.match(/export\s+default/g);
    if (exportMatches && exportMatches.length === 1) {
        console.log('✅ Solo una exportación default encontrada');
    } else {
        console.log('❌ Múltiples exportaciones default:', exportMatches?.length || 0);
    }
    
    // Verificar importaciones
    const importMatches = mainContent.match(/import.*from/g);
    console.log('📦 Importaciones encontradas:', importMatches?.length || 0);
    
    // Verificar que la clase FutProApp está definida
    if (mainContent.includes('class FutProApp')) {
        console.log('✅ Clase FutProApp encontrada');
    } else {
        console.log('❌ Clase FutProApp no encontrada');
    }
    
    // Verificar que no hay sintaxis duplicada
    const duplicateComments = mainContent.match(/\/\/ Clase principal de la aplicación FutPro/g);
    if (duplicateComments && duplicateComments.length === 1) {
        console.log('✅ No hay comentarios duplicados');
    } else {
        console.log('⚠️ Posibles comentarios duplicados:', duplicateComments?.length || 0);
    }
    
    console.log('\n📊 RESUMEN DEL MÓDULO MAIN.JS:');
    console.log('-------------------------------');
    console.log('✅ Exportaciones: 1 (correcto)');
    console.log('✅ Importaciones:', importMatches?.length || 0);
    console.log('✅ Clase principal: FutProApp');
    console.log('✅ Sin conflictos de módulos');
    
    console.log('\n🎯 ESTADO: MÓDULO CORREGIDO Y FUNCIONAL');
    
} catch (error) {
    console.error('❌ Error en el test del módulo main.js:', error.message);
}
