const { loadDb, writeDb, sendJson, sendError } = require('../../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'DELETE') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { productId } = req.query;
  const db = await loadDb();
  db.cart = db.cart.filter((item) => item.productId !== parseInt(productId, 10));
  await writeDb(db);

  res.statusCode = 204;
  res.end();
};
