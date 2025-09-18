

describe('Flujo Usuario - Registro y Login', () => {
  it('Permite registrarse y loguearse', () => {
    cy.visit('/register');
    cy.get('input[name="email"]').type('nuevo@futpro.com');
    cy.get('input[name="password"]').type('Test1234!');
    cy.get('button').contains(/Registrar|Registrarse/).click();
    cy.url().should('include', '/home');
    cy.get('button, a').contains(/Salir|Logout/).click();
    cy.visit('/login');
    cy.get('input[name="email"]').type('nuevo@futpro.com');
    cy.get('input[name="password"]').type('Test1234!');
    cy.get('button').contains(/Entrar|Login/).click();
    cy.url().should('include', '/home');
  });
});

describe('Flujo Usuario - Perfil y Edición', () => {
  beforeEach(() => {
    cy.login('nuevo@futpro.com', 'Test1234!');
    cy.visit('/profile');
  });

  it('Permite ver y editar perfil', () => {
    cy.get('h2').contains(/Perfil|Profile/);
    cy.get('button, a').contains(/Editar|Edit/).click();
    cy.get('input[name="nombre"]').clear().type('Nuevo Nombre');
    cy.get('button').contains(/Guardar|Save/).click();
    cy.get('div').contains('Nuevo Nombre');
  });
});

describe('Torneos - Listado y Registro', () => {
  beforeEach(() => {
    cy.login('nuevo@futpro.com', 'Test1234!');
    cy.visit('/torneos');
  });

  it('Muestra torneos y permite inscribirse', () => {
    cy.get('h2').contains(/Torneos|Tournaments/);
    cy.get('button, a').contains(/Inscribirse|Join/).first().click();
    cy.get('div').contains(/Inscrito|Registrado/);
  });
});

describe('PWA - Instalación y Offline', () => {
  it('Muestra banner de instalación y funciona offline', () => {
    cy.visit('/');
    cy.window().then(win => {
      // Simular evento beforeinstallprompt
      win.dispatchEvent(new Event('beforeinstallprompt'));
    });
    cy.get('button, a').contains(/Instalar|Install/);
    // Simular offline
    cy.exec('npx cypress-network-idle --offline');
    cy.reload();
    cy.get('div').contains(/offline|sin conexión/i);
    cy.exec('npx cypress-network-idle --online');
  });
});
