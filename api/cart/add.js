const { connectToDatabase, CartItem, sendJson, sendError } = require('../../lib/db');

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

  try {
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
    console.error(error);
    sendError(res, 500, 'Internal server error');
  }
};
