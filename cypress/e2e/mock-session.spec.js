describe('Mock sesión FutPro', () => {
  it('simula usuario logueado', () => {
    cy.visit('https://futpro.vip', {
      onBeforeLoad(win) {
        win.localStorage.setItem('futpro-auth-token', JSON.stringify({
          access_token: 'TOKEN_DE_PRUEBA',
          user: { email: 'usuario.test@gmail.com', id: '123' }
        }));
      }
    });
    cy.contains('Bienvenido').should('exist');
  });
});
