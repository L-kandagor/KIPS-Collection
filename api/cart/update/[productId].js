const { connectToDatabase, parseBody, CartItem, sendJson, sendError } = require('../../../lib/db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return sendError(res, 405, 'Method not allowed');
  }

  try {
    const { productId } = req.query;
    const body = await parseBody(req);
    const quantity = Number(body?.quantity);
    if (Number.isNaN(quantity)) {
      return sendError(res, 400, 'Quantity must be a number');
    }

    await connectToDatabase();
    const item = await CartItem.findOne({ productId: parseInt(productId, 10) });

    if (!item) {
      return sendError(res, 404, 'Cart item not found');
    }

    if (quantity <= 0) {
      await CartItem.deleteOne({ _id: item._id });
    } else {
      item.quantity = quantity;
      await item.save();
    }

    sendJson(res, 200, { message: 'Cart updated' });
  } catch (error) {
    console.error('Cart update error:', error);
    sendError(res, 500, 'Internal server error');
  }
};
