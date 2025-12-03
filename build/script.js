// DOM Elements (only what's needed)
const navButtons = document.querySelectorAll('.nav-btn');
const pageContents = document.querySelectorAll('.page-content');

// Simple assistant responses database
const assistantResponses = {
  'hello': 'Welcome to Delta Dash — your F1 motorsports strategy assistant. Ask about race strategy, pit stops, or setup tips!',
  'hi': 'Hi racer! Need help with tire strategy, pit timing, or a rule clarification?',
  'help': 'I can assist with race strategy, version info, strategy calculations, or submit feedback about the F1 boardgame.',
  'time': `Race local time: ${new Date().toLocaleTimeString()}`,
  'date': `Event date: ${new Date().toLocaleDateString()}`,
  'thanks': 'Glad to be of service — enjoy the race!',
  'thank you': 'Glad to be of service — enjoy the race!',
  'bye': 'See you on the podium! Good luck out there!',
  'goodbye': 'See you on the podium! Good luck out there!'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();

  // Feedback form should be present
  setupFeedbackForm();

  // Version page controls may be present — guard before initializing
  if (document.querySelector('.check-update-btn')) {
    setupVersionPage();
  }
});

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
    const outlook = `https://outlook.live.com/?path=/mail/action/compose&to=ljl.leo7@gmail.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
