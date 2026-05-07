const { connectToDatabase, CartItem, sendJson, sendError } = require('../../lib/db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { productId } = req.query;

  try {
    await connectToDatabase();
    await CartItem.deleteOne({ productId: parseInt(productId, 10) });
    res.statusCode = 204;
    res.end();
  } catch (error) {
    console.error('Cart delete error:', error);
    sendError(res, 500, 'Internal server error');
  }
};
