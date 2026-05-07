const { connectToDatabase, Product, sendJson, sendError } = require('../lib/db');

module.exports = async (req, res) => {
  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const products = await Product.find({});
      return sendJson(res, 200, products.map(p => ({ id: p._id, ...p.toObject() })));
    }

    if (req.method === 'POST') {
      const newProduct = new Product(req.body || {});
      await newProduct.save();
      return sendJson(res, 201, { id: newProduct._id, ...newProduct.toObject() });
    }

    return sendError(res, 405, 'Method not allowed');
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Internal server error');
  }
};
