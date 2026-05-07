const { connectToDatabase, CartItem, sendJson, sendError } = require('../../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return sendError(res, 405, 'Method not allowed');
  }

  try {
    await connectToDatabase();
    const cart = await CartItem.find({});
    sendJson(res, 200, cart.map(item => item.toObject()));
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Internal server error');
  }
};
