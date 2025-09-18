import React from 'react';

const PublicidadTira = ({ publicidades }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      background: 'rgba(34,34,34,0.95)',
      color: '#FFD700',
      display: 'flex',
      alignItems: 'center',
      overflowX: 'auto',
      zIndex: 1000,
      height: '56px',
      borderTop: '2px solid #FFD700',
      boxShadow: '0 -2px 8px rgba(0,0,0,0.15)'
    }}>
      {publicidades && publicidades.length > 0 ? (
        publicidades.map((pub, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '0 24px', minWidth: '200px', fontWeight: 'bold', fontSize: '1.1rem' }}>
            {pub.logo && <img src={pub.logo} alt={pub.marca} style={{ height: '32px', marginRight: '12px', borderRadius: '6px' }} />}
            <span>{pub.marca}: {pub.texto}</span>
          </div>
        ))
      ) : (
        <div style={{ padding: '0 24px', fontSize: '1rem' }}>Sin publicidades activas</div>
      )}
    </div>
  );
};

export default PublicidadTira;
