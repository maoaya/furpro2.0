import React, { useEffect, useState } from 'react';
import OrganizerLayout from './OrganizerLayout';
import axios from 'axios';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get('/api/notifications').then(res => setNotifications(res.data));
  }, []);

  return (
    <OrganizerLayout title="Notificaciones">
      <ul>
        {notifications.map(n => (
          <li key={n.id}>
            <strong>{n.title}</strong>: {n.message} <span>({n.date})</span>
          </li>
        ))}
      </ul>
    </OrganizerLayout>
  );
}
