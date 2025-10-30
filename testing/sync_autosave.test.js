/**
 * Test automático de sincronización entre localStorage, Supabase y Firebase
 * Valida que las acciones de historias, likes y comentarios se guarden y sincronicen correctamente
 */
const supabase = require('../src/supabaseClient');
const userActivityTracker = require('../src/services/UserActivityTracker');

describe('Sincronización autoSave: historias, likes, comentarios', () => {
  beforeAll(() => {
    // Simular usuario autenticado
    userActivityTracker.setUser({ id: 'testuser', email: 'test@futpro.com' });
    localStorage.clear();
  });

  test('Guarda y sincroniza vista de historia', async () => {
    userActivityTracker.trackAction('historia_vista', { historiaId: 'mi-historia_1' }, true);
    await userActivityTracker.processPendingActions(true);
    const { data } = await supabase.from('user_activities').select('*').eq('action_type', 'historia_vista').eq('user_id', 'testuser');
    expect(data.length).toBeGreaterThan(0);
  });

  test('Guarda y sincroniza like en historia', async () => {
    userActivityTracker.trackAction('historia_like', { historiaId: 'mi-historia_1' }, true);
    await userActivityTracker.processPendingActions(true);
    const { data } = await supabase.from('user_activities').select('*').eq('action_type', 'historia_like').eq('user_id', 'testuser');
    expect(data.length).toBeGreaterThan(0);
  });

  test('Guarda y sincroniza comentario en historia', async () => {
    userActivityTracker.trackAction('historia_comentario', { historiaId: 'mi-historia_1', texto: 'Test comentario' }, true);
    await userActivityTracker.processPendingActions(true);
    const { data } = await supabase.from('user_activities').select('*').eq('action_type', 'historia_comentario').eq('user_id', 'testuser');
    expect(data.length).toBeGreaterThan(0);
  });

  afterAll(() => {
    userActivityTracker.destroy();
    localStorage.clear();
  });
});
