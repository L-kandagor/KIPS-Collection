const fs = require('fs').promises;
const path = require('path');

const dbPath = path.join(process.cwd(), 'server', 'database.json');

async function readDb() {
  try {
    const content = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { products: [], users: [], cart: [], orders: [] };
    }
    throw error;
  }
}

async function writeDb(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

async function loadDb() {
  const db = await readDb();
  db.products ||= [];
  db.users ||= [];
  db.cart ||= [];
  db.orders ||= [];
  return db;
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}

module.exports = {
  loadDb,
  writeDb,
  sendJson,
  sendError,
};
