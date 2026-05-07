const { connectToDatabase, parseBody, Product, sendJson, sendError } = require('../lib/db');

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
      const products = await Product.find({});
      return sendJson(res, 200, products.map(p => ({ id: p._id, ...p.toObject() })));
    }

    if (req.method === 'POST') {
      const body = await parseBody(req);
      const newProduct = new Product(body || {});
      await newProduct.save();
      return sendJson(res, 201, { id: newProduct._id, ...newProduct.toObject() });
    }

    return sendError(res, 405, 'Method not allowed');
  } catch (error) {
    console.error('Products error:', error);
    sendError(res, 500, 'Internal server error');
  }
};
