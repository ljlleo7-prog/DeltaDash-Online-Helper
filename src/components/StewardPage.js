import React, { useState, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import faqDataJson from '../data/faq_data.json';
import { escapeHtml } from '../utils/helpers';

const resolveStewardAccessCodes = () => {
  const list = process.env.REACT_APP_STEWARD_CODES;
  if (list && typeof list === 'string') {
    const parsed = list
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    if (parsed.length > 0) {
      return parsed;
    }
  }
  const single = process.env.REACT_APP_STEWARD_CODE;
  if (single && typeof single === 'string' && single.trim()) {
    return [single.trim()];
  }
  return ['DELTA-STWD-2026'];
};

const STEWARD_ACCESS_CODES = resolveStewardAccessCodes();

function StewardPage() {
  const { language } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState('flow');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [accessCode, setAccessCode] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [accessError, setAccessError] = useState('');

  const getText = (textObj) => {
    return textObj ? (textObj[language] || textObj.en || '') : '';
  };

  const toggleQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const handleAccessSubmit = (event) => {
    event.preventDefault();
    const normalizedInput = (accessCode || '').trim();

    if (!normalizedInput) {
      setAccessError(language === 'zh' ? '请输入访问口令。' : 'Please enter the access code.');
      setAuthorized(false);
      return;
    }

    if (STEWARD_ACCESS_CODES.includes(normalizedInput)) {
      setAuthorized(true);
      setAccessError('');
      return;
    }

    setAccessError(language === 'zh' ? '访问口令不正确。' : 'Invalid access code.');
    setAuthorized(false);
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

      <div className="steward-access">
        {authorized ? (
          <div className="steward-access-message">
            {language === 'zh' ? '已解锁赛会干事工具。' : 'Steward tools unlocked.'}
          </div>
        ) : (
          <form className="steward-access-form" onSubmit={handleAccessSubmit}>
            <p className="steward-access-description">
              {language === 'zh'
                ? '请输入赛会干事专用口令以访问详细工具和资料。'
                : 'Enter the steward-only access code to view detailed tools and data.'}
            </p>
            <input
              type="password"
              className="steward-access-input"
              value={accessCode}
              onChange={(event) => {
                setAccessCode(event.target.value);
                if (accessError) {
                  setAccessError('');
                }
              }}
              placeholder={language === 'zh' ? '输入访问口令' : 'Enter access code'}
            />
            <button type="submit" className="steward-access-btn">
              {language === 'zh' ? '解锁干事页面' : 'Unlock Steward Page'}
            </button>
            {accessError && (
              <div className="steward-access-error">
                {accessError}
              </div>
            )}
          </form>
        )}
      </div>

      {authorized && (
        <>
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
        </>
      )}

      <style jsx>{`
        .steward-access {
          margin-bottom: 20px;
          padding: 16px 20px;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .steward-access-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .steward-access-description {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }
        .steward-access-input {
          padding: 10px 12px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.6);
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
        }
        .steward-access-input:focus {
          outline: none;
          border-color: var(--accent-color, #e10600);
          box-shadow: 0 0 8px rgba(225, 6, 0, 0.5);
        }
        .steward-access-btn {
          align-self: flex-start;
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid var(--accent-color, #e10600);
          background: linear-gradient(135deg, #e53935, #ffb300);
          color: #111;
          font-weight: 600;
          cursor: pointer;
          font-size: 13px;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: all 0.2s ease;
        }
        .steward-access-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 16px rgba(225, 6, 0, 0.6);
        }
        .steward-access-error {
          margin-top: 4px;
          font-size: 13px;
          color: #ff6b6b;
        }
        .steward-access-message {
          font-size: 14px;
          color: #ffb300;
        }
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
