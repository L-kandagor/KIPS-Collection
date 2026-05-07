const { connectToDatabase, CartItem, sendJson, sendError } = require('../../../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'PUT') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { productId } = req.query;
  const quantity = Number(req.body?.quantity);
  if (Number.isNaN(quantity)) {
    return sendError(res, 400, 'Quantity must be a number');
  }

  try {
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
    console.error(error);
    sendError(res, 500, 'Internal server error');
  }
};
