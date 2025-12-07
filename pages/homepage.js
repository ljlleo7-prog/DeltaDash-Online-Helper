/**
 * Homepage functionality - News and About Us sections
 */

/**
 * Initialize homepage functionality
 */
function initHomepage() {
  // Generate homepage content structure
  generateHomepageContent();
  
  // Load and render content
  if (document.getElementById('homepage-page')) {
    loadAndRenderNews();
    loadAndRenderAboutUs();
  }
}

/**
 * Generate homepage HTML content structure
 */
function generateHomepageContent() {
  const homepage = document.getElementById('homepage-page');
  if (!homepage) return;

  // Clear existing content and set up structure
  homepage.innerHTML = `
    <div class="homepage-content">
      
      <!-- News and About sections will be dynamically loaded here -->
    </div>
  `;
}

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
    
    // Insert at the top of homepage (use appendChild since homepage is empty)
    homepage.appendChild(newsContainer);
  } catch (error) {
    console.error('Error loading news:', error);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'news-section';
    errorDiv.innerHTML = '<h3>📰 Latest News</h3><p>Unable to load news at this time.</p>';
    homepage.appendChild(errorDiv);
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
    
    // Insert at the bottom of homepage
    homepage.appendChild(aboutContainer);
  } catch (error) {
    console.error('Error loading about us:', error);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'about-section';
    errorDiv.innerHTML = '<h3>👥 About Us</h3><p>Unable to load about us information at this time.</p>';
    homepage.appendChild(errorDiv);
  }
}

// Export functions for use in main app.js
window.HomepageModule = {
  initHomepage,
  loadAndRenderNews,
  loadAndRenderAboutUs
};