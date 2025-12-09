import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

function AboutPage() {
  const { language } = useContext(LanguageContext);

  return (
    <section id="about-page" className="page-content">
      <h2>{language === 'zh' ? '关于 Delta Dash 在线助手' : 'About Delta Dash Online Assistant'}</h2>
      <p>
        {language === 'zh' 
          ? '这是关于页面的内容。您可以在此处添加有关应用程序的详细信息。' 
          : 'This is the about page content. You can add detailed information about your application here.'
        }
      </p>
    </section>
  );
}

export default AboutPage;