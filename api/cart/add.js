const { connectToDatabase, parseBody, CartItem, sendJson, sendError } = require('../../lib/db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  try {
    const body = await parseBody(req);
    const rawProductId = body?.productId;
    const rawQuantity = body?.quantity ?? 1;
    const productId = Number(rawProductId);
    const quantity = Number(rawQuantity);

    if (!rawProductId || Number.isNaN(productId)) {
      return sendError(res, 400, 'Product ID is required');
    }
    if (Number.isNaN(quantity) || quantity <= 0) {
      return sendError(res, 400, 'Quantity must be a positive number');
    }

    await connectToDatabase();
    let existingItem = await CartItem.findOne({ productId });
    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      const newItem = new CartItem({ productId, quantity });
      await newItem.save();
    }

    sendJson(res, 200, { message: 'Added to cart' });
  } catch (error) {
    console.error('Cart add error:', error);
    sendError(res, 500, 'Internal server error');
  }
};
