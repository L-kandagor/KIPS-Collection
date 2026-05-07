const { loadDb, writeDb, sendJson, sendError } = require('../../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const rawProductId = req.body?.productId;
  const rawQuantity = req.body?.quantity ?? 1;
  const productId = Number(rawProductId);
  const quantity = Number(rawQuantity);

  if (!rawProductId || Number.isNaN(productId)) {
    return sendError(res, 400, 'Product ID is required');
  }
  if (Number.isNaN(quantity) || quantity <= 0) {
    return sendError(res, 400, 'Quantity must be a positive number');
  }

  const db = await loadDb();
  const existingItem = db.cart.find((item) => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    db.cart.push({ productId, quantity });
  }

  await writeDb(db);
  sendJson(res, 200, { message: 'Added to cart' });
};
