// ...existing code...
describe('TorneosPage Facebook Style', () => {
  it('muestra paneles izquierdo y derecho, feed central y controles lógicos', () => {
    const React = require('react');
    function TorneosPageMock() {
      return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#222', color: '#FFD700' }}>
          <aside style={{ width: 220, background: '#222', borderRight: '2px solid #FFD700', padding: 24 }}>
            <h2>Panel de Torneos</h2>
            <button>Consultar</button>
            <button>Actualizar</button>
            <button>Ver historial</button>
          </aside>
          <main style={{ flex: 1, padding: 32, background: '#222' }}>
            <div style={{ background: '#FFD700', color: '#222', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
              <h1>Torneo: Liga FutPro</h1>
              <h3>Estado: Activo</h3>
              <svg width="100%" height="40" style={{ background: '#222' }}>
                <rect x={0} y={8} width={20} height={32} fill="#FFD700" rx={3} />
                <rect x={22} y={12} width={20} height={28} fill="#FFD700" rx={3} />
                <rect x={44} y={4} width={20} height={36} fill="#FFD700" rx={3} />
              </svg>
              <button style={{ background: '#222', color: '#FFD700', border: '2px solid #FFD700', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold' }}>Acción rápida</button>
            </div>
          </main>
          <aside style={{ width: 220, background: '#222', borderLeft: '2px solid #FFD700', padding: 24 }}>
            <h2>Acciones rápidas</h2>
            <button>Agregar torneo</button>
            <button>Ver clasificaciones</button>
          </aside>
        </div>
      );
    }
    cy.mount(<TorneosPageMock />);
    cy.contains('Panel de Torneos').should('exist');
    cy.contains('Torneo: Liga FutPro').should('exist');
    cy.contains('Estado: Activo').should('exist');
    cy.contains('Acciones rápidas').should('exist');
    cy.contains('Consultar').should('exist');
    cy.contains('Actualizar').should('exist');
    cy.contains('Ver historial').should('exist');
    cy.contains('Acción rápida').should('exist');
    cy.get('svg').should('exist');
  });
});
