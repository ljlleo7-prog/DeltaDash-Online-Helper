import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Load the existing application script
import './app.js';

// Render React root (will be hidden, app logic runs via app.js)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<></>);
