/**
 * Feedback page functionality - Feedback form and submission
 */

/**
 * Initialize feedback page functionality
 */
function initFeedback() {
  // Generate feedback page content
  generateFeedbackContent();
  
  // Setup feedback form functionality
  setupFeedbackForm();
}

/**
 * Generate feedback page HTML content
 */
function generateFeedbackContent() {
  const feedbackPage = document.getElementById('feedback-page');
  if (!feedbackPage) return;

  feedbackPage.innerHTML = `
    <div class="content-box">
      <h2>Send Your Feedback</h2>
      <p>We'd love to hear from you! Your feedback helps us improve the assistant.</p>
      <form id="feedbackForm" class="feedback-form">
        <div class="form-group">
          <label for="feedbackName">Your Name:</label>
          <input type="text" id="feedbackName" placeholder="Enter your name" class="form-input">
        </div>
        <div class="form-group">
          <label for="feedbackEmail">Email Address:</label>
          <input type="email" id="feedbackEmail" placeholder="Enter your email" class="form-input">
        </div>
        <div class="form-group">
          <label for="feedbackType">Feedback Type:</label>
          <select id="feedbackType" class="form-input">
            <option value="suggestion">Suggestion</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="general">General Feedback</option>
          </select>
        </div>
        <div class="form-group">
          <label for="feedbackMessage">Your Message:</label>
          <textarea id="feedbackMessage" placeholder="Share your thoughts..." class="form-textarea" rows="5"></textarea>
        </div>
        <div class="button-group">
          <button type="button" id="submitLocalBtn" class="submit-feedback-btn local-btn">
            <span class="btn-icon">📧</span> Send via Local Client
          </button>
          <button type="button" id="submitOnlineBtn" class="submit-feedback-btn online-btn">
            <span class="btn-icon">🌐</span> Send via Outlook/Gmail
          </button>
        </div>
      </form>
      <div id="feedbackStatus" class="feedback-status"></div>
    </div>
  `;
}

/**
 * Setup feedback form
 */
function setupFeedbackForm() {
  const feedbackForm = document.getElementById('feedbackForm');
  const submitLocalBtn = document.getElementById('submitLocalBtn');
  const submitOnlineBtn = document.getElementById('submitOnlineBtn');
  const feedbackStatus = document.getElementById('feedbackStatus');

  if (!feedbackForm || !submitLocalBtn || !submitOnlineBtn || !feedbackStatus) return;

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

// Export functions for use in main app.js
window.FeedbackModule = {
  initFeedback,
  setupFeedbackForm
};