import React, { useState } from 'react';

function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'suggestion',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [statusClass, setStatusClass] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showStatus = (message, className) => {
    setStatus(message);
    setStatusClass(className);
    setTimeout(() => {
      setStatus('');
      setStatusClass('');
    }, 4000);
  };

  const submitFeedback = (method) => {
    const { name, email, type, message } = formData;

    if (!name || !email || !message) {
      showStatus('✗ Please fill in all required fields.', 'error');
      return;
    }

    const subject = `Delta Dash Feedback: ${type.toUpperCase()}`;
    const body = `Name: ${name}\nEmail: ${email}\nFeedback Type: ${type}\n\nMessage:\n${message}`;
    const recipientEmail = 'ljl.leo7@gmail.com';

    if (method === 'local') {
      // Open local email client
      const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
      
      showStatus('✓ Opening your email client with the feedback form...', 'success');
    } else if (method === 'online') {
      // Show online email service options
      showEmailServiceModal(subject, body, email);
      return;
    }

    // Reset form
    setFormData({ name: '', email: '', type: 'suggestion', message: '' });
  };

  const showEmailServiceModal = (subject, body, userEmail) => {
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
      setFormData({ name: '', email: '', type: 'suggestion', message: '' });
      showStatus('✓ Feedback window opened. Complete your email and send!', 'success');
    }, 500);
  };

  return (
    <section id="feedback-page" className="page-content">
      <div className="content-box">
        <h2>Send Your Feedback</h2>
        <p>We'd love to hear from you! Your feedback helps us improve the assistant.</p>
        
        <div id="feedbackStatus" className={`feedback-status ${statusClass}`}>
          {status}
        </div>
        
        <form id="feedbackForm" className="feedback-form">
          <div className="form-group">
            <label htmlFor="feedbackName">Your Name:</label>
            <input 
              type="text" 
              id="feedbackName" 
              name="name"
              placeholder="Enter your name" 
              className="form-input"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="feedbackEmail">Email Address:</label>
            <input 
              type="email" 
              id="feedbackEmail" 
              name="email"
              placeholder="Enter your email" 
              className="form-input"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="feedbackType">Feedback Type:</label>
            <select 
              id="feedbackType" 
              name="type"
              className="form-input"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="suggestion">Suggestion</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="general">General Feedback</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="feedbackMessage">Your Message:</label>
            <textarea 
              id="feedbackMessage" 
              name="message"
              placeholder="Share your thoughts..." 
              className="form-textarea" 
              rows="5"
              value={formData.message}
              onChange={handleInputChange}
            ></textarea>
          </div>
          
          <div className="button-group">
            <button 
              type="button" 
              id="submitLocalBtn" 
              className="submit-feedback-btn local-btn"
              onClick={() => submitFeedback('local')}
            >
              <span className="btn-icon">📧</span> Send via Local Client
            </button>
            <button 
              type="button" 
              id="submitOnlineBtn" 
              className="submit-feedback-btn online-btn"
              onClick={() => submitFeedback('online')}
            >
              <span className="btn-icon">🌐</span> Send via Outlook/Gmail
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default FeedbackPage;