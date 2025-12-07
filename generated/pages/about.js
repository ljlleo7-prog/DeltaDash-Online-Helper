/**
 * About page functionality - About information
 */

/**
 * Initialize about page functionality
 */
function initAbout() {
  // Generate about page content
  generateAboutContent();
  
  // About page is currently empty but can be enhanced with additional content
  // This function can be expanded to load dynamic content or setup interactions
  console.log('About page initialized');
}

/**
 * Generate about page HTML content
 */
function generateAboutContent() {
  const aboutPage = document.getElementById('about-page');
  if (!aboutPage) return;

  aboutPage.innerHTML = `
    <div class="content-box">
      <h2>About Delta Dash Online Assistant</h2>
      <p>This is the about page content. More information about the project can be added here.</p>
    </div>
  `;
}

// Export functions for use in main app.js
window.AboutModule = {
  initAbout
};