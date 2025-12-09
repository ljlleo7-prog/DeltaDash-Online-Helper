import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

function Header() {
  const { language } = useContext(LanguageContext);

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
      <LanguageSwitcher />
    </header>
  );
}

export default Header;