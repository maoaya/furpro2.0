// test-botones.spec.js
// Test automático para validar todos los botones principales de FutPro
// Requiere: Cypress instalado (npm install cypress)

/// <reference types="cypress" />

describe('Validación de botones principales FutPro', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5176'); // Cambiado al puerto correcto según Vite
  });

  it('Feed y reacciones: like, comment, share', () => {
    cy.get('.btn-reaction').should('exist').each(($btn) => {
      cy.wrap($btn).click({ multiple: true });
    });
  });

  it('Streaming y chat', () => {
    cy.get('.btn-primary').contains('Ver').should('exist').click();
    cy.get('.btn-secondary').contains('Chat en Vivo').should('exist').click();
  });

  it('Login/Register', () => {
    cy.get('button').contains('Iniciar sesión').should('exist');
    cy.get('button').contains('Registrarse').should('exist');
    cy.get('button').contains('Cerrar sesión').should('exist');
    cy.get('button').contains('Google').should('exist');
    cy.get('button').contains('Facebook').should('exist');
  });

  it('Penaltis y juego', () => {
    cy.get('button').contains('Penaltis').should('exist').click();
    cy.get('.difficulty-btn').should('exist').each(($btn) => {
      cy.wrap($btn).click({ multiple: true });
    });
    cy.get('.shoot-btn').should('exist').each(($btn) => {
      cy.wrap($btn).click({ multiple: true });
    });
    cy.get('button').contains('Pausar').should('exist');
    cy.get('button').contains('Reiniciar').should('exist');
    cy.get('button').contains('Salir').should('exist');
    cy.get('button').contains('Compartir').should('exist');
  });

  it('Navegación principal', () => {
    cy.get('.nav-item').should('exist').each(($nav) => {
      cy.wrap($nav).click({ multiple: true });
    });
  });

  it('Notificaciones y mensajes', () => {
    cy.get('button').contains('Notificaciones').should('exist').click();
    cy.get('button').contains('Mensajes').should('exist').click();
  });

  it('Streaming avanzado', () => {
    cy.get('button').contains('Probar dispositivos').should('exist');
    cy.get('button').contains('Iniciar stream').should('exist');
    cy.get('button').contains('Cámara').should('exist');
    cy.get('button').contains('Micrófono').should('exist');
    cy.get('button').contains('Pantalla').should('exist');
    cy.get('button').contains('Salir').should('exist');
    cy.get('button').contains('Fullscreen').should('exist');
    cy.get('button').contains('Volumen').should('exist');
    cy.get('button').contains('Enviar').should('exist');
  });
});
