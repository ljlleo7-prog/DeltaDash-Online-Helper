// DOM Elements (only what's needed)
const navButtons = document.querySelectorAll('.nav-btn');
const pageContents = document.querySelectorAll('.page-content');


// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();

  // Feedback form should be present
  setupFeedbackForm();

  // Version page controls may be present — guard before initializing
  if (document.querySelector('.check-update-btn')) {
    setupVersionPage();
  }
  // Load versions from JSON if container present
  if (document.getElementById('versions-list') || document.querySelector('#version-page .versions-list')) {
    loadAndRenderVersions();
  }
  // Front background (faint image) — initialize if present
  if (document.getElementById('front-bg')) {
    setupFrontBackground();
  }
  
  // Load and render News and About Us sections
  if (document.getElementById('homepage-page')) {
    loadAndRenderNews();
    loadAndRenderAboutUs();
  }
});

/**
 * Load and render News section dynamically
 */
async function loadAndRenderNews() {
  const homepage = document.getElementById('homepage-page');
  if (!homepage) return;
  
  try {
    const response = await fetch('news.json');
    if (!response.ok) throw new Error('Could not load news.json');
    const data = await response.json();
    
    const newsContainer = document.createElement('div');
    newsContainer.className = 'news-section';
    newsContainer.innerHTML = `
      <h3>📰 Latest News</h3>
      <div class="news-grid">
        ${data.news.map(item => `
          <div class="news-card">
            <div class="news-image">
              <img src="${escapeHtml(item.img_src)}" alt="${escapeHtml(item.title)}" />
            </div>
            <div class="news-content">
              <h4>${escapeHtml(item.title)}</h4>
              <span class="news-date">${formatDate(item.date)}</span>
              <p>${escapeHtml(item.content)}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    // Insert at the top of homepage
    homepage.insertBefore(newsContainer, homepage.firstChild.nextSibling);
  } catch (error) {
    console.error('Error loading news:', error);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'news-section';
    errorDiv.innerHTML = '<h3>📰 Latest News</h3><p>Unable to load news at this time.</p>';
    homepage.insertBefore(errorDiv, homepage.firstChild.nextSibling);
  }
}

/**
 * Load and render About Us section dynamically
 */
