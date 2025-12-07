/**
 * Main application file - Coordinates all page modules
 */

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Setup navigation and front background
  if (window.Utils) {
    window.Utils.setupNavigation();
    window.Utils.setupFrontBackground();
  }

  // Initialize the current page
  const currentPage = getCurrentPage();
  if (window.Utils) {
    window.Utils.initializePage(currentPage);
  }

  // Initialize feedback form on all pages where it exists
  if (document.getElementById('feedbackForm') && window.FeedbackModule) {
    window.FeedbackModule.initFeedback();
  }
});

/**
 * Get the current active page
 */
function getCurrentPage() {
  const activeButton = document.querySelector('.nav-btn.active');
  if (activeButton) {
    return activeButton.dataset.page;
  }
  
  // Default to homepage if no active button found
  return 'homepage';
}

/**
 * Utility functions for compatibility
 */
function formatDate(dateString) {
  return window.Utils ? window.Utils.formatDate(dateString) : new Date(dateString).toLocaleDateString();
}

function escapeHtml(str) {
  return window.Utils ? window.Utils.escapeHtml(str) : String(str).replace(/[&<>"]+/g, function(match){
    switch(match){
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      default: return match;
    }
  });
}