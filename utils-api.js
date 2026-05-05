const express = require('express');
const cors = require('cors');
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const routes = require('./routes');

const app = express();
const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, '../public');

// Database setup
const dbPath = path.join(__dirname, 'database.json');
const adapter = new JSONFile(dbPath);
const db = new Low(adapter);

// Initialize database
async function initDb() {
  await db.read();
  db.data ||= { products: [], users: [], orders: [], cart: [] };
  await db.write();
}

initDb();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC_DIR));

// Routes
app.use('/api', routes(db));

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 KIPS Collection server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
});