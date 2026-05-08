import React from 'react';
import PriorityInbox from '../components/PriorityInbox';

const PriorityPage = ({ notifications, n, onMarkRead }) => {
  return (
    <div className="page-container">
      <main className="dashboard" style={{ gridTemplateColumns: '1fr' }}>
        <PriorityInbox 
          notifications={notifications} 
          n={n} 
          onMarkRead={onMarkRead} 
        />
      </main>
    </div>
  );
};

export default PriorityPage;
