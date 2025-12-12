// Prueba automática Cypress: Redirección Google OAuth en registro FutPro

describe('Registro y redirección Google OAuth', () => {
  it('Redirige correctamente a Google OAuth al finalizar registro', () => {
    cy.visit('https://futpro.vip/formulario-registro');

    // Completa los campos obligatorios del formulario
    cy.get('input[name="email"]').type('testuser+' + Date.now() + '@gmail.com');
    cy.get('input[name="password"]').type('Test1234!');
    cy.get('input[name="confirmPassword"]').type('Test1234!');
    cy.get('input[name="nombre"]').type('Test');
    cy.get('input[name="apellido"]').type('User');
    cy.get('input[name="edad"]').type('25');
    cy.get('select[name="categoria"]').select('masculina');
    cy.get('select[name="pais"]').select('Colombia');
    cy.get('select[name="ciudad"]').select('Bogotá');
    cy.get('select[name="posicion"]').select('Flexible');
    cy.get('select[name="nivelHabilidad"]').select('Principiante');
    cy.get('select[name="frecuenciaJuego"]').select('ocasional');
    cy.get('select[name="horarioPreferido"]').select('tardes');

    // Avanza por los pasos del formulario
    for (let i = 0; i < 4; i++) {
      cy.contains('Siguiente').click();
    }

    // En el paso final, pulsa el botón de Google
    cy.contains('Continuar con Google').click();

    // Valida que la URL de Google OAuth se abre
    cy.url().should('include', 'accounts.google.com/o/oauth2/v2/auth');
    cy.url().should('include', 'client_id=');
    cy.url().should('include', 'redirect_uri=');
    cy.url().should('include', 'scope=email%20profile');
    cy.url().should('include', 'response_type=code');
  });
});
