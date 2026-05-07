const { loadDb, sendJson, sendError } = require('../../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return sendError(res, 405, 'Method not allowed');
  }

  const db = await loadDb();
  sendJson(res, 200, db.cart);
};
