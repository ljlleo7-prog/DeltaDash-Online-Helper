import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { AuthContext } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

function Header() {
  const { language } = useContext(LanguageContext);
  const { user, signOut } = useContext(AuthContext);

  const handleLogin = () => {
    // Redirect to main site login or open a login modal
    // For now, we can redirect to the main site's login page
    window.location.href = 'https://geeksproductionstudio.com/login';
  };

  return (
    <header className="header">
      <div className="title-wrapper">
        <h1 className="main-title">
          <img src="assets/logo.png" alt="Delta Dash logo" className="site-logo" />
          <span className="site-title-text">
            <span className="online">{language === 'zh' ? '在线' : 'Online'}</span>
            <span className="assistant">{language === 'zh' ? '助手' : 'Assistant'}</span>
          </span>
        </h1>
        <p className="subtitle">
          {language === 'zh' 
            ? 'F1赛车策略桌游助手' 
            : 'F1 motorsports strategy boardgame assistant'
          }
        </p>
      </div>
      <div className="header-controls" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {user ? (
          <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: '#e6e6e6' }}>
              {user.email?.split('@')[0]}
            </span>
            <button 
              onClick={signOut}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              {language === 'zh' ? '登出' : 'Sign Out'}
            </button>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            style={{
              background: '#e10600',
              border: 'none',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            {language === 'zh' ? '登录' : 'Sign In'}
          </button>
        )}
        <LanguageSwitcher />
      </div>
    </header>
  );
}

export default Header;