const { connectToDatabase, CartItem, sendJson, sendError } = require('../../lib/db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return sendError(res, 405, 'Method not allowed');
  }

  try {
    await connectToDatabase();
    const cart = await CartItem.find({});
    sendJson(res, 200, cart.map(item => item.toObject()));
  } catch (error) {
    console.error('Cart error:', error);
    sendError(res, 500, 'Internal server error');
  }
};
