import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { AuthContext } from '../contexts/AuthContext';
import driverDataJson from '../data/driver_data.json';

function DriverRollPage() {
  const [driverData, setDriverData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [rolledDriver, setRolledDriver] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isRollingTemplate, setIsRollingTemplate] = useState(false);
  const [brokenImages, setBrokenImages] = useState({});
  const { language } = useContext(LanguageContext);
  const { user, loading } = useContext(AuthContext);
  
  // Helper function to get text based on language
  const getText = (textObj) => {
    if (!textObj) return '';
    if (typeof textObj === 'string') return textObj;
    return textObj[language] || textObj.en || '';
  };

  useEffect(() => {
    setDriverData(driverDataJson);
  }, []);

  if (loading) {
    return (
      <section id="driver-roll-page" className="page-content">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          {language === 'zh' ? '加载中...' : 'Loading...'}
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section id="driver-roll-page" className="page-content">
        <h2 className="page-title">{language === 'zh' ? '驾驶员抽取' : 'Driver Roll'}</h2>
        <div className="login-required" style={{ textAlign: 'center', padding: '50px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px' }}>
          <h3>{language === 'zh' ? '需要登录' : 'Authentication Required'}</h3>
          <p>{language === 'zh' ? '请登录以使用此功能。' : 'Please sign in to access this feature.'}</p>
          <button 
            onClick={() => window.location.href = 'https://geeksproductionstudio.com/login'}
            className="action-btn primary"
            style={{ marginTop: '20px' }}
          >
            {language === 'zh' ? '前往登录' : 'Go to Login'}
          </button>
        </div>
      </section>
    );
  }

  const handleImageError = (templateId) => {
    setBrokenImages((prev) => ({ ...prev, [templateId]: true }));
  };

  const selectTemplate = (template) => {
    setSelectedTemplate(template);
    setRolledDriver(null);
  };

  const rollTemplate = () => {
    if (!driverData || driverData.driverTemplates.length === 0) return;
    
    setIsRollingTemplate(true);
    
    // Simulate template rolling animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * driverData.driverTemplates.length);
      const randomTemplate = driverData.driverTemplates[randomIndex];
      setSelectedTemplate(randomTemplate);
      setIsRollingTemplate(false);
    }, 1000);
  };

  const rollDriver = () => {
    if (!selectedTemplate || !driverData) return;
    
    setIsRolling(true);
    
    // Simulate rolling animation
    setTimeout(() => {
      const rolledDriver = {
        template: selectedTemplate,
        buffs: [],
        neutrals: [],
        debuffs: []
      };

      // Helper function to get unique traits from a pool
      const getUniqueTraits = (pool, count) => {
        const availableTraits = [...pool]; // Create a copy to avoid modifying original
        const selectedTraits = [];
        
        for (let i = 0; i < count && availableTraits.length > 0; i++) {
          const randomIndex = Math.floor(Math.random() * availableTraits.length);
          const selectedTrait = availableTraits.splice(randomIndex, 1)[0];
          selectedTraits.push(selectedTrait);
        }
        
        return selectedTraits;
      };

      // Roll buffs (no duplicates)
      rolledDriver.buffs = getUniqueTraits(driverData.buffPool, selectedTemplate.buffSlots);

      // Roll neutrals (no duplicates)
      rolledDriver.neutrals = getUniqueTraits(driverData.neutralPool, selectedTemplate.neutralSlots);

      // Roll debuffs (no duplicates)
      rolledDriver.debuffs = getUniqueTraits(driverData.debuffPool, selectedTemplate.debuffSlots);

      setRolledDriver(rolledDriver);
      setIsRolling(false);
    }, 1500);
  };

  const resetRoll = () => {
    setSelectedTemplate(null);
    setRolledDriver(null);
  };

  if (!driverData) {
    return (
      <section id="driver-roll-page" className="page-content">
        <h2 className="page-title">{language === 'zh' ? '驾驶员抽取' : 'Driver Roll'}</h2>
        <p className="loading-text">{language === 'zh' ? '加载数据中...' : 'Loading data...'}</p>
      </section>
    );
  }

  return (
    <section id="driver-roll-page" className="page-content">
      <h2 className="page-title">{language === 'zh' ? '驾驶员抽取' : 'Driver Roll'}</h2>
      
      {!selectedTemplate ? (
        <div className="template-selection">
          <h3 className="section-title">{language === 'zh' ? '选择驾驶员模板' : 'Select Driver Template'}</h3>
          
          {/* Template Roll Interface */}
          <div className="template-roll-section">
            <div className="roll-description">
              <p>{language === 'zh' ? '随机抽取一个驾驶员模板开始游戏！' : 'Roll a random driver template to start the game!'}</p>
            </div>
            <button 
              className="roll-template-button racing-btn" 
              onClick={rollTemplate}
              disabled={isRollingTemplate}
            >
              {isRollingTemplate ? (
                <span className="rolling-animation">
                  <span className="flag">🏁</span>
                  {language === 'zh' ? '抽取模板中...' : 'Rolling Template...'}
                  <span className="flag">🏁</span>
                </span>
              ) : (
                <span>
                  <span className="flag">🏁</span>
                  {language === 'zh' ? '随机抽取模板' : 'Roll Template'}
                  <span className="flag">🏁</span>
                </span>
              )}
            </button>
            <div className="or-separator">
              <span>{language === 'zh' ? '或' : 'OR'}</span>
            </div>
          </div>
          
          {/* Manual Template Selection */}
          <h4 className="manual-selection-title">{language === 'zh' ? '手动选择模板' : 'Manual Selection'}</h4>
          <div className="template-grid">
            {driverData.driverTemplates.map((template) => (
              <div 
                key={template.id} 
                className="template-card"
                onClick={() => selectTemplate(template)}
              >
                <div className="template-image">
                  {brokenImages[template.id] ? (
                    <div className="placeholder-image">🏎️</div>
                  ) : (
                    <img 
                      src={template.imgSource} 
                      alt={getText(template.name)} 
                      className="driver-thumbnail"
                      onError={() => handleImageError(template.id)}
                    />
                  )}
                </div>
                <div className="template-info">
                  <h4 className="driver-name">{getText(template.name)}</h4>
                  <div className="template-stats">
                    <span className="stat buff">+{template.buffSlots}</span>
                    <span className="stat neutral">• {template.neutralSlots}</span>
                    <span className="stat debuff">-{template.debuffSlots}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="roll-interface">
          <div className="selected-template">
            <h3 className="driver-title">{getText(selectedTemplate.name)}</h3>
            <div className="template-details">
              <div className="basic-data">
                <h4 className="data-title">{language === 'zh' ? '基本信息' : 'Basic Data'}</h4>
                <p className="driver-description">{getText(selectedTemplate.description)}</p>
              </div>
              <div className="slot-info">
                <h4 className="data-title">{language === 'zh' ? '属性槽位' : 'Attribute Slots'}</h4>
                <div className="slots">
                  <span className="slot buff">+{selectedTemplate.buffSlots} {language === 'zh' ? '增益' : 'Buff'}</span>
                  <span className="slot neutral">• {selectedTemplate.neutralSlots} {language === 'zh' ? '中性' : 'Neutral'}</span>
                  <span className="slot debuff">-{selectedTemplate.debuffSlots} {language === 'zh' ? '减益' : 'Debuff'}</span>
                </div>
              </div>
            </div>
          </div>

          {!rolledDriver ? (
            <div className="roll-section">
              <button 
                className="roll-button racing-btn" 
                onClick={rollDriver}
                disabled={isRolling}
              >
                {isRolling ? (
                  <span className="rolling-animation">
                    <span className="flag">🏁</span>
                    {language === 'zh' ? '抽取中...' : 'Rolling...'}
                    <span className="flag">🏁</span>
                  </span>
                ) : (
                  <span>
                    <span className="flag">🏁</span>
                    {language === 'zh' ? '抽取驾驶员' : 'Roll Driver'}
                    <span className="flag">🏁</span>
                  </span>
                )}
              </button>
              <button 
                className="back-btn racing-btn secondary" 
                onClick={resetRoll}
                disabled={isRolling}
              >
                <span className="flag">🏁</span>
                {language === 'zh' ? '返回选择' : 'Back to Selection'}
                <span className="flag">🏁</span>
              </button>
            </div>
          ) : (
            <div className="result-section">
              <h3 className="result-title">{language === 'zh' ? '抽取结果' : 'Roll Result'}</h3>
              <div className="driver-result">
                <div className="driver-header">
                  <div className="driver-image">
                    {brokenImages[selectedTemplate.id] ? (
                      <div className="placeholder-image">🏎️</div>
                    ) : (
                      <img 
                        src={selectedTemplate.imgSource} 
                        alt={getText(selectedTemplate.name)} 
                        className="driver-photo"
                        onError={() => handleImageError(selectedTemplate.id)}
                      />
                    )}
                  </div>
                  <div className="driver-name">
                    <h4>{getText(selectedTemplate.name)}</h4>
                    <span className="driver-type">{getText(selectedTemplate.description)}</span>
                  </div>
                </div>

                <div className="attributes-grid">
                  {rolledDriver.buffs.length > 0 && (
                    <div className="attribute-section buffs">
                      <h5 className="attribute-title">🎯 {language === 'zh' ? '增益属性' : 'Buffs'}</h5>
                      {rolledDriver.buffs.map((buff, index) => (
                        <div key={index} className="attribute-card buff">
                          <span className="attribute-name">{getText(buff.name)}</span>
                          <span className="attribute-desc">{getText(buff.description)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {rolledDriver.neutrals.length > 0 && (
                    <div className="attribute-section neutrals">
                      <h5 className="attribute-title">⚖️ {language === 'zh' ? '中性属性' : 'Neutrals'}</h5>
                      {rolledDriver.neutrals.map((neutral, index) => (
                        <div key={index} className="attribute-card neutral">
                          <span className="attribute-name">{getText(neutral.name)}</span>
                          <span className="attribute-desc">{getText(neutral.description)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {rolledDriver.debuffs.length > 0 && (
                    <div className="attribute-section debuffs">
                      <h5 className="attribute-title">⚠️ {language === 'zh' ? '减益属性' : 'Debuffs'}</h5>
                      {rolledDriver.debuffs.map((debuff, index) => (
                        <div key={index} className="attribute-card debuff">
                          <span className="attribute-name">{getText(debuff.name)}</span>
                          <span className="attribute-desc">{getText(debuff.description)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="result-actions">
                <button 
                  className="roll-again-btn racing-btn" 
                  onClick={rollDriver}
                >
                  <span className="flag">🏁</span>
                  {language === 'zh' ? '重新抽取' : 'Roll Again'}
                  <span className="flag">🏁</span>
                </button>
                <button 
                  className="new-driver-btn racing-btn secondary" 
                  onClick={resetRoll}
                >
                  <span className="flag">🏁</span>
                  {language === 'zh' ? '选择新驾驶员' : 'Select New Driver'}
                  <span className="flag">🏁</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default DriverRollPage;
