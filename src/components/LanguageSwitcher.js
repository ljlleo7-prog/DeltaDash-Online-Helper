import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import './LanguageSwitcher.css';

function LanguageSwitcher() {
  const { language, toggleLanguage } = useContext(LanguageContext);

  return (
    <div className="language-switcher">
      <button 
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => language !== 'en' && toggleLanguage()}
      >
        EN
      </button>
      <span className="lang-separator">|</span>
      <button 
        className={`lang-btn ${language === 'zh' ? 'active' : ''}`}
        onClick={() => language !== 'zh' && toggleLanguage()}
      >
        中文
      </button>
    </div>
  );
}

export default LanguageSwitcher;