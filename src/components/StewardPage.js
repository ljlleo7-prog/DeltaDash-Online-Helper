import React, { useState, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import faqDataJson from '../data/faq_data.json';
import { escapeHtml } from '../utils/helpers';

function StewardPage() {
  const { language } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState('flow'); // flow, faq, calc
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  // Helper function to get text based on language
  const getText = (textObj) => {
    return textObj ? (textObj[language] || textObj.en || '') : '';
  };

  const toggleQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const renderGameFlow = () => {
    return (
      <div className="steward-section">
        <h3>{language === 'zh' ? '交互式游戏流程图' : 'Interactive Game Flow Graph'}</h3>
        <div className="game-flow-container" style={{ padding: '20px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
          <p>{language === 'zh' ? '即将推出...' : 'Coming Soon...'}</p>
          {/* Placeholder for interactive graph */}
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #666' }}>
            [Game Flow Graph Placeholder]
          </div>
        </div>
      </div>
    );
  };

  const renderFAQ = () => {
    const faqData = faqDataJson.faq;
    return (
      <div className="steward-section">
        <h3>{getText(faqData.title)}</h3>
        <p>{getText(faqData.description)}</p>
        
        <div className="faq-list">
          {faqData.questions.map((q) => (
            <div key={q.id} className={`faq-item ${expandedQuestion === q.id ? 'active' : ''}`}>
              <div 
                className="faq-question" 
                onClick={() => toggleQuestion(q.id)}
              >
                {getText(q.question)}
                <span className="faq-toggle">{expandedQuestion === q.id ? '-' : '+'}</span>
              </div>
              {expandedQuestion === q.id && (
                <div className="faq-answer">
                  <p>{getText(q.answer)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCalculation = () => {
    return (
      <div className="steward-section">
        <h3>{language === 'zh' ? '快速数据计算' : 'Fast Data Calculation'}</h3>
        <div className="calc-container" style={{ padding: '20px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
          <p>{language === 'zh' ? '即将推出...' : 'Coming Soon...'}</p>
          {/* Placeholder for calculation tool */}
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #666' }}>
            [Calculator Placeholder]
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="steward-page" className="page-content">
      <h2>{language === 'zh' ? '赛会干事' : 'Steward'}</h2>
      
      <div className="steward-tabs">
        <button 
          className={`steward-tab-btn ${activeTab === 'flow' ? 'active' : ''}`}
          onClick={() => setActiveTab('flow')}
        >
          {language === 'zh' ? '游戏流程' : 'Game Flow'}
        </button>
        <button 
          className={`steward-tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          {language === 'zh' ? '常见问题' : 'FAQ'}
        </button>
        <button 
          className={`steward-tab-btn ${activeTab === 'calc' ? 'active' : ''}`}
          onClick={() => setActiveTab('calc')}
        >
          {language === 'zh' ? '数据计算' : 'Calculation'}
        </button>
      </div>

      <div className="steward-content">
        {activeTab === 'flow' && renderGameFlow()}
        {activeTab === 'faq' && renderFAQ()}
        {activeTab === 'calc' && renderCalculation()}
      </div>

      <style jsx>{`
        .steward-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 10px;
        }
        .steward-tab-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.7);
          padding: 8px 16px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        .steward-tab-btn:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }
        .steward-tab-btn.active {
          background: var(--accent-color, #e10600);
          border-color: var(--accent-color, #e10600);
          color: white;
        }
        .faq-item {
          margin-bottom: 10px;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          overflow: hidden;
        }
        .faq-question {
          padding: 15px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: bold;
        }
        .faq-question:hover {
          background: rgba(255,255,255,0.1);
        }
        .faq-answer {
          padding: 15px;
          border-top: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.2);
        }
        .faq-toggle {
          font-size: 1.2em;
          font-weight: bold;
        }
      `}</style>
    </section>
  );
}

export default StewardPage;
