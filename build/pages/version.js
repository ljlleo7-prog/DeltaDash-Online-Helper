/**
 * Version page functionality - Version information and update checking
 */

/**
 * Setup version page
 */
function setupVersionPage() {
  const checkUpdateBtn = document.querySelector('.check-update-btn');
  
  if (checkUpdateBtn) {
    checkUpdateBtn.addEventListener('click', () => {
      const originalText = checkUpdateBtn.textContent;
      checkUpdateBtn.textContent = 'Checking for updates...';
      checkUpdateBtn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        checkUpdateBtn.textContent = 'You are on the latest version!';
        checkUpdateBtn.style.background = '#28a745';
        
        setTimeout(() => {
          checkUpdateBtn.textContent = originalText;
          checkUpdateBtn.disabled = false;
          checkUpdateBtn.style.background = '';
        }, 3000);
      }, 1500);
    });
  }
}

/* Load versions.json and render version cards dynamically */
async function loadAndRenderVersions(){
  const container = document.getElementById('versions-list') || document.querySelector('#version-page .versions-list');
  if (!container) return;
  try {
    const res = await fetch('versions.json', {cache: 'no-store'});
    if (!res.ok) throw new Error('Could not load versions.json');
    const versions = await res.json();
    container.innerHTML = '';
    versions.forEach(v => {
      const card = document.createElement('div');
      const name = v.name || 'Unnamed Version';
      const date = v.date || '';
      const brief = v.brief || '';
      const desc = v.description || '';

      // guess modifier from name
      const modifier = /beta/i.test(name) ? 'beta' : 
                     (/alpha/i.test(name) ? 'alpha' : 
                     (/indev/i.test(name) ? 'indev' : 
                     (/release/i.test(name) ? 'release' : '')));
      card.className = `version-card ${modifier}`.trim();

      card.innerHTML = `
        <div class="version-header">
          <h3>${escapeHtml(name)}</h3>
          <span class="release-date">${escapeHtml(date)}</span>
        </div>
        <p class="version-brief">${escapeHtml(brief)}</p>
        <div class="version-actions">
          <a href="#" class="btn version-desc-btn">Version Description</a>
        </div>
      `;

      // attach description data
      const descBtn = card.querySelector('.version-desc-btn');
      descBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showVersionModal(name, date, desc);
      });

      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = `<p class="error-note">Unable to load versions.</p>`;
    console.error(err);
  }
}

function showVersionModal(title, date, description){
  const modal = document.createElement('div');
  modal.className = 'email-modal'; // reuse modal styling
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
}

/**
 * Version page functionality - Version information and updates
 */

/**
 * Initialize version page functionality
 */
function initVersion() {
  // Generate version page content
  generateVersionContent();
  
  // Setup version page functionality
  setupVersionPage();
  
  // Load and render versions
  loadAndRenderVersions();
}

/**
 * Generate version page HTML content
 */
function generateVersionContent() {
  const versionPage = document.getElementById('version-page');
  if (!versionPage) return;

  versionPage.innerHTML = `
    <div class="content-box versions-list" id="versions-list">
      <h2>Version History</h2>
      <p>Loading versions…</p>
    </div>
  `;
}

// Export functions for use in main app.js
window.VersionModule = {
  initVersion
};