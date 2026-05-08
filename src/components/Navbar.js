import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <h1 style={{ fontSize: '1.8rem' }}>Campus Pulse</h1>
      </div>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
          Priority Inbox
        </NavLink>
        <NavLink to="/all" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          All Notifications
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
