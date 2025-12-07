/**
 * Utility functions shared across all pages
 */

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
 * Escape HTML to prevent XSS attacks
 */
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
      
      // Initialize the newly active page
      initializePage(button.dataset.page);
    });
  });
}

/**
 * Initialize the specified page
 */
function initializePage(pageName) {
  switch (pageName) {
    case 'homepage':
      if (window.HomepageModule) {
        window.HomepageModule.initHomepage();
      }
      break;
    case 'about':
      if (window.AboutModule) {
        window.AboutModule.initAbout();
      }
      break;
    case 'version':
      if (window.VersionModule) {
        window.VersionModule.initVersion();
      }
      break;
    case 'strategy':
      if (window.StrategyModule) {
        window.StrategyModule.initStrategy();
      }
      break;
    case 'feedback':
      if (window.FeedbackModule) {
        window.FeedbackModule.initFeedback();
      }
      break;
  }
}

// Export utility functions
window.Utils = {
  formatDate,
  escapeHtml,
  setupFrontBackground,
  setupNavigation,
  initializePage
};