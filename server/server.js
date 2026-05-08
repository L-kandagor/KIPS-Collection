const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const registerApiRoutes = require('./api-router');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(compression());
app.use(express.json({ limit: '1mb' }));

// CORS — allow your frontend to talk to the API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Static frontend (only serve what you need)
const repoRoot = path.join(__dirname, '..');
app.use('/css', express.static(path.join(repoRoot, 'css'), { maxAge: '30d' }));
app.use('/js', express.static(path.join(repoRoot, 'js'), { maxAge: '30d' }));

// Serve homepage and other top-level html pages
app.get('/', (req, res) => {
  res.sendFile(path.join(repoRoot, 'index.html'));
});
app.get('/signup.html', (req, res) => {
  res.sendFile(path.join(repoRoot, 'signup.html'));
});
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(repoRoot, 'login.html'));
});
app.get('/cart.html', (req, res) => {
  res.sendFile(path.join(repoRoot, 'cart.html'));
});
app.get('/products.html', (req, res) => {
  res.sendFile(path.join(repoRoot, 'products.html'));
});
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(repoRoot, 'admin.html'));
});

// API routes (Mongo/Mongoose-backed)
app.use('/api', registerApiRoutes);

// Fallback for SPA-ish navigation
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(repoRoot, 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
