const { connectToDatabase, parseBody, Order, CartItem, sendJson, sendError } = require('../lib/db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const orders = await Order.find({});
      return sendJson(res, 200, orders.map(o => ({ id: o._id, ...o.toObject() })));
    }

    if (req.method === 'POST') {
      const body = await parseBody(req);
      const { total } = body;
      if (typeof total !== 'number') {
        return sendError(res, 400, 'Order total is required');
      }

      const cartItems = await CartItem.find({});
      const items = cartItems.map(item => ({ productId: item.productId, quantity: item.quantity }));
      const order = new Order({
        items,
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
    console.error('Orders error:', error);
    sendError(res, 500, 'Internal server error');
  }
};
