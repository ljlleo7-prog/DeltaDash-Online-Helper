// DOM Elements
const userInput = document.getElementById('userInput');
const submitBtn = document.getElementById('submitBtn');
const responseContainer = document.getElementById('responseContainer');
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
  setupChatPage();
  setupStrategyCalculator();
  setupFeedbackForm();
  setupVersionPage();
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
function setupChatPage() {
  // Clear welcome message on first input
  userInput.addEventListener('focus', () => {
    if (responseContainer.children.length === 1 && 
        responseContainer.children[0].classList.contains('welcome-message')) {
      responseContainer.innerHTML = '';
    }
  });

  // Send message on button click
  submitBtn.addEventListener('click', sendMessage);

  // Send message on Enter key
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}

/**
 * Sends user message and generates a local response
 */
function sendMessage() {
  const message = userInput.value.trim();

  if (!message) {
    return;
  }

  // Display user message
  displayMessage(message, 'user');

  // Clear input
  userInput.value = '';

  // Generate local response
  const response = generateResponse(message);
  
  // Simulate slight delay for better UX
  setTimeout(() => {
    displayMessage(response, 'assistant');
  }, 300);

  // Focus back on input
  userInput.focus();
}

/**
 * Generates a response based on user input
 * @param {string} message - The user's message
 * @returns {string} - The assistant's response
 */
function generateResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Check for direct matches
  for (const [key, response] of Object.entries(assistantResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }

  // Default response for unknown queries
  const defaultResponses = [
    'That\'s interesting! Can you tell me more?',
    'I understand. How can I assist you further?',
    'Great question! I\'m here to help with any other queries.',
    'Thanks for sharing! What else can I help you with?',
    'I appreciate that. Feel free to ask me anything else!'
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

/**
 * Displays a message in the response container
 * @param {string} text - The message text
 * @param {string} sender - 'user' or 'assistant'
 */
function displayMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `response-message ${sender}`;
  messageDiv.textContent = text;

  responseContainer.appendChild(messageDiv);

  // Auto-scroll to bottom
  responseContainer.scrollTop = responseContainer.scrollHeight;
}

/**
 * Setup strategy calculator
 */
function setupStrategyCalculator() {
  const calculateBtn = document.getElementById('calculateBtn');
  const strategyResult = document.getElementById('strategyResult');
  const playerCount = document.getElementById('playerCount');
  const currentRound = document.getElementById('currentRound');
  const playerScore = document.getElementById('playerScore');

  calculateBtn.addEventListener('click', () => {
    const players = parseInt(playerCount.value);
    const round = parseInt(currentRound.value);
    const score = parseInt(playerScore.value);

    const strategy = calculateOptimalStrategy(players, round, score);
    
    strategyResult.textContent = strategy;
    strategyResult.classList.add('active');
  });
}

/**
 * Calculate optimal strategy based on game parameters
 * @param {number} players - Number of players
 * @param {number} round - Current round
 * @param {number} score - Player's current score
 * @returns {string} - Strategy recommendation
 */
function calculateOptimalStrategy(players, round, score) {
  const maxRounds = 10;
  const roundsRemaining = Math.max(0, maxRounds - round + 1);
  const potentialMax = score + (roundsRemaining * 12);

  let strategy = `Race Analysis:\n`;
  strategy += `Players: ${players} | Lap Stage: ${round}/${maxRounds} | Your Score: ${score}\n\n`;
  strategy += `Estimated potential (aggressive): ${potentialMax}\n\n`;

  // Pit stop advice
  if (round <= 3) {
    strategy += `Pit Stop Advice:\n- Early race: delay your first pit unless tyres are critical. Save tyres for later strategic stops.\n`;
  } else if (round <= 7) {
    strategy += `Pit Stop Advice:\n- Mid race: consider a short undercut if opponents pit early. Balance tyre wear and track position.\n`;
  } else {
    strategy += `Pit Stop Advice:\n- Late race: favour aggressive tyre choices and cover opponents' pit windows. Push for points.\n`;
  }

  // Tyre and playstyle
  if (players <= 2) {
    strategy += `Playstyle:\n- Two-player duel: be aggressive on overtakes, pressure the opponent into mistakes.\n`;
  } else if (players <= 4) {
    strategy += `Playstyle:\n- Mid pack: mix conservative tyre management with opportunistic overtakes. Watch higher-scoring players.\n`;
  } else {
    strategy += `Playstyle:\n- Full grid: play conservatively early, pick off rivals during their pit stops, and capitalise in final laps.\n`;
  }

  // Final push
  if (round >= 8) {
    strategy += `Final Push:\n- Final laps: maximise points with high-risk moves if you need positions. Protect podium spots if leading.\n`;
  }

  return strategy;
}

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
