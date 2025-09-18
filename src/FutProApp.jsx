import React, { useEffect, useState } from 'react';
import GlobalNav from './components/GlobalNav';

// Importa tus servicios y managers aquí
// import { AuthService, UIManager, ... } from '../services';

const FutProApp = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mainFeed, setMainFeed] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);
  const [notifications, setNotifications] = useState([]);
  // ...otros estados

  // Simulación de managers (reemplaza por tus servicios reales)
  const analyticsManager = {
    getMainFeedPosts: async () => [/* ...posts */],
  };
  const streamManager = {
    getActiveStreams: async () => [/* ...streams */],
  };
  const notificationManager = {
    getUserNotifications: async () => [/* ...notificaciones */],
  };

  useEffect(() => {
    // Cargar datos iniciales
    const fetchData = async () => {
      setMainFeed(await analyticsManager.getMainFeedPosts());
      setLiveStreams(await streamManager.getActiveStreams());
      setNotifications(await notificationManager.getUserNotifications());
    };
    fetchData();
  }, []);

  // Renderizar cards tipo TikTok
  const renderMainFeed = () => (
    <div id="mainFeed">
      {mainFeed.map((post, idx) => (
        <div className="tiktok-card" key={idx}>
          {post.videoUrl ? (
            <video src={post.videoUrl} controls autoPlay loop style={{ width: '100%', maxHeight: 420, objectFit: 'cover' }} />
          ) : (
            <img src={post.imageUrl} alt="post" style={{ width: '100%', maxHeight: 420, objectFit: 'cover' }} />
          )}
          <div className="card-content" style={{ padding: '18px 24px' }}>
            <div className="card-user" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={post.userAvatar} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #FFD700' }} alt="avatar" />
              <span style={{ fontWeight: 600 }}>{post.userName}</span>
            </div>
            <div className="card-desc" style={{ margin: '12px 0', fontSize: '1.1em' }}>{post.description}</div>
            <div className="card-actions" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              <button className="btn-reaction"><i className="fa-solid fa-heart"></i> {post.likes}</button>
              <button className="btn-reaction"><i className="fa-solid fa-comment"></i> {post.comments}</button>
              <button className="btn-reaction"><i className="fa-solid fa-share"></i></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Renderizar transmisiones en vivo
  const renderLiveStreams = () => (
    <div id="liveStreamsPanel">
      {liveStreams.map((stream, idx) => (
        <div className="stream-card animated-stream" key={idx} style={{ background: '#181818', borderRadius: 16, padding: '12px 18px', boxShadow: '0 2px 8px #FFD70022', display: 'flex', alignItems: 'center', gap: 16, animation: 'fadeInUp 0.7s' }}>
          <img src={stream.thumbnail} style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover' }} alt="stream" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: '#FFD700' }}>{stream.title}</div>
            <div style={{ fontSize: '0.95em', color: '#fff' }}>{stream.viewers} espectadores</div>
          </div>
          <button className="btn-primary" onClick={() => window.open(stream.url, '_blank')}><i className="fa-solid fa-play"></i> Ver</button>
        </div>
      ))}
    </div>
  );

  // Renderizar notificaciones
  const renderNotifications = () => (
    <div id="notificationsPanel">
      {notifications.map((n, idx) => (
        <div className="notif-card" key={idx} style={{ background: '#222', borderRadius: 12, padding: '12px 18px', boxShadow: '0 2px 8px #FFD70022', display: 'flex', alignItems: 'center', gap: 12 }}>
          <i className="fa-solid fa-bell" style={{ color: '#FFD700', fontSize: '1.3em' }}></i>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{n.title}</div>
            <div style={{ fontSize: '0.95em', color: '#fff' }}>{n.message}</div>
          </div>
          <span style={{ fontSize: '0.85em', color: '#FFD700' }}>{n.date}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#181818' }}>
      <GlobalNav />
      <div style={{ flex: 1, padding: '0 0 0 0', background: '#181818' }}>
        {renderMainFeed()}
        {renderLiveStreams()}
        {renderNotifications()}
        {/* Agrega aquí los demás paneles y componentes */}
      </div>
    </div>
  );
};

export default FutProApp;
