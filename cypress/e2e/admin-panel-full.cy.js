/// <reference types="cypress" />

describe('Panel Admin - Pagos', () => {
  beforeEach(() => {
    cy.visit('/admin/pagos');
  });

  it('Carga la tabla de pagos y permite buscar', () => {
    cy.get('h2').contains('Gestión de Pagos');
    cy.get('input[placeholder*="Buscar"]').type('ana');
    cy.get('table').should('exist');
  });

  it('Permite paginar pagos', () => {
    cy.get('button').contains('Siguiente').click();
    cy.get('span').contains('Página');
    cy.get('button').contains('Anterior').click();
  });

  it('Permite marcar pago como pagado y exportar', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').contains(/Marcar pagado|Exportar/).first().click();
    });
    cy.get('button').contains('Confirmar').click();
    cy.get('div').contains(/Pago marcado|exportado/);
  });
});

describe('Panel Admin - Reportes', () => {
  beforeEach(() => {
    cy.visit('/admin/reportes');
  });

  it('Carga la tabla de reportes y permite buscar', () => {
    cy.get('h2').contains('Gestión de Reportes');
    cy.get('input[placeholder*="Buscar"]').type('spam');
    cy.get('table').should('exist');
  });

  it('Permite ver detalle, resolver y exportar reporte', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').contains(/Ver|Resolver|Exportar/).first().click();
    });
    cy.get('button').contains('Confirmar').click();
    cy.get('div').contains(/resuelto|exportado/);
  });
});

describe('Panel Admin - Notificaciones', () => {
  beforeEach(() => {
    cy.visit('/admin/notificaciones');
  });

  it('Permite enviar notificación y buscar en historial', () => {
    cy.get('input[name="titulo"]').type('Test Noti');
    cy.get('input[name="cuerpo"]').type('Mensaje de prueba');
    cy.get('button').contains('Enviar').click();
    cy.get('input[placeholder*="Buscar"]').type('Test Noti');
    cy.get('table').should('exist');
  });
});

describe('Panel Admin - Auditoría', () => {
  beforeEach(() => {
    cy.visit('/admin/auditoria');
  });

  it('Carga logs y permite buscar y exportar', () => {
    cy.get('h2').contains('Auditoría y Logs');
    cy.get('input[placeholder*="Buscar"]').type('admin');
    cy.get('table').should('exist');
    cy.get('button').contains('Exportar').first().click();
    cy.get('button').contains('Confirmar').click();
    cy.get('div').contains('exportado');
  });
});

describe('Panel Admin - Estadísticas', () => {
  beforeEach(() => {
    cy.visit('/admin/estadisticas');
  });

  it('Muestra métricas clave', () => {
    cy.get('h2').contains('Estadísticas y Métricas');
    cy.get('div').contains('Usuarios');
    cy.get('div').contains('Pagos totales');
    cy.get('div').contains('Pagos pendientes');
    cy.get('div').contains('Reportes');
  });
});
