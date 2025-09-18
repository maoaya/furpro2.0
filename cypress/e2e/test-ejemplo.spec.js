// test de ejemplo Cypress
/// <reference types="cypress" />

describe('Test de ejemplo FutPro', () => {
  it('Carga la página principal y verifica elementos clave', () => {
    // Verifica el logo/título principal
    cy.get('h1').contains('FutPro').should('exist');
    // Verifica la barra inferior fija
    cy.get('#main-bottom-bar').should('exist');
    cy.get('#main-bottom-bar').contains('En Vivo').should('exist');
    cy.get('#main-bottom-bar').contains('Ven On Fire').should('exist');
    cy.get('#main-bottom-bar').contains('Notificaciones').should('exist');
    // Verifica el botón de casita en el header
    cy.get('header .fa-home').should('exist');
    // Verifica que el feed principal esté presente
    cy.get('.home-page, .feed-section, #futpro-react-root').should('exist');
    // Verifica que no haya errores visibles
    cy.get('body').should('not.contain', 'Error');
  });
});

// Make sure to run this file using the Cypress Test Runner (e.g., with `npx cypress open` or `npx cypress run`)
