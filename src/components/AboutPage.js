import React, { useContext, useState, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import boardgameDataJson from '../data/boardgame_data.json';

function AboutPage() {
  const { language } = useContext(LanguageContext);
  const [boardgameData, setBoardgameData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBoardgameData(boardgameDataJson);
    setLoading(false);
  }, []);

  const getText = (textObj) => {
    return textObj ? (textObj[language] || textObj.en || '') : '';
  };

  if (loading) {
    return (
      <section id="about-page" className="page-content">
        <div className="about-boardgame-container">
          <h2 className="about-boardgame-title">
            {language === 'zh' ? '加载中...' : 'Loading...'}
          </h2>
        </div>
      </section>
    );
  }

  if (!boardgameData) {
    return (
      <section id="about-page" className="page-content">
        <div className="about-boardgame-container">
          <h2 className="about-boardgame-title">
            {language === 'zh' ? '数据加载失败' : 'Failed to load data'}
          </h2>
          <p>请检查浏览器控制台查看详细错误信息</p>
        </div>
      </section>
    );
  }

  return (
    <section id="about-page" className="page-content">
      <div className="about-boardgame-container">
        <h1 className="about-boardgame-title">
          {getText(boardgameData.gameInfo.title)}
        </h1>
        <h2 className="about-boardgame-subtitle">
          {getText(boardgameData.gameInfo.subtitle)}
        </h2>

        {/* Game Information Section */}
        <section className="game-info-section">
          <div className="game-info-header">
            <span className="game-info-icon">🎮</span>
            <h3 className="game-info-title">
              {getText(boardgameData.gameInfo.title)}
            </h3>
          </div>
          <p className="game-info-content">
            {getText(boardgameData.gameInfo.description)}
          </p>
          
          <div className="game-info-grid">
            <div className="game-info-item">
              <div className="game-info-label">
                {language === 'zh' ? '发布日期' : 'Release Date'}
              </div>
              <div className="game-info-value">
                {getText(boardgameData.gameInfo.releaseDate)}
              </div>
            </div>
            <div className="game-info-item">
              <div className="game-info-label">
                {language === 'zh' ? '玩家数量' : 'Players'}
              </div>
              <div className="game-info-value">
                {getText(boardgameData.gameInfo.players)}
              </div>
            </div>
            <div className="game-info-item">
              <div className="game-info-label">
                {language === 'zh' ? '游戏时长' : 'Play Time'}
              </div>
              <div className="game-info-value">
                {getText(boardgameData.gameInfo.playTime)}
              </div>
            </div>
            <div className="game-info-item">
              <div className="game-info-label">
                {language === 'zh' ? '年龄范围' : 'Age Range'}
              </div>
              <div className="game-info-value">
                {getText(boardgameData.gameInfo.ageRange)}
              </div>
            </div>
            <div className="game-info-item">
              <div className="game-info-label">
                {language === 'zh' ? '复杂度' : 'Complexity'}
              </div>
              <div className="game-info-value">
                {getText(boardgameData.gameInfo.complexity)}
              </div>
            </div>
          </div>
        </section>

        {/* Game Components Section */}
        <section className="components-section">
          <div className="game-info-header">
            <span className="game-info-icon">🧩</span>
            <h3 className="game-info-title">
              {getText(boardgameData.gameComponents.title)}
            </h3>
          </div>
          
          <div className="components-grid">
            {boardgameData.gameComponents.items.map((component, index) => (
              <div key={index} className="component-card">
                <div className="component-icon">📦</div>
                <h4 className="component-name">
                  {getText(component.name)}
                </h4>
                <p className="component-description">
                  {getText(component.description)}
                </p>
                <span className="component-quantity">
                  {getText(component.quantity)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Key Features Section */}
        <section className="features-section">
          <div className="game-info-header">
            <span className="game-info-icon">✨</span>
            <h3 className="game-info-title">
              {getText(boardgameData.gameFeatures.title)}
            </h3>
          </div>
          
          <div className="features-grid">
            {boardgameData.gameFeatures.features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4 className="feature-title">
                  {getText(feature.title)}
                </h4>
                <p className="feature-description">
                  {getText(feature.description)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Gameplay Overview Section */}
        <section className="gameplay-section">
          <div className="game-info-header">
            <span className="game-info-icon">🎯</span>
            <h3 className="game-info-title">
              {getText(boardgameData.gameplaySections.title)}
            </h3>
          </div>
          
          <div className="gameplay-content">
            {boardgameData.gameplaySections.sections.map((section, index) => (
              <div key={index} className="gameplay-item">
                <h4 className="gameplay-item-title">
                  {getText(section.title)}
                </h4>
                <p className="gameplay-item-content">
                  {getText(section.content)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Development Team Section */}
        <section className="team-section">
          <div className="game-info-header">
            <span className="game-info-icon">👥</span>
            <h3 className="game-info-title">
              {getText(boardgameData.developmentTeam.title)}
            </h3>
          </div>
          
          <div className="team-grid">
            {boardgameData.developmentTeam.members.map((member, index) => (
              <div key={index} className="team-member">
                <h4 className="team-member-name">
                  {getText(member.name)}
                </h4>
                <p className="team-member-role">
                  {getText(member.role)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export default AboutPage;