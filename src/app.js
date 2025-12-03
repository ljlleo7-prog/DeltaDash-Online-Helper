// Note: Query DOM elements inside setup functions so they are present
// when the script initializes in both dev and production builds.

// Simple assistant responses database

// Initialize (works whether script runs before or after DOMContentLoaded)
function init() {
  setupNavigation();
  setupFeedbackForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM already ready — initialize immediately
  init();
}

/**
 * Setup navigation between pages
 */
function setupNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const pageContents = document.querySelectorAll('.page-content');

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
 * Setup feedback form
 */
function setupFeedbackForm() {
  const feedbackForm = document.getElementById('feedbackForm');
  const submitLocalBtn = document.getElementById('submitLocalBtn');
  const submitOnlineBtn = document.getElementById('submitOnlineBtn');
  const feedbackStatus = document.getElementById('feedbackStatus');

  if (!feedbackForm || !submitLocalBtn || !submitOnlineBtn) return;

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
    const nameEl = document.getElementById('feedbackName');
    const emailEl = document.getElementById('feedbackEmail');
    const typeEl = document.getElementById('feedbackType');
    const messageEl = document.getElementById('feedbackMessage');

    const name = nameEl?.value || '';
    const email = emailEl?.value || '';
    const type = typeEl?.value || 'general';
    const message = messageEl?.value || '';

    if (!name || !email || !message) {
      if (feedbackStatus) {
        feedbackStatus.className = 'feedback-status error';
        feedbackStatus.textContent = '✗ Please fill in all required fields.';
      }
      return;
    }

    const subject = `Delta Dash Feedback: ${type.toUpperCase()}`;
    const body = `Name: ${name}\nEmail: ${email}\nFeedback Type: ${type}\n\nMessage:\n${message}`;
    const recipientEmail = 'ljl.leo7@gmail.com';

    if (method === 'local') {
      // Open local email client
      const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
      
      if (feedbackStatus) {
        feedbackStatus.className = 'feedback-status success';
        feedbackStatus.textContent = '✓ Opening your email client with the feedback form...';
      }
    } else if (method === 'online') {
      // Show options for online email services
      showEmailServiceModal(subject, body, email);
      return;
    }

    // Reset form
    feedbackForm.reset();
    
    // Clear message after 4 seconds
    setTimeout(() => {
      if (feedbackStatus) feedbackStatus.className = 'feedback-status';
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
