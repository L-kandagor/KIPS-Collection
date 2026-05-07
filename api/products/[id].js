const { connectToDatabase, parseBody, Product, sendJson, sendError } = require('../../lib/db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();
    const { id } = req.query;
    const product = await Product.findById(id);

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    if (req.method === 'GET') {
      return sendJson(res, 200, { id: product._id, ...product.toObject() });
    }

    if (req.method === 'PUT') {
      const body = await parseBody(req);
      Object.assign(product, body || {});
      await product.save();
      return sendJson(res, 200, { id: product._id, ...product.toObject() });
    }

    if (req.method === 'DELETE') {
      await Product.findByIdAndDelete(id);
      res.statusCode = 204;
      return res.end();
    }

    return sendError(res, 405, 'Method not allowed');
  } catch (error) {
    console.error('Product detail error:', error);
    sendError(res, 500, 'Internal server error');
  }
};
