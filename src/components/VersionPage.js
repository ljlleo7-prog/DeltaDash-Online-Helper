import React, { useState, useEffect, useContext } from 'react';
import { formatDate, escapeHtml } from '../utils/helpers';
import { LanguageContext } from '../contexts/LanguageContext';

function VersionPage() {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useContext(LanguageContext);

  // Helper function to get text based on language
  const getText = (textObj) => {
    if (!textObj) return '';
    if (typeof textObj === 'string') return textObj;
    return textObj[language] || textObj.en || '';
  };

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    try {
      const response = await fetch('./versions.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Could not load versions.json: ${response.status} ${response.statusText}`);
      const data = await response.json();
      setVersions(Array.isArray(data) ? data : data.versions || []);
    } catch (error) {
      console.error('Error loading versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const showVersionModal = (title, date, description) => {
    const modal = document.createElement('div');
    modal.className = 'email-modal';
    const bodyHtml = (description || '').split('\n\n').map(p => `<p>${escapeHtml(p)}</p>`).join('');
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${escapeHtml(title)} <small style="opacity:.7; font-weight:400; margin-left:12px;">${escapeHtml(date)}</small></h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          ${bodyHtml}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  };

  return (
    <section id="version-page" className="page-content">
      <h2>{language === 'zh' ? '版本历史' : 'Version History'}</h2>
      {loading ? (
        <p>{language === 'zh' ? '加载版本中...' : 'Loading versions...'}</p>
      ) : (
        <div className="versions-list">
          {versions.map((version, index) => {
            const modifier = /beta/i.test(getText(version.name)) ? 'beta' : 
                           (/alpha/i.test(getText(version.name)) ? 'alpha' : 
                           (/indev/i.test(getText(version.name)) ? 'indev' : 
                           (/release/i.test(getText(version.name)) ? 'release' : '')));
            
            return (
              <div key={index} className={`version-card ${modifier}`.trim()}>
                <div className="version-header">
                  <h3>{getText(version.name) || (language === 'zh' ? '未命名版本' : 'Unnamed Version')}</h3>
                  <span className="release-date">{version.date || ''}</span>
                </div>
                <p className="version-brief">{getText(version.brief) || ''}</p>
                <div className="version-actions">
                  <button 
                    className="btn version-desc-btn"
                    onClick={() => showVersionModal(getText(version.name), version.date, getText(version.description))}
                  >
                    {language === 'zh' ? '版本描述' : 'Version Description'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default VersionPage;