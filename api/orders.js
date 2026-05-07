const { loadDb, writeDb, sendJson, sendError } = require('../lib/db');

module.exports = async (req, res) => {
  const db = await loadDb();

  if (req.method === 'GET') {
    return sendJson(res, 200, db.orders);
  }

  if (req.method === 'POST') {
    const { total } = req.body || {};
    if (typeof total !== 'number') {
      return sendError(res, 400, 'Order total is required');
    }

    const order = {
      id: Date.now(),
      items: db.cart,
      total,
      timestamp: new Date().toISOString(),
    };

    db.orders.push(order);
    db.cart = [];
    await writeDb(db);
    return sendJson(res, 201, order);
  }

  return sendError(res, 405, 'Method not allowed');
};