async function loadAndRenderAboutUs() {
  const homepage = document.getElementById('homepage-page');
  if (!homepage) return;
  
  try {
    const response = await fetch('about_us.json');
    if (!response.ok) throw new Error('Could not load about_us.json');
    const data = await response.json();
    
    const aboutContainer = document.createElement('div');
    aboutContainer.className = 'about-section';
    aboutContainer.innerHTML = `
      <h3>👥 About Us</h3>
      <div class="about-content">
        <div class="company-info">
          <h4>${escapeHtml(data.about_us.company_name)}</h4>
          <p class="mission">${escapeHtml(data.about_us.mission)}</p>
          <p class="description">${escapeHtml(data.about_us.description)}</p>
        </div>
        
        <div class="team-section">
          <h4>Featuring...</h4>
          <div class="team-grid">
            ${data.about_us.team.map(member => `
              <div class="team-member">
                <div class="member-image">
                  <img src="${escapeHtml(member.img_src)}" alt="${escapeHtml(member.title)}" />
                </div>
                <div class="member-info">
                  <h5>${escapeHtml(member.title)}</h5>
                  <span class="member-date">${escapeHtml(member.date)}</span>
                  <p>${escapeHtml(member.content)}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="contact-section">
          <h4>Contact Information</h4>
          <div class="contact-info">
            <p><strong>Email:</strong> ${escapeHtml(data.about_us.contact.email)}</p>
            <p><strong>Website:</strong> ${escapeHtml(data.about_us.contact.website)}</p>
            <p><strong>Location:</strong> ${escapeHtml(data.about_us.contact.location)}</p>
          </div>
        </div>
      </div>
    `;
    
    // Insert at the bottom of homepage (after news section)
    homepage.appendChild(aboutContainer);
  } catch (error) {
    console.error('Error loading about us:', error);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'about-section';
    errorDiv.innerHTML = '<h3>👥 About Us</h3><p>Unable to load about us information at this time.</p>';
    homepage.appendChild(errorDiv);
  }
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Setup navigation between pages
 */
function setupNavigation() {
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const pageId = button.dataset.page + '-page';
      
      // Update active button
      navButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update active page
      pageContents.forEach(page => page.classList.remove('active'));
      const activePage = document.getElementById(pageId);
      if (activePage) {
        activePage.classList.add('active');
      }
    });
  });
}

/**
 * Setup chat page functionality
 */
// Chat, strategy and about helper functions and prefills removed to keep code minimal.
// Navigation, feedback, and version logic remain.

/**
 * Setup strategy calculator
 */
// Strategy calculator removed — page is intentionally blank and logic has been trimmed.

/**
 * Setup feedback form
 */
function setupFeedbackForm() {
  const feedbackForm = document.getElementById('feedbackForm');
  const submitLocalBtn = document.getElementById('submitLocalBtn');
  const submitOnlineBtn = document.getElementById('submitOnlineBtn');
  const feedbackStatus = document.getElementById('feedbackStatus');

  // Local email client submission
  submitLocalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    submitFeedback('local');
  });

  // Online email service submission
  submitOnlineBtn.addEventListener('click', (e) => {
    e.preventDefault();
    submitFeedback('online');
  });

  /**
   * Submit feedback through chosen method
   * @param {string} method - 'local' for mailto or 'online' for web email services
   */
  function submitFeedback(method) {
    const name = document.getElementById('feedbackName').value;
    const email = document.getElementById('feedbackEmail').value;
    const type = document.getElementById('feedbackType').value;
    const message = document.getElementById('feedbackMessage').value;

    if (!name || !email || !message) {
      feedbackStatus.className = 'feedback-status error';
      feedbackStatus.textContent = '✗ Please fill in all required fields.';
      return;
    }

    const subject = `Delta Dash Feedback: ${type.toUpperCase()}`;
    const body = `Name: ${name}\nEmail: ${email}\nFeedback Type: ${type}\n\nMessage:\n${message}`;
    const recipientEmail = 'ljl.leo7@gmail.com';

    if (method === 'local') {
      // Open local email client
      const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
      
      feedbackStatus.className = 'feedback-status success';
      feedbackStatus.textContent = '✓ Opening your email client with the feedback form...';
    } else if (method === 'online') {
      // Show options for online email services
      showEmailServiceModal(subject, body, email);
      return;
    }

    // Reset form
    feedbackForm.reset();
    
    // Clear message after 4 seconds
    setTimeout(() => {
      feedbackStatus.className = 'feedback-status';
    }, 4000);
  }

  /**
   * Show modal with online email service options
   */
  function showEmailServiceModal(subject, body, userEmail) {
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=ljl.leo7@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const outlook = `https://outlook.office.com/mail/deeplink/compose?to=ljl.leo7@gmail.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const yahoo = `https://compose.mail.yahoo.com/?to=ljl.leo7@gmail.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'email-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Choose Your Email Service</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p>Select your preferred email service to send feedback:</p>
          <div class="email-options">
            <a href="${gmail}" target="_blank" class="email-option gmail-btn">
              <span class="service-icon">📧</span>
              <span class="service-name">Gmail</span>
            </a>
            <a href="${outlook}" target="_blank" class="email-option outlook-btn">
              <span class="service-icon">📬</span>
              <span class="service-name">Outlook</span>
            </a>
            <a href="${yahoo}" target="_blank" class="email-option yahoo-btn">
              <span class="service-icon">📮</span>
              <span class="service-name">Yahoo Mail</span>
            </a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    // Reset form after selection
    setTimeout(() => {
      feedbackForm.reset();
      feedbackStatus.className = 'feedback-status success';
      feedbackStatus.textContent = '✓ Feedback window opened. Complete your email and send!';
      
      setTimeout(() => {
        feedbackStatus.className = 'feedback-status';
      }, 4000);
    }, 500);
  }
}

/**
 * Setup version page
 */
function setupVersionPage() {
  const checkUpdateBtn = document.querySelector('.check-update-btn');
  
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
      const modifier = /beta/i.test(name) ? 'beta' : (/alpha/i.test(name) ? 'alpha' : '');
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

function escapeHtml(str){
  return String(str).replace(/[&<>"]+/g, function(match){
    switch(match){
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      default: return match;
    }
  });
}

/**
 * Setup the front-page faint background behavior.
 * The image fades and translates upwards as the user scrolls down.
 */
function setupFrontBackground(){
  const front = document.getElementById('front-bg');
  if (!front) return;

  let lastY = window.scrollY || 0;
  let ticking = false;
  const maxFade = 320; // px distance where image is fully faded
  const maxTranslate = 220; // max upward translate in px

  function update(){
    const y = Math.max(0, lastY);
    const t = Math.min(y / maxFade, 1);
    const translate = Math.min(y * 0.6, maxTranslate);
    const opacity = Math.max(0, 1 - t) * 0.45;

    front.style.transform = `translateX(-50%) translateY(-${translate}px)`;
    front.style.opacity = String(opacity);
    ticking = false;
  }

  function onScroll(){
    lastY = window.scrollY || 0;
    if (!ticking){
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  // initialize
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
}
