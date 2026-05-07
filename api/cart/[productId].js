const { connectToDatabase, CartItem, sendJson, sendError } = require('../../lib/db');

module.exports = async (req, res) => {
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
    console.error(error);
    sendError(res, 500, 'Internal server error');
  }
};
