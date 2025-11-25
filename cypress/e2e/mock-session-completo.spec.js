describe('Mock sesión FutPro registro completo', () => {
  it('simula usuario logueado y registrado', () => {
    cy.visit('https://futpro.vip', {
      onBeforeLoad(win) {
        win.localStorage.setItem('futpro-auth-token', JSON.stringify({
          access_token: 'TOKEN_DE_PRUEBA',
          user: { email: 'usuario.test@gmail.com', id: '123', nombre: 'Test', apellido: 'Usuario' }
        }));
        win.localStorage.setItem('futpro_user_card_data', JSON.stringify({
          nombre: 'Test',
          apellido: 'Usuario',
          email: 'usuario.test@gmail.com',
          id: '123',
          perfil: 'Jugador',
          equipo: 'Demo FC',
          puntaje: 100,
          fecha_registro: new Date().toISOString(),
          avatar_url: '',
          esPrimeraCard: false
        }));
      }
    });
    cy.contains('Bienvenido').should('exist');
  });
});
