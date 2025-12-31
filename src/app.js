import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomePage from './components/Homepage';
import AboutPage from './components/AboutPage';
import VersionPage from './components/VersionPage';
import StrategyPage from './components/StrategyPage';
import FeedbackPage from './components/FeedbackPage';
import DriverRollPage from './components/DriverRollPage';
import FAQPage from './components/FAQPage';
import Footer from './components/Footer';
import { setupFrontBackground } from './utils/frontBackground';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  const [activePage, setActivePage] = useState('homepage');

  useEffect(() => {
    // Initialize front background effect
    setupFrontBackground();
  }, []);



  const pages = {
    homepage: <HomePage />,
    about: <AboutPage />,
    version: <VersionPage />,
    strategy: <StrategyPage />,
    faq: <FAQPage />,
    driverroll: <DriverRollPage />,
    feedback: <FeedbackPage />
  };

  return (
    <LanguageProvider>
      <div className="App">
        <div id="front-bg" aria-hidden="true"></div>
        <div className="container">
          <Header />
          <Navigation activePage={activePage} setActivePage={setActivePage} />
          <main className="main-content">
            {pages[activePage]}
          </main>
          <Footer />
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;