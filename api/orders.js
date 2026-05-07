const { connectToDatabase, Order, CartItem, sendJson, sendError } = require('../lib/db');

module.exports = async (req, res) => {
  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const orders = await Order.find({});
      return sendJson(res, 200, orders.map(o => ({ id: o._id, ...o.toObject() })));
    }

    if (req.method === 'POST') {
      const { total } = req.body || {};
      if (typeof total !== 'number') {
        return sendError(res, 400, 'Order total is required');
      }

      const cartItems = await CartItem.find({});
      const order = new Order({
        items: cartItems,
        total,
        timestamp: new Date(),
      });
      await order.save();

      // Clear cart
      await CartItem.deleteMany({});

      return sendJson(res, 201, { id: order._id, ...order.toObject() });
    }

    return sendError(res, 405, 'Method not allowed');
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Internal server error');
  }
};
