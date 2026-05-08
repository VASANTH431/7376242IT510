import React from 'react';

const NotificationItem = ({ notification, onMarkRead }) => {
  const { type, title, content, timestamp, isRead } = notification;

  const formatTime = (ts) => {
    const now = Date.now();
    const diff = now - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className={`notification-card ${type} ${isRead ? 'read' : 'unread'}`}>
      <div className="card-top">
        <span className="notification-type">{type}</span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!isRead && <span className="unread-badge">NEW</span>}
          <span className="notification-time">{formatTime(timestamp)}</span>
        </div>
      </div>
      <h3 className="notification-title">{title}</h3>
      <p className="notification-content">{content}</p>
      {!isRead && (
        <button 
          className="btn btn-ghost" 
          style={{ marginTop: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px' }}
          onClick={() => onMarkRead(notification.id)}
        >
          Mark as Read
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
