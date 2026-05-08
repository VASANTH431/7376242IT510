import React from 'react';
import NotificationItem from './NotificationItem';

const PriorityInbox = ({ notifications, n, onMarkRead }) => {
  // Priority weights
  const weights = {
    placement: 3,
    result: 2,
    event: 1
  };

  // Logic to find top N notifications efficiently
  // 1. Filter for unread
  // 2. Sort by weight desc, then timestamp desc
  // 3. Slice top n
  const priorityNotifications = notifications
    .filter(notif => !notif.isRead)
    .sort((a, b) => {
      const weightA = weights[a.type] || 0;
      const weightB = weights[b.type] || 0;
      
      if (weightA !== weightB) {
        return weightB - weightA; // Higher weight first
      }
      return b.timestamp - a.timestamp; // More recent first
    })
    .slice(0, n);

  return (
    <div className="priority-inbox">
      <div className="section-header">
        <h2 className="section-title">
          Priority Inbox 
          <span className="badge">Top {n}</span>
        </h2>
      </div>
      
      <div className="notification-list">
        {priorityNotifications.length > 0 ? (
          priorityNotifications.map(notif => (
            <NotificationItem 
              key={notif.id} 
              notification={notif} 
              onMarkRead={onMarkRead} 
            />
          ))
        ) : (
          <div className="empty-state">
            <p>No high-priority notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriorityInbox;
