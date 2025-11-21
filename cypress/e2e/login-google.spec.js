describe('Login Google FutPro', () => {
  it('debe iniciar sesión con Google correctamente', () => {
    cy.visit('https://futpro.vip');
    cy.contains('Iniciar sesión con Google').click();

    // Espera el redireccionamiento a Google
    cy.origin('https://accounts.google.com', () => {
      // Aquí puedes automatizar el login si tienes un usuario de test
      // cy.get('input[type="email"]').type('usuario-test@gmail.com');
      // cy.get('#identifierNext').click();
      // cy.get('input[type="password"]').type('contraseña-test');
      // cy.get('#passwordNext').click();
    });

    // Espera volver a FutPro y verifica que el usuario está logueado
    cy.url().should('include', '/');
    cy.contains('Bienvenido').should('exist');
  });
});
