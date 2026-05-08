import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NotificationItem from '../components/NotificationItem';

const AllNotificationsPage = ({ notifications, onMarkRead }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get query params or defaults
  const typeFilter = searchParams.get('notification_type') || 'all';
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 5;

  const [filteredNotifications, setFilteredNotifications] = useState([]);

  useEffect(() => {
    let result = [...notifications];

    // Filter by type
    if (typeFilter !== 'all') {
      result = result.filter(n => n.type.toLowerCase() === typeFilter.toLowerCase());
    }

    setFilteredNotifications(result);
  }, [notifications, typeFilter]);

  // Pagination logic
  const totalItems = filteredNotifications.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (currentPage - 1) * limit;
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + limit);

  const handleFilterChange = (type) => {
    setSearchParams({ notification_type: type, page: 1, limit });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ notification_type: typeFilter, page: newPage, limit });
    }
  };

  return (
    <div className="page-container">
      <div className="section-header">
        <h2 className="section-title">All Notifications</h2>
      </div>

      <div className="filter-bar">
        {['all', 'placement', 'result', 'event'].map(type => (
          <button
            key={type}
            className={`filter-btn ${typeFilter === type ? 'active' : ''}`}
            onClick={() => handleFilterChange(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="notification-list">
        {paginatedNotifications.length > 0 ? (
          paginatedNotifications.map(notif => (
            <NotificationItem 
              key={notif.id} 
              notification={notif} 
              onMarkRead={onMarkRead} 
            />
          ))
        ) : (
          <div className="empty-state">
            <p>No notifications found matching your filters.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="btn btn-ghost" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="btn btn-ghost" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllNotificationsPage;
