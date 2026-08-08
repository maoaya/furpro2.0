// Skeleton de carga para el feed
import React from 'react';
import './SkeletonFeed.css'; // Asegúrate de crear este archivo CSS

export default function SkeletonFeed() {
  return (
    <div className="skeleton-feed">
      <div className="skeleton-card">
        <div className="skeleton-image"></div>
        <div className="skeleton-text short"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text long"></div>
      </div>
    </div>
  );
}
