import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

function Navigation({ activePage, setActivePage }) {
  const { language } = useContext(LanguageContext);

  const navItems = [
    { id: 'homepage', label: language === 'zh' ? '主页' : 'Homepage', icon: '🏠' },
    { id: 'about', label: language === 'zh' ? '关于' : 'About', icon: 'ℹ️' },
    { id: 'version', label: language === 'zh' ? '版本' : 'Version', icon: '📌' },
    { id: 'strategy', label: language === 'zh' ? '策略' : 'Strategy', icon: '⚡' },
    { id: 'driverroll', label: language === 'zh' ? '车手抽取' : 'Driver Roll', icon: '🏎️' },
    { id: 'steward', label: language === 'zh' ? '赛会干事' : 'Steward', icon: '👨‍⚖️' },
    { id: 'feedback', label: language === 'zh' ? '反馈' : 'Feedback', icon: '💭' }
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