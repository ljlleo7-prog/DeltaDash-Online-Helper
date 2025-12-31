import React, { useContext, useState, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

function FAQPage() {
  const { language } = useContext(LanguageContext);
  const [faqData, setFaqData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    const loadFaqData = async () => {
      try {
        console.log('Loading FAQ data...');
        // Try different paths for the JSON file
        const paths = [
          '/faq_data.json',
          './faq_data.json',
          'faq_data.json',
          '/public/faq_data.json',
          './public/faq_data.json'
        ];
        
        let data = null;
        for (const path of paths) {
          try {
            console.log(`Trying path: ${path}`);
            const response = await fetch(path);
            
            if (response.ok) {
              data = await response.json();
              console.log(`Success with path: ${path}`);
              break;
            } else {
              console.log(`HTTP error with path ${path}: ${response.status} ${response.statusText}`);
            }
          } catch (error) {
            console.log(`Failed with path ${path}:`, error.message);
          }
        }
        
        if (data) {
          console.log('FAQ data loaded successfully:', data);
          setFaqData(data);
        } else {
          throw new Error('All paths failed to load FAQ data');
        }
      } catch (error) {
        console.error('Error loading FAQ data:', error);
        console.error('Error details:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadFaqData();
  }, []);

  const getText = (textObj) => {
    return textObj ? (textObj[language] || textObj.en || '') : '';
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const filteredQuestions = () => {
    if (!faqData || !faqData.faq || !faqData.faq.questions) return [];
    
    if (activeCategory === 'all') {
      return faqData.faq.questions;
    }
    
    return faqData.faq.questions.filter(question => question.category === activeCategory);
  };

  if (loading) {
    return (
      <section id="faq-page" className="page-content">
        <div className="faq-container">
          <h2 className="faq-title">
            {language === 'zh' ? '加载中...' : 'Loading...'}
          </h2>
        </div>
      </section>
    );
  }

  if (!faqData) {
    return (
      <section id="faq-page" className="page-content">
        <div className="faq-container">
          <h2 className="faq-title">
            {language === 'zh' ? '数据加载失败' : 'Failed to load data'}
          </h2>
          <p>{language === 'zh' ? '请检查浏览器控制台查看详细错误信息' : 'Please check browser console for detailed error information'}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="faq-page" className="page-content">
      <div className="faq-container">
        <h1 className="faq-title">
          {getText(faqData.faq.title)}
        </h1>
        <p className="faq-description">
          {getText(faqData.faq.description)}
        </p>

        {/* Category Filter */}
        <div className="faq-categories">
          <button 
            className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            {language === 'zh' ? '全部' : 'All'}
          </button>
          {faqData.faq.categories && Object.entries(faqData.faq.categories).map(([categoryKey, categoryName]) => (
            <button
              key={categoryKey}
              className={`category-btn ${activeCategory === categoryKey ? 'active' : ''}`}
              onClick={() => setActiveCategory(categoryKey)}
            >
              {getText(categoryName)}
            </button>
          ))}
        </div>

        {/* FAQ Questions */}
        <div className="faq-questions">
          {filteredQuestions().map((question) => (
            <div 
              key={question.id} 
              className={`faq-card ${expandedQuestion === question.id ? 'expanded' : ''}`}
            >
              <div 
                className="faq-question-header"
                onClick={() => toggleQuestion(question.id)}
              >
                <div className="faq-question-content">
                  <span className="faq-number">Q{question.id}</span>
                  <h3 className="faq-question-text">
                    {getText(question.question)}
                  </h3>
                </div>
                <div className="faq-toggle">
                  <span className="toggle-icon">
                    {expandedQuestion === question.id ? '−' : '+'}
                  </span>
                </div>
              </div>
              
              <div className="faq-answer">
                <p className="faq-answer-text">
                  {getText(question.answer)}
                </p>
                <div className="faq-category-tag">
                  {faqData.faq.categories && getText(faqData.faq.categories[question.category])}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredQuestions().length === 0 && (
          <div className="no-results">
            <p>{language === 'zh' ? '该分类下暂无问题' : 'No questions found in this category'}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default FAQPage;