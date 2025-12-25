import React from 'react';

function Navigation({ activePage, setActivePage }) {
  const navItems = [
    { id: 'homepage', label: 'Homepage', icon: '🏠' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
    { id: 'version', label: 'Version', icon: '📌' },
    { id: 'strategy', label: 'Strategy', icon: '⚡' },
    { id: 'feedback', label: 'Feedback', icon: '💭' },
    { id: 'driverroll', label: 'Driver Roll', icon: '🏎️' }
  ];

  return (
    <nav className="navigation">
      {navItems.map(item => (
        <button
          key={item.id}
          className={`nav-btn ${activePage === item.id ? 'active' : ''}`}
          onClick={() => setActivePage(item.id)}
        >
          <span className="icon">{item.icon}</span> {item.label}
        </button>
      ))}
    </nav>
  );
}

export default Navigation;