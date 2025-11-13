/**
 * 🔥 PRUEBA E2E: FLUJO OAUTH → REGISTRO PERFIL → CARD → HOMEPAGE
 * 
 * Simula el flujo completo de un usuario que:
 * 1. Accede al formulario de registro completo
 * 2. Hace clic en "Continuar con Google"
 * 3. Completa OAuth (simulado con intercepts)
 * 4. Es redirigido a /registro-perfil (pantalla intermedia)
 * 5. Completa su perfil y navega a /perfil-card
 * 6. Ve su Card generada
 * 7. Hace clic en "Continuar" y llega a homepage-instagram.html
 */

describe('Flujo OAuth → Registro Perfil → Card → Homepage', () => {
  beforeEach(() => {
    // Limpiar estado previo
    cy.clearLocalStorage();
    cy.clearCookies();
    
    // Interceptar llamadas a Supabase Auth
    cy.intercept('POST', '**/auth/v1/token*', {
      statusCode: 200,
      body: {
        access_token: 'mock-access-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: {
          id: 'test-user-id-123',
          email: 'test@futpro.com',
          user_metadata: {
            full_name: 'Test Player',
            avatar_url: 'https://via.placeholder.com/150'
          }
        }
      }
    }).as('authToken');

    // Interceptar callback de OAuth
    cy.intercept('GET', '**/auth/v1/callback*', {
      statusCode: 200,
      body: { success: true }
    }).as('oauthCallback');

    // Interceptar consulta de usuario en Supabase
    cy.intercept('GET', '**/rest/v1/usuarios*', {
      statusCode: 200,
      body: []
    }).as('getUser');

    // Interceptar inserción/actualización de carfutpro
    cy.intercept('POST', '**/rest/v1/carfutpro*', {
      statusCode: 201,
      body: {
        id: 'card-test-123',
        user_id: 'test-user-id-123',
        nombre: 'Test',
        apellidos: 'Player',
        posicion: 'Delantero',
        puntaje: 75
      }
    }).as('upsertCard');

    cy.intercept('PATCH', '**/rest/v1/carfutpro*', {
      statusCode: 200,
      body: { success: true }
    }).as('updateCard');
  });

  it('Completa el flujo desde formulario de registro hasta homepage', () => {
    // PASO 1: Acceder al formulario de registro
    cy.visit('/formulario-registro-completo');
    cy.contains('Formulario de Registro', { timeout: 10000 }).should('be.visible');

    // PASO 2: Hacer clic en "Continuar con Google"
    cy.get('[data-testid="btn-google-oauth"]', { timeout: 5000 })
      .or('button:contains("Continuar con Google")')
      .first()
      .click();

    // Verificar que se establecen los flags en localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('post_auth_target')).to.equal('/registro-perfil');
      expect(win.localStorage.getItem('oauth_origin')).to.equal('formulario_registro');
    });

    // PASO 3: Simular callback exitoso de OAuth
    // (En la realidad, Supabase redirige a /auth/callback con tokens)
    cy.visit('/auth/callback?access_token=mock-token&type=signup');
    
    // Esperar a que el callback procese
    cy.wait('@authToken', { timeout: 5000 }).then(() => {
      // El callback debe redirigir a /registro-perfil según post_auth_target
      cy.url({ timeout: 10000 }).should('include', '/registro-perfil');
    });

    // PASO 4: Completar perfil en /registro-perfil
    cy.contains('Completa tu perfil', { timeout: 10000 }).should('be.visible');
    
    // Rellenar campos del perfil (ajustar selectores según el componente real)
    cy.get('input[name="nombre"]', { timeout: 5000 })
      .or('input[placeholder*="Nombre"]')
      .first()
      .clear()
      .type('Test');
    
    cy.get('input[name="apellidos"]', { timeout: 5000 })
      .or('input[placeholder*="Apellidos"]')
      .first()
      .clear()
      .type('Player');

    // Seleccionar posición
    cy.get('select[name="posicion"]', { timeout: 5000 })
      .or('select')
      .first()
      .select('Delantero');

    // Guardar perfil y navegar a Card
    cy.get('button:contains("Guardar")', { timeout: 5000 })
      .or('button:contains("Continuar")')
      .first()
      .click();

    // Esperar la creación de la card
    cy.wait('@upsertCard', { timeout: 5000 });

    // PASO 5: Verificar que se muestra la Card en /perfil-card
    cy.url({ timeout: 10000 }).should('include', '/perfil-card');
    cy.contains('Test Player', { timeout: 10000 }).or('contains("Test")').should('be.visible');

    // Verificar que la card se renderiza con datos correctos
    cy.get('[data-testid="player-card"]', { timeout: 5000 })
      .or('.player-card')
      .should('be.visible');

    // PASO 6: Hacer clic en "Continuar" para ir a homepage
    cy.get('button:contains("Continuar")', { timeout: 5000 })
      .first()
      .click();

    // PASO 7: Verificar llegada a homepage-instagram.html
    cy.url({ timeout: 10000 }).should('include', '/homepage-instagram');
    cy.contains('FutPro', { timeout: 10000 }).should('be.visible');

    // Verificar que los flags de navegación fueron limpiados
    cy.window().then((win) => {
      expect(win.localStorage.getItem('show_first_card')).to.be.null;
      expect(win.localStorage.getItem('post_auth_target')).to.be.null;
      expect(win.localStorage.getItem('oauth_origin')).to.be.null;
    });
  });

  it('Maneja error de OAuth y redirige a login', () => {
    // Interceptar error de OAuth
    cy.intercept('POST', '**/auth/v1/token*', {
      statusCode: 401,
      body: { error: 'invalid_grant' }
    }).as('authError');

    cy.visit('/formulario-registro-completo');
    
    cy.get('[data-testid="btn-google-oauth"]', { timeout: 5000 })
      .or('button:contains("Continuar con Google")')
      .first()
      .click();

    // Simular callback con error
    cy.visit('/auth/callback?error=access_denied');
    
    // Debe redirigir a /login en caso de error
    cy.url({ timeout: 10000 }).should('include', '/login');
  });

  it('Redirige a /seleccionar-categoria si no hay post_auth_target', () => {
    // No establecer post_auth_target antes del callback
    cy.visit('/auth/callback?access_token=mock-token&type=signup');
    
    cy.wait('@authToken', { timeout: 5000 });
    
    // Sin target, debe ir a seleccionar-categoria por defecto
    cy.url({ timeout: 10000 }).should('include', '/seleccionar-categoria');
  });
});

