import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import PriorityPage from './pages/PriorityPage';
import AllNotificationsPage from './pages/AllNotificationsPage';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [n, setN] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMockData = useCallback(() => {
    const apiExamples = [
      { ID: "d146095a-0d86-4a34-9669-3900a14576bc", Type: "Result", Message: "mid-sem", Timestamp: "2026-04-22 17:51:30" },
      { ID: "b283218f-ea5a-4b7c-93a9-1f2f240d64b0", Type: "Placement", Message: "CSX Corporation hiring", Timestamp: "2026-04-22 17:51:18" },
      { ID: "81589ada-0ad3-4f77-9554-f52fb558e09d", Type: "Event", Message: "farewell", Timestamp: "2026-04-22 17:51:06" },
      { ID: "0005513a-142b-4bbc-8678-eefec65e1ede", Type: "Result", Message: "mid-sem", Timestamp: "2026-04-22 17:50:54" },
      { ID: "ea836726-c25e-4f21-a72f-544a6af8a37f", Type: "Result", Message: "project-review", Timestamp: "2026-04-22 17:50:42" },
      { ID: "003cb427-8fc6-47f7-bb00-be228f6b0d2c", Type: "Result", Message: "external", Timestamp: "2026-04-22 17:50:30" },
      { ID: "e5c4ff20-31bf-4d40-8f02-72fda59e8918", Type: "Result", Message: "project-review", Timestamp: "2026-04-22 17:50:18" },
      { ID: "1cfce5ee-ad37-4894-8946-d707627176a5", Type: "Event", Message: "tech-fest", Timestamp: "2026-04-22 17:50:06" },
      { ID: "cf2885a6-45ac-4ba0-b548-6e9e9d4c52c8", Type: "Result", Message: "project-review", Timestamp: "2026-04-22 17:49:54" },
      { ID: "8a7412bd-6065-4d09-8501-a37f11cc848b", Type: "Placement", Message: "Advanced Micro Devices Inc. hiring", Timestamp: "2026-04-22 17:49:42" }
    ];

    const mappedData = apiExamples.map(item => ({
      id: item.ID,
      type: item.Type.toLowerCase(),
      title: item.Type,
      content: item.Message,
      timestamp: new Date(item.Timestamp).getTime(),
      isRead: false
    }));

    setNotifications(mappedData);
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://4.224.186.213/evaluation-service/notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      
      // Handle the nested 'notifications' array and uppercase keys
      const rawList = data.notifications || [];
      const mappedData = rawList.map(item => ({
        id: item.ID || Math.random().toString(),
        type: (item.Type || 'event').toLowerCase(),
        title: item.Type || 'Notification',
        content: item.Message || 'No content provided.',
        timestamp: new Date(item.Timestamp).getTime() || Date.now(),
        isRead: false
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
    <Router>
      <div className="App">
        <Navbar />
        
        <div className="controls-bar" style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '1rem', 
          marginBottom: '2.5rem',
          padding: '0 1rem'
        }}>
          <div className="selector-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '500' }}>Show</span>
            <select 
              className="n-selector" 
              value={n} 
              onChange={(e) => setN(parseInt(e.target.value))}
              style={{ border: '1px solid var(--line)', background: 'rgba(255, 255, 255, 0.05)' }}
            >
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
              <option value={15}>Top 15</option>
              <option value={20}>Top 20</option>
            </select>
          </div>
          <button className="btn btn-ghost" onClick={fetchNotifications} disabled={loading} style={{ borderRadius: '12px' }}>
            {loading ? '...' : 'Refresh API'}
          </button>
          <button className="btn" onClick={addRandomNotification} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(201, 111, 58, 0.2)' }}>
            + Mock Alert
          </button>
        </div>

        {error && <div className="error-banner" style={{ textAlign: 'center', color: '#a7542a', marginBottom: '1.5rem', fontWeight: '500' }}>{error}</div>}

        <Routes>
          <Route path="/" element={
            <PriorityPage 
              notifications={notifications} 
              n={n} 
              onMarkRead={markAsRead} 
            />
          } />
          <Route path="/all" element={
            <AllNotificationsPage 
              notifications={notifications} 
              onMarkRead={markAsRead} 
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
