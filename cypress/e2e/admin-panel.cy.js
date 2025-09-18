

describe('Panel Admin - Gestión de Usuarios', () => {
  beforeEach(() => {
    cy.visit('/admin/usuarios');
    // Simular login admin si es necesario
    // cy.login('admin@futpro.com', 'adminpass');
  });

  it('Carga la tabla de usuarios y permite buscar', () => {
    cy.get('h2').contains('Gestión de Usuarios');
    cy.get('input[placeholder*="Buscar"]').type('juan');
    cy.get('table').should('exist');
  });

  it('Permite paginar usuarios', () => {
    cy.get('button').contains('Siguiente').click();
    cy.get('span').contains('Página');
    cy.get('button').contains('Anterior').click();
  });

  it('Permite promover, bloquear y eliminar usuario', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').contains(/Promover|Bloquear|Eliminar/).first().click();
    });
    cy.get('button').contains('Confirmar').click();
    cy.get('div').contains(/Usuario|bloqueado|eliminado/);
  });
});

describe('Panel Admin - Backup', () => {
  beforeEach(() => {
    cy.visit('/admin/config');
  });

  it('Permite exportar backup', () => {
    cy.get('button').contains('Exportar Backup').click();
    // Validar descarga (simulado)
  });
});
