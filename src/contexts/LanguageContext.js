import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  // 从localStorage加载保存的语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('deltaDashLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // 切换语言并保存到localStorage
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'zh' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('deltaDashLanguage', newLanguage);
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageContext };