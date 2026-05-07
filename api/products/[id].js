const { connectToDatabase, Product, sendJson, sendError } = require('../../lib/db');

module.exports = async (req, res) => {
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
      Object.assign(product, req.body || {});
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
    console.error(error);
    sendError(res, 500, 'Internal server error');
  }
};
