import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

function DriverRollPage() {
  const [driverData, setDriverData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [rolledDriver, setRolledDriver] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const { language } = useContext(LanguageContext);

  // Helper function to get text based on language
  const getText = (textObj) => {
    if (!textObj) return '';
    if (typeof textObj === 'string') return textObj;
    return textObj[language] || textObj.en || '';
  };

  useEffect(() => {
    loadDriverData();
  }, []);

  const loadDriverData = async () => {
    try {
      const response = await fetch('./driver_data.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Could not load driver_data.json: ${response.status} ${response.statusText}`);
      const data = await response.json();
      setDriverData(data);
    } catch (error) {
      console.error('Error loading driver data:', error);
    }
  };

  const selectTemplate = (template) => {
    setSelectedTemplate(template);
    setRolledDriver(null);
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

      // Roll buffs
      for (let i = 0; i < selectedTemplate.buffSlots; i++) {
        const randomBuff = driverData.buffPool[Math.floor(Math.random() * driverData.buffPool.length)];
        rolledDriver.buffs.push(randomBuff);
      }

      // Roll neutrals
      for (let i = 0; i < selectedTemplate.neutralSlots; i++) {
        const randomNeutral = driverData.neutralPool[Math.floor(Math.random() * driverData.neutralPool.length)];
        rolledDriver.neutrals.push(randomNeutral);
      }

      // Roll debuffs
      for (let i = 0; i < selectedTemplate.debuffSlots; i++) {
        const randomDebuff = driverData.debuffPool[Math.floor(Math.random() * driverData.debuffPool.length)];
        rolledDriver.debuffs.push(randomDebuff);
      }

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
        <h2>{language === 'zh' ? '驾驶员抽取' : 'Driver Roll'}</h2>
        <p>{language === 'zh' ? '加载数据中...' : 'Loading data...'}</p>
      </section>
    );
  }

  return (
    <section id="driver-roll-page" className="page-content">
      <h2>{language === 'zh' ? '驾驶员抽取' : 'Driver Roll'}</h2>
      
      {!selectedTemplate ? (
        <div className="template-selection">
          <h3>{language === 'zh' ? '选择驾驶员模板' : 'Select Driver Template'}</h3>
          <div className="template-grid">
            {driverData.driverTemplates.map((template) => (
              <div 
                key={template.id} 
                className="template-card"
                onClick={() => selectTemplate(template)}
              >
                <div className="template-image">
                  <div className="placeholder-image">🚗</div>
                </div>
                <div className="template-info">
                  <h4>{getText(template.name)}</h4>
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
            <h3>{getText(selectedTemplate.name)}</h3>
            <div className="template-details">
              <div className="basic-data">
                <h4>{language === 'zh' ? '基本信息' : 'Basic Data'}</h4>
                <p><strong>{language === 'zh' ? '年龄:' : 'Age:'}</strong> {getText(selectedTemplate.basicData.age)}</p>
                <p><strong>{language === 'zh' ? '经验:' : 'Experience:'}</strong> {getText(selectedTemplate.basicData.experience)}</p>
                <p><strong>{language === 'zh' ? '国籍:' : 'Nationality:'}</strong> {getText(selectedTemplate.basicData.nationality)}</p>
              </div>
              <div className="slot-info">
                <h4>{language === 'zh' ? '属性槽位' : 'Attribute Slots'}</h4>
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
                className="roll-button" 
                onClick={rollDriver}
                disabled={isRolling}
              >
                {isRolling ? 
                  (language === 'zh' ? '抽取中...' : 'Rolling...') : 
                  <span>{language === 'zh' ? '抽取驾驶员' : 'Roll Driver'}</span>
                }
              </button>
              <button 
                className="back-btn" 
                onClick={resetRoll}
                disabled={isRolling}
              >
                {language === 'zh' ? '返回选择' : 'Back to Selection'}
              </button>
            </div>
          ) : (
            <div className="result-section">
              <h3>{language === 'zh' ? '抽取结果' : 'Roll Result'}</h3>
              <div className="driver-result">
                <div className="driver-header">
                  <div className="driver-image">
                    <div className="placeholder-image">🏎️</div>
                  </div>
                  <div className="driver-name">
                    <h4>{getText(selectedTemplate.name)}</h4>
                    <span className="driver-type">{getText(selectedTemplate.basicData.experience)}</span>
                  </div>
                </div>

                <div className="attributes-grid">
                  {rolledDriver.buffs.length > 0 && (
                    <div className="attribute-section buffs">
                      <h5>🎯 {language === 'zh' ? '增益属性' : 'Buffs'}</h5>
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
                      <h5>⚖️ {language === 'zh' ? '中性属性' : 'Neutrals'}</h5>
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
                      <h5>⚠️ {language === 'zh' ? '减益属性' : 'Debuffs'}</h5>
                      {rolledDriver.debuffs.map((debuff, index) => (
                        <div key={index} className="attribute-card debuff">
                          <span className="attribute-name">{getText(debuff.name)}</span>
                          <span className="attribute-desc">{getText(debuff.description)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="result-actions">
                  <button className="roll-button" onClick={resetRoll}>
                    <span>{language === 'zh' ? '再次抽取' : 'Roll Again'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default DriverRollPage;