import React, { useState, useEffect } from 'react';
import { formatDate, escapeHtml } from '../utils/helpers';

function HomePage() {
  const [news, setNews] = useState([]);
  const [aboutUs, setAboutUs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
    loadAboutUs();
  }, []);

  const loadNews = async () => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL || ''}/news.json`);
      if (!response.ok) throw new Error('Could not load news.json');
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error('Error loading news:', error);
    }
  };

  const loadAboutUs = async () => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL || ''}/about_us.json`);
      if (!response.ok) throw new Error('Could not load about_us.json');
      const data = await response.json();
      setAboutUs(data.about_us);
    } catch (error) {
      console.error('Error loading about us:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="homepage-page" className="page-content active">
        <div className="loading">Loading...</div>
      </section>
    );
  }

  return (
    <section id="homepage-page" className="page-content active">
      {/* News Section */}
      <div className="news-section">
        <h3>📰 Latest News</h3>
        <div className="news-grid">
          {news.map((item, index) => (
            <div key={index} className="news-card">
              <div className="news-image">
                <img src={item.img_src} alt={escapeHtml(item.title)} />
              </div>
              <div className="news-content">
                <h4>{item.title}</h4>
                <span className="news-date">{formatDate(item.date)}</span>
                <p>{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Us Section */}
      {aboutUs && (
        <div className="about-section">
          <h3>👥 About Us</h3>
          <div className="about-content">
            <div className="company-info">
              <h4>{aboutUs.company_name}</h4>
              <p className="mission">{aboutUs.mission}</p>
              <p className="description">{aboutUs.description}</p>
            </div>
            
            <div className="team-section">
              <h4>Featuring...</h4>
              <div className="team-grid">
                {aboutUs.team.map((member, index) => (
                  <div key={index} className="team-member">
                    <div className="member-image">
                      <img src={member.img_src} alt={escapeHtml(member.title)} />
                    </div>
                    <div className="member-info">
                      <h5>{member.title}</h5>
                      <span className="member-date">{member.date}</span>
                      <p>{member.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="contact-section">
              <h4>Contact Information</h4>
              <div className="contact-info">
                <p><strong>Email:</strong> {aboutUs.contact.email}</p>
                {aboutUs.contact.bilibili && (
                  <p><strong>Bilibili:</strong> <a href={aboutUs.contact.bilibili.url} target="_blank" rel="noopener noreferrer" className="contact-link">{aboutUs.contact.bilibili.text}</a></p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default HomePage;