import React, { useEffect, useState } from 'react';
import MediaUploadComponent from '../../components/organizer/MediaUploadComponent';
import mediaService from '../../services/mediaService';
import { useRole } from '../../context/RoleContext';
import LikeButton from '../../components/LikeButton';

const icons = {
  fire: '🔥',
  ball: '⚽',
  deflated: '🏐'
};

const MediaPage = () => {
  const [gallery, setGallery] = useState([]);
  const { hasPermission } = useRole();
  const token = localStorage.getItem('token');

  useEffect(() => {
    mediaService.getGallery(token).then(data => setGallery(data.gallery || []));
  }, [token]);

  return (
    <div>
      <h1>Galería de Fotos y Videos</h1>
      {hasPermission('media:upload') && <MediaUploadComponent />}
      <h2>Galería</h2>
      <div style={{display:'flex',flexWrap:'wrap',gap:'1rem'}}>
        {gallery.map((item, idx) => (
          <div key={idx} style={{width:'200px'}}>
            {item.type.startsWith('image') ? (
              <img src={item.url} alt="foto" style={{width:'100%'}} />
            ) : (
              <video src={item.url} controls style={{width:'100%'}} />
            )}
            <LikeButton mediaId={item.id} />
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'1.2rem',marginTop:'0.5rem'}}>
              <span>{icons.fire} {item.likes?.fire || 0}</span>
              <span>{icons.ball} {item.likes?.ball || 0}</span>
              <span>{icons.deflated} {item.likes?.deflated || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPage;
