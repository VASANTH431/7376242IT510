import React, { useState, useEffect } from 'react';
import './App.css';
import PriorityInbox from './components/PriorityInbox';
import NotificationItem from './components/NotificationItem';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [n, setN] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMockData = React.useCallback(() => {
    const initialData = [
      { id: '1', type: 'event', title: 'Campus Workshop', content: 'Join us for a React workshop tomorrow.', timestamp: Date.now() - 100000, isRead: false },
      { id: '2', type: 'result', title: 'Midterm Results', content: 'Your CS101 results are out.', timestamp: Date.now() - 50000, isRead: false },
      { id: '3', type: 'placement', title: 'Google Interview', content: 'Congrats! You are shortlisted for the interview.', timestamp: Date.now() - 200000, isRead: false },
      { id: '4', type: 'event', title: 'Football Match', content: 'Finals this weekend at the stadium.', timestamp: Date.now() - 300000, isRead: false },
      { id: '5', type: 'placement', title: 'Adobe Career Fair', content: 'Check out the new openings at Adobe.', timestamp: Date.now() - 10000, isRead: false },
    ];
    setNotifications(initialData);
  }, []);

  const fetchNotifications = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://4.224.186.213/evaluation-service/notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      
      const mappedData = data.map(item => ({
        id: item.id || Math.random().toString(),
        type: (item.type || 'event').toLowerCase(),
        title: item.title || 'Notification',
        content: item.content || item.message || 'No content provided.',
        timestamp: item.timestamp || item.createdAt || Date.now(),
        isRead: item.isRead || false
      }));

      setNotifications(mappedData);
    } catch (err) {
      console.error(err);
      setError('Live API unavailable. Using simulated data.');
      loadMockData();
    } finally {
      setLoading(false);
    }
  }, [loadMockData]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const addRandomNotification = () => {
    const types = ['placement', 'result', 'event'];
    const titles = {
      placement: ['Microsoft Offer', 'Amazon Referral', 'Startup Hiring'],
      result: ['Math Quiz Score', 'Lab Report Grade', 'Semester GPA'],
      event: ['Hackathon 2024', 'Music Fest', 'Club Meeting']
    };
    
    const type = types[Math.floor(Math.random() * types.length)];
    const title = titles[type][Math.floor(Math.random() * titles[type].length)];
    
    const newNotif = {
      id: Date.now().toString(),
      type,
      title,
      content: `This is a new ${type} notification generated at ${new Date().toLocaleTimeString()}.`,
      timestamp: Date.now(),
      isRead: false
    };

    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div className="App">
      <header>
        <h1>Campus Pulse</h1>
        <div className="controls">
          <select 
            className="n-selector" 
            value={n} 
            onChange={(e) => setN(parseInt(e.target.value))}
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={15}>Top 15</option>
            <option value={20}>Top 20</option>
          </select>
          <button className="btn btn-ghost" onClick={fetchNotifications} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="btn" onClick={addRandomNotification}>
            + New Alert
          </button>
        </div>
      </header>

      {error && <div className="error-banner" style={{ textAlign: 'center', color: '#fb7185', marginBottom: '1rem' }}>{error}</div>}

      <main className="dashboard">
        {/* Left Column: All Notifications */}
        <div className="all-notifications">
          <div className="section-header">
            <h2 className="section-title">Recent Updates</h2>
          </div>
          <div className="notification-list">
            {notifications.map(notif => (
              <NotificationItem 
                key={notif.id} 
                notification={notif} 
                onMarkRead={markAsRead} 
              />
            ))}
          </div>
        </div>

        {/* Right Column: Priority Inbox */}
        <div className="priority-section">
          <PriorityInbox 
            notifications={notifications} 
            n={n} 
            onMarkRead={markAsRead} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;
