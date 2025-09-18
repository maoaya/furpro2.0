/// <reference types="cypress" />

describe('Equipos - Listado, Creación y Edición', () => {
  beforeEach(() => {
    cy.login('nuevo@futpro.com', 'Test1234!');
    cy.visit('/equipos');
  });

  it('Muestra equipos y permite crear uno nuevo', () => {
    cy.get('h2').contains(/Equipos|Teams/);
    cy.get('button, a').contains(/Crear|Nuevo/).click();
    cy.get('input[name="nombre"]').type('Equipo Cypress');
    cy.get('button').contains(/Guardar|Save/).click();
    cy.get('div').contains('Equipo Cypress');
  });

  it('Permite editar equipo', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.get('button, a').contains(/Editar|Edit/).click();
    });
    cy.get('input[name="nombre"]').clear().type('Equipo Editado');
    cy.get('button').contains(/Guardar|Save/).click();
    cy.get('div').contains('Equipo Editado');
  });
});

describe('Partidos - Listado y Comentarios', () => {
  beforeEach(() => {
    cy.login('nuevo@futpro.com', 'Test1234!');
    cy.visit('/partidos');
  });

  it('Muestra partidos y permite comentar', () => {
    cy.get('h2').contains(/Partidos|Matches/);
    cy.get('button, a').contains(/Comentar|Comment/).first().click();
    cy.get('textarea').type('¡Buen partido!');
    cy.get('button').contains(/Enviar|Send/).click();
    cy.get('div').contains('¡Buen partido!');
  });
});

describe('Media - Subida y Visualización', () => {
  beforeEach(() => {
    cy.login('nuevo@futpro.com', 'Test1234!');
    cy.visit('/media-upload');
  });

  it('Permite subir foto o video', () => {
    cy.get('h2').contains(/Subir|Upload/);
    cy.get('input[type="file"]').attachFile('test-image.jpg');
    cy.get('button').contains(/Subir|Upload/).click();
    cy.get('div').contains(/subido|uploaded/);
  });
});

describe('Notificaciones Push', () => {
  it('Solicita permiso y recibe notificación', () => {
    cy.visit('/');
    cy.window().then(win => {
      win.Notification.requestPermission = () => Promise.resolve('granted');
    });
    cy.get('button, a').contains(/Permitir|Allow/).click();
    // Simular recepción push
    cy.window().then(win => {
      win.dispatchEvent(new Event('push'));
    });
    cy.get('div').contains(/notificación|notification/);
  });
});

describe('Accesibilidad - Navegación por teclado', () => {
  it('Permite navegar panel admin con Tab y Enter', () => {
    cy.visit('/admin/usuarios');
    cy.get('body').tab();
    cy.focused().should('have.attr', 'aria-label');
    cy.focused().type('{enter}');
  });
});
