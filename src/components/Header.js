import React from 'react';

function Header() {
  return (
    <header className="header">
      <div className="title-wrapper">
        <h1 className="main-title">
          <img src="assets/logo.png" alt="Delta Dash logo" className="site-logo" />
          <span className="site-title-text">
            <span className="online">Online</span>
            <span className="assistant">Assistant</span>
          </span>
        </h1>
        <p className="subtitle">F1 motorsports strategy boardgame assistant</p>
      </div>
    </header>
  );
}

export default Header;