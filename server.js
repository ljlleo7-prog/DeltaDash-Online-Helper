const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - serve from build directory for production
app.use('/deltadash', express.static('build'));
app.use(express.static('build'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/deltadash', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// API endpoint for assistant tasks
app.post('/api/assist', (req, res) => {
  const { message } = req.body;
  
  // Basic echo response - extend with actual logic
  res.json({
    success: true,
    message: `Processing: ${message}`,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Delta Dash Online Assistant is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Delta Dash Online Assistant is running on http://localhost:${PORT}`);
});
