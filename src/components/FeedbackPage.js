import React, { useState, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

function FeedbackPage() {
  const { language } = useContext(LanguageContext);
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

  // Helper function to get text based on language
  const getText = (enText, zhText) => {
    return language === 'zh' ? zhText : enText;
  };

  const submitFeedback = (method) => {
    const { name, email, type, message } = formData;

    if (!name || !email || !message) {
      showStatus(getText('✗ Please fill in all required fields.', '✗ 请填写所有必填字段。'), 'error');
      return;
    }

    const subject = `Delta Dash Feedback: ${type.toUpperCase()}`;
    const body = `Name: ${name}\nEmail: ${email}\nFeedback Type: ${type}\n\nMessage:\n${message}`;
    const recipientEmail = 'ljl.leo7@gmail.com';

    if (method === 'local') {
      // Open local email client
      const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
      
      showStatus(getText('✓ Opening your email client with the feedback form...', '✓ 正在打开您的邮件客户端并填写反馈表单...'), 'success');
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
      <div class=\"modal-content\">
        <div class=\"modal-header\">
          <h3>${language === 'zh' ? '选择邮件服务' : 'Choose Your Email Service'}</h3>
          <button class=\"modal-close\">&times;</button>
        </div>
        <div class=\"modal-body\">
          <p>${language === 'zh' ? '选择您偏好的邮件服务来发送反馈：' : 'Select your preferred email service to send feedback:'}</p>
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
      showStatus(getText('✓ Feedback window opened. Complete your email and send!', '✓ 反馈窗口已打开。请完成您的邮件并发送！'), 'success');
    }, 500);
  };

  return (
    <section id="feedback-page" className="page-content">
      <div className="content-box">
        <h2>{getText('Send Your Feedback', '发送反馈')}</h2>
        <p>{getText('We\'d love to hear from you! Your feedback helps us improve the assistant.', '我们很乐意听取您的意见！您的反馈有助于我们改进助手。')}</p>
        
        <div id="feedbackStatus" className={`feedback-status ${statusClass}`}>
          {status}
        </div>
        
        <form id="feedbackForm" className="feedback-form">
          <div className="form-group">
            <label htmlFor="feedbackName">{getText('Your Name:', '您的姓名：')}</label>
            <input 
              type="text" 
              id="feedbackName" 
              name="name"
              placeholder={getText('Enter your name', '请输入您的姓名')} 
              className="form-input"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="feedbackEmail">{getText('Email Address:', '邮箱地址：')}</label>
            <input 
              type="email" 
              id="feedbackEmail" 
              name="email"
              placeholder={getText('Enter your email', '请输入您的邮箱')} 
              className="form-input"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="feedbackType">{getText('Feedback Type:', '反馈类型：')}</label>
            <select 
              id="feedbackType" 
              name="type"
              className="form-input"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="suggestion">{getText('Suggestion', '建议')}</option>
              <option value="bug">{getText('Bug Report', '错误报告')}</option>
              <option value="feature">{getText('Feature Request', '功能请求')}</option>
              <option value="general">{getText('General Feedback', '一般反馈')}</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="feedbackMessage">{getText('Your Message:', '您的消息：')}</label>
            <textarea 
              id="feedbackMessage" 
              name="message"
              placeholder={getText('Share your thoughts...', '分享您的想法...')} 
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
              <span className="btn-icon">📧</span> {getText('Send via Local Client', '通过本地客户端发送')}
            </button>
            <button 
              type="button" 
              id="submitOnlineBtn" 
              className="submit-feedback-btn online-btn"
              onClick={() => submitFeedback('online')}
            >
              <span className="btn-icon">🌐</span> {getText('Send via Outlook/Gmail', '通过Outlook/Gmail发送')}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default FeedbackPage;