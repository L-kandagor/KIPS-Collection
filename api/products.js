const { loadDb, writeDb, sendJson, sendError } = require('../lib/db');

module.exports = async (req, res) => {
  const db = await loadDb();

  if (req.method === 'GET') {
    return sendJson(res, 200, db.products);
  }

  if (req.method === 'POST') {
    const newProduct = { id: Date.now(), ...(req.body || {}) };
    db.products.push(newProduct);
    await writeDb(db);
    return sendJson(res, 201, newProduct);
  }

  return sendError(res, 405, 'Method not allowed');
};
