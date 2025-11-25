describe('Login Google FutPro Producción', () => {
  it('debe mostrar el botón de Google y permitir el flujo de login', () => {
    cy.visit('https://futpro.vip');
    cy.contains('Iniciar sesión con Google').should('be.visible').click();

    // Espera el redireccionamiento a Google
    cy.origin('https://accounts.google.com', () => {
      cy.get('input[type="email"]').type(Cypress.env('google_email'));
      cy.get('#identifierNext').click();
      cy.get('input[type="password"]').type(Cypress.env('google_password'));
      cy.get('#passwordNext').click();
    });

    // Espera volver a FutPro y verifica que el usuario está logueado
    cy.url().should('include', '/');
    cy.contains('Bienvenido').should('exist');
  });
});
