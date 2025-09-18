import React from 'react';
import LiveStreamComponent from '../../components/organizer/LiveStreamComponent';
import { useRole } from '../../context/RoleContext';

const LiveStreamPage = () => {
  const { hasPermission } = useRole();
  return (
    <div>
      <h1>Transmisión en Vivo</h1>
      {hasPermission('stream:start') ? (
        <LiveStreamComponent />
      ) : (
        <p>Solo puedes ver transmisiones en vivo.</p>
      )}
    </div>
  );
};

export default LiveStreamPage;
