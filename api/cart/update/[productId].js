const { loadDb, writeDb, sendJson, sendError } = require('../../../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'PUT') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { productId } = req.query;
  const quantity = Number(req.body?.quantity);
  if (Number.isNaN(quantity)) {
    return sendError(res, 400, 'Quantity must be a number');
  }

  const db = await loadDb();
  const index = db.cart.findIndex((item) => item.productId === parseInt(productId, 10));

  if (index === -1) {
    return sendError(res, 404, 'Cart item not found');
  }

  if (quantity <= 0) {
    db.cart.splice(index, 1);
  } else {
    db.cart[index].quantity = quantity;
  }

  await writeDb(db);
  sendJson(res, 200, { message: 'Cart updated' });
};
