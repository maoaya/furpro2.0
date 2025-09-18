import React, { useState } from 'react';
import ChatComponent from '../../components/organizer/ChatComponent';
import { useRole } from '../../context/RoleContext';

const allGroups = [
  { id: 'general', name: 'General', perm: 'chat:general' },
  { id: 'staff', name: 'Staff', perm: 'chat:staff' },
  { id: 'equipos', name: 'Equipos', perm: 'chat:all' }
];

const ChatPage = () => {
  const { permissions } = useRole();
  const groups = allGroups.filter(g => permissions.includes(g.perm));
  const [roomId, setRoomId] = useState(groups[0]?.id || 'general');
  const user = 'Organizador';
  return (
    <div>
      <h1>Chat en Tiempo Real</h1>
      <label>Grupo de chat: </label>
      <select value={roomId} onChange={e => setRoomId(e.target.value)}>
        {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>
      <ChatComponent roomId={roomId} user={user} />
    </div>
  );
};

export default ChatPage;
