const { loadDb, writeDb, sendJson, sendError } = require('../../lib/db');

module.exports = async (req, res) => {
  const { id } = req.query;
  const db = await loadDb();
  const productId = parseInt(id, 10);
  const product = db.products.find((item) => item.id === productId);

  if (!product) {
    return sendError(res, 404, 'Product not found');
  }

  if (req.method === 'GET') {
    return sendJson(res, 200, product);
  }

  if (req.method === 'PUT') {
    const updatedProduct = { ...product, ...(req.body || {}) };
    db.products = db.products.map((item) => (item.id === productId ? updatedProduct : item));
    await writeDb(db);
    return sendJson(res, 200, updatedProduct);
  }

  if (req.method === 'DELETE') {
    db.products = db.products.filter((item) => item.id !== productId);
    await writeDb(db);
    res.statusCode = 204;
    return res.end();
  }

  return sendError(res, 405, 'Method not allowed');
};
