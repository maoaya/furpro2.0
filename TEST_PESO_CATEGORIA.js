/**
 * TEST PESO Y CATEGORÍA
 * 
 * Copia este código en DevTools Console del navegador para verificar
 * que peso y categoría se guardan correctamente
 */

// ============================================================================
// TEST 1: Verificar datos en localStorage después de registro
// ============================================================================
console.log('=== TEST 1: localStorage ===');

const cardData = JSON.parse(localStorage.getItem('futpro_user_card_data') || '{}');
console.log('📦 futpro_user_card_data:', {
  peso: cardData.peso,
  categoria: cardData.categoria,
  nombre: cardData.nombre,
  puntos_totales: cardData.puntos_totales,
  card_tier: cardData.card_tier
});

// ============================================================================
// TEST 2: Verificar datos en pendingProfileData
// ============================================================================
console.log('\n=== TEST 2: pendingProfileData ===');

const pendingData = JSON.parse(localStorage.getItem('pendingProfileData') || '{}');
console.log('💾 pendingProfileData:', {
  peso: pendingData.peso,
  categoria: pendingData.categoria,
  nombre: pendingData.nombre
});

// ============================================================================
// TEST 3: Verificar que Supabase recibió los datos
// ============================================================================
console.log('\n=== TEST 3: Supabase API Test ===');

// Primero obtén el token desde AuthContext o localStorage
const authToken = localStorage.getItem('sb-qqrxetxcglwrejtblwut-auth-token');
if (authToken) {
  const token = JSON.parse(authToken).session.access_token;
  const userId = JSON.parse(authToken).session.user.id;
  
  fetch('https://qqrxetxcglwrejtblwut.supabase.co/rest/v1/carfutpro?user_id=eq.' + userId, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Reemplaza con tu key
    }
  })
  .then(r => r.json())
  .then(data => {
    if (data.length > 0) {
      const card = data[0];
      console.log('✅ Card en Supabase:', {
        peso: card.peso,
        categoria: card.categoria,
        nombre: card.nombre,
        puntos_totales: card.puntos_totales,
        card_tier: card.card_tier
      });
    } else {
      console.log('⚠️ No se encontró card en Supabase');
    }
  })
  .catch(e => console.error('❌ Error en query:', e));
} else {
  console.log('⚠️ No se encontró token de autenticación');
}

// ============================================================================
// TEST 4: Valores ESPERADOS vs REALES
// ============================================================================
console.log('\n=== TEST 4: Validación ===');

const tests = [
  {
    nombre: 'Peso debe ser número o null',
    valor: cardData.peso,
    valido: typeof cardData.peso === 'number' || cardData.peso === null || cardData.peso === '',
    esperado: 'número (ej: 75)'
  },
  {
    nombre: 'Categoría debe ser una de: masculina, femenina, infantil_masculina, infantil_femenina',
    valor: cardData.categoria,
    valido: ['masculina', 'femenina', 'infantil_masculina', 'infantil_femenina'].includes(cardData.categoria),
    esperado: 'una de esas 4 opciones'
  },
  {
    nombre: 'Puntos totales debe iniciar en 0',
    valor: cardData.puntos_totales,
    valido: cardData.puntos_totales === 0,
    esperado: 0
  },
  {
    nombre: 'Card tier debe ser Bronce (inicial)',
    valor: cardData.card_tier,
    valido: cardData.card_tier === 'Bronce',
    esperado: 'Bronce'
  }
];

tests.forEach(test => {
  const estado = test.valido ? '✅' : '❌';
  console.log(`${estado} ${test.nombre}`);
  console.log(`   Valor actual: ${test.valor}`);
  console.log(`   Esperado: ${test.esperado}`);
  if (!test.valido) console.log(`   ⚠️ REVISAR`);
});

// ============================================================================
// TEST 5: Simular registro completo
// ============================================================================
console.log('\n=== TEST 5: Simulación de Registro ===');

const simulatedFormData = {
  nombre: 'Juan',
  apellido: 'Pérez',
  peso: 75,
  categoria: 'masculina',
  edad: 25,
  ciudad: 'Madrid',
  pais: 'España',
  posicion: 'Delantero'
};

console.log('📝 Datos ingresados en formulario:', simulatedFormData);
console.log('✅ ESPERADO EN CARD:');
console.log('   peso: "75"');
console.log('   categoria: "masculina"');
console.log('   En pantalla: "75 kg" y "Masculina"');

// ============================================================================
// RESULTADO FINAL
// ============================================================================
console.log('\n=== ✅ RESULTADO FINAL ===');
if (cardData.peso && cardData.categoria) {
  console.log('✅ PESO Y CATEGORÍA ESTÁN FUNCIONANDO CORRECTAMENTE');
  console.log('   Peso:', cardData.peso, 'kg');
  console.log('   Categoría:', cardData.categoria);
} else {
  console.log('❌ PESO Y/O CATEGORÍA NO SE GUARDARON');
  console.log('   Acciones:');
  console.log('   1. Borra localStorage: localStorage.clear()');
  console.log('   2. Recarga la página');
  console.log('   3. Vuelve a registrarte');
}