describe('Flujo directo a Card desde OAuth (opcional)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();

    // Interceptores de Supabase
    cy.intercept('POST', '**/auth/v1/token*', {
      statusCode: 200,
      body: {
        access_token: 'mock-token',
        user: {
          id: 'user-123',
          email: 'direct@futpro.com'
        }
      }
    }).as('authToken');

    cy.intercept('POST', '**/rest/v1/carfutpro*', {
      statusCode: 201,
      body: { id: 'card-direct', user_id: 'user-123' }
    }).as('upsertCardDirect');
  });

  it('Callback con target=/perfil-card realiza upsert de carfutpro', () => {
    // Establecer flags para ir directo a Card
    cy.visit('/formulario-registro-completo');
    cy.window().then((win) => {
      win.localStorage.setItem('post_auth_target', '/perfil-card');
      win.localStorage.setItem('oauth_origin', 'formulario_registro');
      win.localStorage.setItem('draft_carfutpro', JSON.stringify({
        nombre: 'Direct',
        apellidos: 'User',
        posicion: 'Mediocampista',
        puntaje: 80
      }));
    });

    // Simular callback
    cy.visit('/auth/callback?access_token=mock-token');
    cy.wait('@authToken');
    cy.wait('@upsertCardDirect', { timeout: 5000 });

    // Debe llegar a /perfil-card
    cy.url({ timeout: 10000 }).should('include', '/perfil-card');
    cy.contains('Direct', { timeout: 10000 }).should('be.visible');
  });
});
